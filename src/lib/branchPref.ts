import { useSyncExternalStore } from 'react'

/** The branch a visitor prefers (picked by hand or found by location), remembered in this browser. */
const KEY = 'ks-branch'
const subs = new Set<() => void>()
const read = () => { try { return localStorage.getItem(KEY) } catch { return null } }

export function setPreferredBranch(id: string) {
  try { localStorage.setItem(KEY, id) } catch { /* private mode */ }
  subs.forEach(f => f())
}
export function usePreferredBranch() {
  return useSyncExternalStore(f => { subs.add(f); return () => subs.delete(f) }, read, () => null)
}

/** Straight-line distance in km, good enough to choose between branches. */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const r = (x: number) => (x * Math.PI) / 180
  const h = Math.sin(r(b.lat - a.lat) / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lng - a.lng) / 2) ** 2
  return 12742 * Math.asin(Math.sqrt(h))
}

/** Asks the browser for the visitor's location (only when they press the button) and picks the closest branch. */
export function findNearest<T extends { id: string; lat?: number; lng?: number }>(list: T[]): Promise<T | null> {
  return new Promise(res => {
    if (!navigator.geolocation) return res(null)
    navigator.geolocation.getCurrentPosition(p => {
      const me = { lat: p.coords.latitude, lng: p.coords.longitude }
      const best = list.filter(b => b.lat != null && b.lng != null).sort((a, b) => distanceKm(me, a as { lat: number; lng: number }) - distanceKm(me, b as { lat: number; lng: number }))[0] ?? null
      if (best) setPreferredBranch(best.id)
      res(best)
    }, () => res(null), { timeout: 8000, maximumAge: 3600e3 })
  })
}
