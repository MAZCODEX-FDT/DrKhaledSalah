<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\Documents;
use App\Support\Sync;
use Illuminate\Http\Request;

class ContentController extends Controller
{
    /** Public: what the website shows. Null until the first save from the dashboard (the site then uses its built-in content). */
    public function show()
    {
        return response()->json(['content' => Documents::publicContent(), 'revision' => Documents::revision(Documents::CONTENT)])
            ->header('Cache-Control', 'no-cache');
    }

    /** Dashboard: includes the API keys. */
    public function admin()
    {
        return [
            'content' => Documents::get(Documents::CONTENT), 'revision' => Documents::revision(Documents::CONTENT),
            'serverKeys' => ['youtube' => (bool) config('services.youtube.key'), 'places' => (bool) config('services.google_places.key')],
        ];
    }

    public function update(Request $r)
    {
        $r->validate(['content' => 'required|array', 'content.version' => 'required|integer']);
        $saved = Documents::saveContent($r->input('content'));

        return ['content' => $saved, 'revision' => Documents::revision(Documents::CONTENT)];
    }

    public function syncYoutube()
    {
        try {
            $added = Sync::youtube();
        } catch (\Throwable $e) {
            return response()->json(['message' => $e->getMessage(), 'content' => Documents::get(Documents::CONTENT)], 422);
        }

        return ['added' => $added, 'content' => Documents::get(Documents::CONTENT)];
    }

    public function syncGoogle()
    {
        try {
            Sync::google();
        } catch (\Throwable $e) {
            return response()->json(['message' => $e->getMessage(), 'content' => Documents::get(Documents::CONTENT)], 422);
        }

        return ['content' => Documents::get(Documents::CONTENT)];
    }

    public function places(Request $r)
    {
        $q = $r->validate(['q' => 'required|string|max:120'])['q'];
        try {
            return ['places' => Sync::findPlaces($q)];
        } catch (\Throwable $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}
