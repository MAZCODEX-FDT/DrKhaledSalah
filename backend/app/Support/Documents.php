<?php

namespace App\Support;

use App\Models\Document;
use Closure;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Reads and writes the two JSON documents:
 *  - "content": everything the public website shows (edited in Dashboard → Website)
 *  - "dashboard": patients, appointments, inquiries, review requests (encrypted at rest with APP_KEY)
 */
class Documents
{
    public const CONTENT = 'content';
    public const DASHBOARD = 'dashboard';

    /** Fields that must never reach the public website. */
    private const SECRET_PATHS = [['youtube', 'apiKey'], ['google', 'apiKey']];

    public static function get(string $key): ?array
    {
        $doc = Document::where('key', $key)->first();
        if (! $doc) {
            return null;
        }
        $raw = $key === self::DASHBOARD ? Crypt::decryptString($doc->data) : $doc->data;

        return json_decode($raw, true);
    }

    public static function revision(string $key): int
    {
        return (int) (Document::where('key', $key)->value('revision') ?? 0);
    }

    public static function put(string $key, array $data): int
    {
        $raw = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        if ($key === self::DASHBOARD) {
            $raw = Crypt::encryptString($raw);
        }
        $doc = Document::firstOrNew(['key' => $key]);
        $doc->data = $raw;
        $doc->revision = ($doc->revision ?? 0) + 1;
        $doc->save();

        return $doc->revision;
    }

    /** Read-modify-write under a row lock, so the booking form and cron jobs never overwrite each other. */
    public static function update(string $key, Closure $fn, ?array $empty = null): array
    {
        return DB::transaction(function () use ($key, $fn, $empty) {
            Document::where('key', $key)->lockForUpdate()->first();
            $next = $fn(self::get($key) ?? $empty ?? []);
            self::put($key, $next);

            return $next;
        });
    }

    /** The content as visitors see it: API keys removed. */
    public static function publicContent(): ?array
    {
        $c = self::get(self::CONTENT);
        if (! $c) {
            return null;
        }
        foreach (self::SECRET_PATHS as [$a, $b]) {
            if (isset($c[$a][$b])) {
                $c[$a][$b] = '';
            }
        }

        return $c;
    }

    /**
     * Saves content from the dashboard.
     * Images arrive as data: URLs (the dashboard compresses them in the browser); they are written to
     * public/uploads/media and replaced by their public URL, so the content JSON stays small.
     * Results written by the weekly sync since the editor loaded the page are kept.
     */
    public static function saveContent(array $incoming): array
    {
        return self::update(self::CONTENT, function (array $stored) use ($incoming) {
            foreach ($incoming['media'] ?? [] as $i => $m) {
                if (isset($m['src']) && str_starts_with($m['src'], 'data:image/')) {
                    $incoming['media'][$i]['src'] = self::storeDataUrl($m['src']);
                }
            }
            // Keep the secret keys when the editor left them as they were
            foreach (self::SECRET_PATHS as [$a, $b]) {
                if (! isset($incoming[$a][$b]) && isset($stored[$a][$b])) {
                    $incoming[$a][$b] = $stored[$a][$b];
                }
            }

            return Sync::mergeNewer($stored, $incoming);
        });
    }

    private static function storeDataUrl(string $url): string
    {
        if (! preg_match('#^data:image/(webp|jpeg|jpg|png|gif|avif);base64,(.+)$#s', $url, $m)) {
            abort(422, 'Unsupported image');
        }
        $bytes = base64_decode($m[2], true);
        if ($bytes === false || strlen($bytes) > 8 * 1024 * 1024) {
            abort(422, 'Image too large');
        }
        $ext = $m[1] === 'jpeg' ? 'jpg' : $m[1];
        $path = 'media/'.now()->format('Y/m').'/'.Str::lower(Str::random(20)).'.'.$ext;
        Storage::disk('uploads')->put($path, $bytes);

        return Storage::disk('uploads')->url($path);
    }
}
