<?php

namespace App\Support;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Server-side refresh of the YouTube videos and the Google rating and reviews.
 * Runs from the scheduler (see routes/console.php) and from the dashboard's "Sync now" buttons.
 * Keys come from .env (YOUTUBE_API_KEY, GOOGLE_PLACES_API_KEY) or, if empty there, from Dashboard → Website.
 */
class Sync
{
    private const YT = 'https://www.googleapis.com/youtube/v3';
    private const PLACES = 'https://places.googleapis.com/v1';

    public static function youtubeKey(array $c): string
    {
        return (string) (config('services.youtube.key') ?: ($c['youtube']['apiKey'] ?? ''));
    }

    public static function placesKey(array $c): string
    {
        return (string) (config('services.google_places.key') ?: ($c['google']['apiKey'] ?? '') ?: self::youtubeKey($c));
    }

    // ---------- YouTube ----------

    /** Adds new uploads from the doctor's channel and refreshes view counts. Returns how many were added. */
    public static function youtube(): int
    {
        $c = Documents::get(Documents::CONTENT) ?? throw new RuntimeException('No content saved yet');
        $key = self::youtubeKey($c);
        try {
            if (! $key) {
                throw new RuntimeException('No API key');
            }
            $found = self::fetchUploads($c['youtube']['channel'] ?? '', $key);
        } catch (\Throwable $e) {
            Documents::update(Documents::CONTENT, fn ($d) => self::set($d, 'youtube', ['lastError' => $e->getMessage()]));
            throw $e;
        }
        $added = 0;
        Documents::update(Documents::CONTENT, function ($d) use ($found, &$added) {
            $videos = $d['videos'] ?? [];
            $have = [];
            foreach ($videos as $i => $v) {
                $id = self::youtubeId($v['url'] ?? '');
                $have[$id] = true;
                if (isset($found[$id])) {
                    $f = $found[$id];
                    $videos[$i]['views'] = $f['views'] ?: ($v['views'] ?? '');
                    $videos[$i]['viewCount'] = $f['viewCount'] ?? ($v['viewCount'] ?? null);
                    $videos[$i]['published'] = $v['published'] ?? $f['published'];
                }
            }
            $new = [];
            foreach ($found as $id => $f) {
                if (isset($have[$id])) {
                    continue;
                }
                $new[] = [
                    'id' => Str::lower(Str::random(8)), 'url' => "https://www.youtube.com/watch?v={$id}",
                    'views' => $f['views'], 'viewCount' => $f['viewCount'], 'published' => $f['published'],
                    'featured' => false, 'enabled' => (bool) ($d['youtube']['autoShow'] ?? false), 'addedAt' => now()->toIso8601ZuluString(),
                    'title' => ['ar' => $f['title'], 'en' => $f['title']],
                ];
            }
            $added = count($new);
            $d['videos'] = [...$new, ...$videos];

            return self::set($d, 'youtube', ['lastSync' => now()->toIso8601ZuluString(), 'lastError' => null]);
        });

        return $added;
    }

    private static function fetchUploads(string $channel, string $key): array
    {
        $get = function (string $path, array $q) use ($key) {
            $r = Http::timeout(20)->get(self::YT.'/'.$path, $q + ['key' => $key]);
            if (! $r->ok()) {
                throw new RuntimeException($r->json('error.message') ?? 'YouTube API error '.$r->status());
            }

            return $r->json();
        };
        $v = trim($channel);
        $q = preg_match('/(UC[\w-]{22})/', $v, $m) ? ['id' => $m[1]]
            : ['forHandle' => '@'.ltrim(preg_match('/@([\w.-]+)/', $v, $h) ? $h[1] : preg_replace(['#^https?://(www\.)?youtube\.com/#', '#/.*$#'], '', $v), '@')];
        $uploads = $get('channels', ['part' => 'contentDetails'] + $q)['items'][0]['contentDetails']['relatedPlaylists']['uploads']
            ?? throw new RuntimeException('Channel not found');

        $found = [];
        $page = null;
        do {
            $pl = $get('playlistItems', array_filter(['part' => 'snippet,contentDetails', 'maxResults' => 50, 'playlistId' => $uploads, 'pageToken' => $page]));
            foreach ($pl['items'] ?? [] as $it) {
                $id = $it['snippet']['resourceId']['videoId'] ?? null;
                $title = $it['snippet']['title'] ?? '';
                if (! $id || isset($found[$id]) || in_array($title, ['Private video', 'Deleted video'], true)) {
                    continue;
                }
                $found[$id] = ['title' => $title, 'published' => $it['contentDetails']['videoPublishedAt'] ?? null, 'views' => '', 'viewCount' => null];
            }
            $page = $pl['nextPageToken'] ?? null;
        } while ($page);

        foreach (array_chunk(array_keys($found), 50) as $ids) {
            foreach ($get('videos', ['part' => 'statistics', 'id' => implode(',', $ids)])['items'] ?? [] as $it) {
                if (isset($it['statistics']['viewCount'])) {
                    $n = (int) $it['statistics']['viewCount'];
                    $found[$it['id']]['viewCount'] = $n;
                    $found[$it['id']]['views'] = self::compact($n);
                }
            }
        }

        return $found;
    }

    private static function compact(int $n): string
    {
        $fmt = fn ($x, $big) => rtrim(rtrim(number_format($x, $big ? 0 : 1, '.', ''), '0'), '.');

        return $n >= 1e6 ? $fmt($n / 1e6, $n >= 1e7).'M' : ($n >= 1e3 ? $fmt($n / 1e3, $n >= 1e4).'K' : (string) $n);
    }

    public static function youtubeId(string $url): string
    {
        return preg_match('#(?:v=|youtu\.be/|shorts/|embed/)([\w-]{11})#', $url, $m) ? $m[1] : $url;
    }

    // ---------- Google ----------

    private static function places(string $method, string $url, string $fields, string $key, array $body = []): array
    {
        $req = Http::timeout(20)->withHeaders(['X-Goog-Api-Key' => $key, 'X-Goog-FieldMask' => $fields]);
        $r = $method === 'POST' ? $req->post($url, $body) : $req->get($url);
        if (! $r->ok()) {
            throw new RuntimeException($r->json('error.message') ?? 'Google error '.$r->status());
        }

        return $r->json() ?? [];
    }

    /** Lets the dashboard find the clinic's Google listing by name. */
    public static function findPlaces(string $query): array
    {
        $c = Documents::get(Documents::CONTENT) ?? [];
        $key = self::placesKey($c) ?: throw new RuntimeException('No API key');
        $j = self::places('POST', self::PLACES.'/places:searchText', 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount', $key,
            ['textQuery' => $query, 'languageCode' => 'ar', 'regionCode' => 'EG']);

        return array_map(fn ($p) => [
            'id' => $p['id'], 'name' => $p['displayName']['text'] ?? '', 'address' => $p['formattedAddress'] ?? '',
            'rating' => $p['rating'] ?? null, 'count' => $p['userRatingCount'] ?? null,
        ], $j['places'] ?? []);
    }

    /** Pulls the live rating, count and latest reviews. Reviews hidden in the dashboard stay hidden. */
    public static function google(): void
    {
        $c = Documents::get(Documents::CONTENT) ?? throw new RuntimeException('No content saved yet');
        $g = $c['google'] ?? [];
        try {
            if (empty($g['placeId'])) {
                throw new RuntimeException('Choose the clinic listing first');
            }
            $key = self::placesKey($c) ?: throw new RuntimeException('No API key');
            $j = self::places('GET', self::PLACES.'/places/'.rawurlencode($g['placeId']).'?languageCode=ar', 'displayName,rating,userRatingCount,googleMapsUri,reviews', $key);
        } catch (\Throwable $e) {
            Documents::update(Documents::CONTENT, fn ($d) => self::set($d, 'google', ['lastError' => $e->getMessage()]));
            throw $e;
        }
        Documents::update(Documents::CONTENT, function ($d) use ($j) {
            $old = $d['google']['reviews'] ?? [];
            $hidden = array_column(array_filter($old, fn ($r) => ! empty($r['hidden'])), 'id');
            $fresh = array_map(function ($r) use ($hidden) {
                $t = $r['originalText'] ?? $r['text'] ?? [];

                return [
                    'id' => $r['name'], 'author' => $r['authorAttribution']['displayName'] ?? '', 'photo' => $r['authorAttribution']['photoUri'] ?? '',
                    'rating' => $r['rating'] ?? 0, 'text' => trim($t['text'] ?? ''), 'lang' => $t['languageCode'] ?? '',
                    'time' => $r['publishTime'] ?? '', 'when' => $r['relativePublishTimeDescription'] ?? '', 'hidden' => in_array($r['name'], $hidden, true),
                ];
            }, $j['reviews'] ?? []);
            $seen = array_column($fresh, 'id');
            $all = [...$fresh, ...array_values(array_filter($old, fn ($r) => ! in_array($r['id'], $seen, true)))];
            usort($all, fn ($a, $b) => strcmp($b['time'] ?? '', $a['time'] ?? ''));

            return self::set($d, 'google', [
                'rating' => $j['rating'] ?? null, 'count' => $j['userRatingCount'] ?? null, 'mapsUrl' => $j['googleMapsUri'] ?? '',
                'placeName' => $j['displayName']['text'] ?? ($d['google']['placeName'] ?? ''), 'reviews' => array_slice($all, 0, 12),
                'lastSync' => now()->toIso8601ZuluString(), 'lastError' => null,
            ]);
        });
    }

    // ---------- helpers ----------

    private static function set(array $d, string $k, array $patch): array
    {
        $d[$k] = array_merge($d[$k] ?? [], $patch);

        return $d;
    }

    /**
     * When the dashboard saves, keep what a sync wrote after the editor loaded the page:
     * the Google numbers and reviews (with the editor's hide choices), and newly found videos.
     */
    public static function mergeNewer(array $stored, array $incoming): array
    {
        $newer = fn (string $k) => ($stored[$k]['lastSync'] ?? '') > ($incoming[$k]['lastSync'] ?? '');

        if ($stored && $newer('google')) {
            $hidden = [];
            foreach ($incoming['google']['reviews'] ?? [] as $r) {
                $hidden[$r['id']] = ! empty($r['hidden']);
            }
            $g = $stored['google'];
            foreach ($g['reviews'] ?? [] as $i => $r) {
                $g['reviews'][$i]['hidden'] = $hidden[$r['id']] ?? ! empty($r['hidden']);
            }
            $incoming['google'] = array_merge($incoming['google'] ?? [], array_intersect_key($g, array_flip(['rating', 'count', 'mapsUrl', 'placeName', 'reviews', 'lastSync', 'lastError'])));
        }
        if ($stored && $newer('youtube')) {
            $known = array_map(fn ($v) => self::youtubeId($v['url'] ?? ''), $incoming['videos'] ?? []);
            $loadedAt = $incoming['youtube']['lastSync'] ?? '';
            // Only videos the sync added after the editor's copy was loaded; anything else missing was deleted on purpose
            $fresh = array_values(array_filter($stored['videos'] ?? [], fn ($v) => ! in_array(self::youtubeId($v['url'] ?? ''), $known, true) && ($v['addedAt'] ?? '') > $loadedAt));
            $incoming['videos'] = [...$fresh, ...($incoming['videos'] ?? [])];
            $incoming['youtube'] = array_merge($incoming['youtube'] ?? [], ['lastSync' => $stored['youtube']['lastSync'], 'lastError' => $stored['youtube']['lastError'] ?? null]);
        }

        return $incoming;
    }
}
