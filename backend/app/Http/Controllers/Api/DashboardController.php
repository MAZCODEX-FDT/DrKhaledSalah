<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\Documents;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/** Patients, appointments, inquiries and review requests. Stored encrypted. Only signed-in staff can read it. */
class DashboardController extends Controller
{
    public const EMPTY = ['patients' => [], 'appointments' => [], 'inquiries' => [], 'reviews' => [],
        'settings' => ['goalSurgeries' => 25, 'goalReviews' => 40, 'adBudget' => 0, 'replyMinutes' => 15]];

    public function show()
    {
        return ['data' => Documents::get(Documents::DASHBOARD) ?? self::EMPTY, 'revision' => Documents::revision(Documents::DASHBOARD)];
    }

    public function update(Request $r)
    {
        $r->validate(['data' => 'required|array', 'data.patients' => 'array', 'data.appointments' => 'array', 'data.inquiries' => 'array']);
        $incoming = $r->input('data');
        $saved = Documents::update(Documents::DASHBOARD, function (array $stored) use ($incoming, $r) {
            // Keep booking-form requests that arrived after this editor loaded the dashboard
            $known = array_column($incoming['inquiries'] ?? [], 'id');
            $since = (string) $r->input('loadedAt', '');
            $late = array_values(array_filter($stored['inquiries'] ?? [], fn ($i) => ! in_array($i['id'], $known, true) && ($i['receivedAt'] ?? '') > $since));
            $incoming['inquiries'] = [...$late, ...($incoming['inquiries'] ?? [])];

            return $incoming;
        }, self::EMPTY);

        return ['data' => $saved, 'revision' => Documents::revision(Documents::DASHBOARD)];
    }

    /** Public: the website's booking form. Lands in Dashboard → Inquiries as "new". */
    public function inquiry(Request $r)
    {
        if ($r->filled('website')) { // honeypot field, hidden from people
            return response()->json(['ok' => true], 201);
        }
        $d = $r->validate([
            'name' => 'required|string|max:80', 'phone' => ['required', 'string', 'max:30', 'regex:/^[+\d\s()-]{7,}$/'],
            'branch' => 'required|string|max:40', 'procedure' => 'required|string|max:60', 'message' => 'nullable|string|max:1000',
        ]);
        $now = now();
        $item = [
            'id' => Str::lower(Str::random(8)), 'name' => strip_tags($d['name']), 'phone' => $d['phone'], 'branch' => $d['branch'],
            'procedure' => $d['procedure'], 'source' => 'website', 'stage' => 'new', 'message' => strip_tags($d['message'] ?? ''),
            'createdAt' => $now->toDateString(), 'lastContact' => $now->toDateString(), 'receivedAt' => $now->toIso8601ZuluString(),
        ];
        Documents::update(Documents::DASHBOARD, function (array $db) use ($item) {
            $db['inquiries'] = [$item, ...($db['inquiries'] ?? [])];

            return $db;
        }, self::EMPTY);

        return response()->json(['ok' => true], 201);
    }
}
