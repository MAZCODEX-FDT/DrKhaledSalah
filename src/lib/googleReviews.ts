import { cms, flushContent, getContent, type GoogleReview } from './content'
import { api, BACKEND } from './api'
import { serverSync } from './youtubeSync'

/**
 * Google rating and reviews via the Places API (New).
 * The key is the website key in Google Cloud with "Places API (New)" allowed; billing must be on for that project.
 * Google returns the 5 reviews it ranks "most relevant"; the dashboard can hide any of them.
 * With the Laravel backend this runs on the server (weekly), so the key stays private and every visitor sees the same data.
 */
const API = 'https://places.googleapis.com/v1'
const keyOf = () => { const c = getContent(); return c.google.apiKey || c.youtube.apiKey }

async function call<T>(url: string, fields: string, init: RequestInit = {}): Promise<T> {
  const key = keyOf()
  if (!key) throw new Error('No API key')
  const r = await fetch(url, { ...init, headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': fields, ...(init.headers || {}) } })
  const j = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(j?.error?.message ?? `Google error ${r.status}`)
  return j as T
}

export type PlaceHit = { id: string; name: string; address: string; rating?: number; count?: number }

/** Finds the clinic's listing by name, so the dashboard can pick the right one. */
export async function findPlaces(query: string): Promise<PlaceHit[]> {
  if (BACKEND) { await flushContent(); return (await api<{ places: PlaceHit[] }>(`/admin/places?q=${encodeURIComponent(query)}`)).places }
  const j = await call<{ places?: { id: string; displayName?: { text: string }; formattedAddress?: string; rating?: number; userRatingCount?: number }[] }>(
    `${API}/places:searchText`, 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount',
    { method: 'POST', body: JSON.stringify({ textQuery: query, languageCode: 'ar', regionCode: 'EG' }) })
  return (j.places ?? []).map(p => ({ id: p.id, name: p.displayName?.text ?? '', address: p.formattedAddress ?? '', rating: p.rating, count: p.userRatingCount }))
}

type ApiReview = { name: string; rating: number; relativePublishTimeDescription?: string; publishTime?: string; text?: { text: string; languageCode: string }; originalText?: { text: string; languageCode: string }; authorAttribution?: { displayName?: string; photoUri?: string } }

/** Pulls the live rating, review count and latest reviews. Hidden choices made in the dashboard are kept. */
export async function syncReviews(): Promise<void> {
  if (BACKEND) { await serverSync('/admin/sync/google'); return }
  const g = getContent().google
  if (!g.placeId) throw new Error('Choose the clinic listing first')
  try {
    const j = await call<{ displayName?: { text: string }; rating?: number; userRatingCount?: number; googleMapsUri?: string; reviews?: ApiReview[] }>(
      `${API}/places/${encodeURIComponent(g.placeId)}?languageCode=ar`, 'displayName,rating,userRatingCount,googleMapsUri,reviews')
    const hidden = new Set(g.reviews.filter(r => r.hidden).map(r => r.id))
    const fresh: GoogleReview[] = (j.reviews ?? []).map(r => {
      const txt = r.originalText ?? r.text
      return { id: r.name, author: r.authorAttribution?.displayName ?? '', photo: r.authorAttribution?.photoUri ?? '', rating: r.rating, text: (txt?.text ?? '').trim(), lang: txt?.languageCode ?? '', time: r.publishTime ?? '', when: r.relativePublishTimeDescription ?? '', hidden: hidden.has(r.name) }
    })
    // Keep earlier reviews Google no longer returns, newest first, up to 12
    const seen = new Set(fresh.map(r => r.id))
    const reviews = [...fresh, ...g.reviews.filter(r => !seen.has(r.id))].sort((a, b) => b.time.localeCompare(a.time)).slice(0, 12)
    cms.setGoogle({ rating: j.rating ?? null, count: j.userRatingCount ?? null, mapsUrl: j.googleMapsUri ?? '', placeName: j.displayName?.text ?? g.placeName, reviews, lastSync: new Date().toISOString(), lastError: null })
  } catch (e) {
    cms.setGoogle({ lastError: (e as Error).message })
    throw e
  }
}

/** Refreshes at most once a week. */
export function autoSyncReviews(hours = 24 * 7) {
  if (BACKEND) return // weekly cron on the server (backend/routes/console.php)
  const g = getContent().google
  if (!g.placeId || !keyOf()) return
  if (g.lastSync && Date.now() - Date.parse(g.lastSync) < hours * 3600e3) return
  syncReviews().catch(() => { /* shown in the dashboard */ })
}
