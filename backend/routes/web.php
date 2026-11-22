<?php

use App\Support\Documents;
use Illuminate\Support\Facades\Route;

// Built from the current content, so new procedures and articles appear without a redeploy
Route::get('/sitemap.xml', function () {
    $site = rtrim(config('app.url'), '/');
    $c = Documents::get(Documents::CONTENT) ?? [];
    $paths = [['/', '1.0'], ['/about', '0.8'], ['/procedures', '0.9'], ['/branches', '0.8'], ['/book', '0.9'],
        ['/before-your-visit', '0.7'], ['/faq', '0.7'], ['/videos', '0.6'], ['/articles', '0.6'], ['/contact', '0.6']];
    foreach ($c['surgeries'] ?? [] as $s) {
        if (($s['enabled'] ?? true) && ! empty($s['slug'])) {
            $paths[] = ['/procedures/'.$s['slug'], '0.8'];
        }
    }
    foreach ($c['articles'] ?? [] as $a) {
        if (! empty($a['enabled']) && ! empty($a['slug'])) {
            $paths[] = ['/articles/'.$a['slug'], '0.5'];
        }
    }
    $today = now()->toDateString();
    $urls = implode("\n", array_map(fn ($p) => "  <url><loc>{$site}".e($p[0])."</loc><lastmod>{$today}</lastmod><priority>{$p[1]}</priority></url>", $paths));

    return response("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n{$urls}\n</urlset>\n", 200, ['Content-Type' => 'application/xml']);
});

Route::get('/robots.txt', fn () => response("User-agent: *\nDisallow: /dashboard\nDisallow: /api/\n\nSitemap: ".rtrim(config('app.url'), '/')."/sitemap.xml\n", 200, ['Content-Type' => 'text/plain']));

// Everything else is the React app (it handles its own routes, including /dashboard)
Route::fallback(function () {
    $spa = resource_path('spa/index.html');
    abort_unless(is_file($spa), 503, 'Website build missing: run "npm run build:server" in the project root');

    return response()->file($spa, ['Content-Type' => 'text/html; charset=UTF-8', 'Cache-Control' => 'no-cache']);
});
