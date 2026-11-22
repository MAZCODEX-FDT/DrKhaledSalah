import { useSyncExternalStore } from 'react'
import type { L } from './i18n'
import { branches as seedBranches, doctor as seedDoctor, generalFaqs, stats as seedStats, surgeries as baseSurgeries, type Surgery } from '../content/site'
import { extraSurgeries } from '../content/surgeries-extra'

/**
 * Website content store (CMS), edited from Dashboard → Website.
 * DEMO: persisted in this browser's localStorage, so edits are visible only in the same browser.
 * Before launch, swap load/commit for a real backend (e.g. Supabase tables + Storage for images)
 * so changes publish for every visitor.
 */

export type MediaItem = { id: string; name: string; src: string; alt: L; enabled: boolean; createdAt: string }
export type QA = { id: string; q: L; a: L; enabled: boolean }
export type CmsSurgery = Omit<Surgery, 'faqs'> & { id: string; enabled: boolean; image: string | null; video: string; faqs: QA[] }
export type CmsBranch = (typeof seedBranches)[number] & { enabled: boolean; image: string | null }
export type CmsStat = { id: string; value: number; suffix: string; label: L; enabled: boolean }
export type CmsDoctor = { name: L; title: L; promise: L; bio: L; highlights: L[]; portrait: string | null; heroImage: string | null }

export interface ContentDB {
  version: 1
  doctor: CmsDoctor
  surgeries: CmsSurgery[]
  faqs: QA[]
  branches: CmsBranch[]
  stats: CmsStat[]
  media: MediaItem[]
}

const KEY = 'ks-content-v1'
export const uid = () => Math.random().toString(36).slice(2, 10)

function seed(): ContentDB {
  const qa = (x: { q: L; a: L }): QA => ({ id: uid(), q: x.q, a: x.a, enabled: true })
  return {
    version: 1,
    doctor: {
      ...seedDoctor,
      bio: {
        ar: 'أكتر من 15 سنة في جراحة الأطفال وحديثي الولادة، وقناة بيتعلم منها أكتر من 100 ألف أب وأم.',
        en: 'Over 15 years in pediatric and neonatal surgery, and a channel more than 100,000 parents learn from.',
      },
      highlights: [
        { ar: '+15 سنة في جراحة الأطفال وحديثي الولادة', en: '15+ years in pediatric & neonatal surgery' },
        { ar: 'فرعين: التجمع الخامس والجيزة', en: 'Two branches: New Cairo and Giza' },
        { ar: 'شرح مكتوب قبل أي قرار', en: 'A written explanation before any decision' },
      ],
      portrait: null,
      heroImage: null,
    },
    surgeries: [...baseSurgeries, ...extraSurgeries].map(s => ({ ...s, id: uid(), enabled: true, image: null, video: '', faqs: s.faqs.map(qa) })),
    faqs: generalFaqs.map(qa),
    branches: seedBranches.map(b => ({ ...b, enabled: true, image: null })),
    stats: seedStats.map(s => ({ ...s, id: uid(), enabled: true })),
    media: [],
  }
}

function load(): ContentDB {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) { const d = JSON.parse(raw) as ContentDB; if (d?.version === 1) return d }
  } catch { /* fall through */ }
  return seed()
}

let db: ContentDB = load()
const subs = new Set<() => void>()
export class StorageFullError extends Error {}

function commit(next: ContentDB) {
  try { localStorage.setItem(KEY, JSON.stringify(next)) } catch (e) {
    if (e instanceof DOMException && /quota/i.test(e.name + e.message)) throw new StorageFullError('Browser storage is full')
  }
  db = next
  subs.forEach(f => f())
}
const subscribe = (f: () => void) => { subs.add(f); return () => subs.delete(f) }

export function useContent<T>(select: (d: ContentDB) => T): T {
  return useSyncExternalStore(subscribe, () => select(db))
}
export const getContent = () => db

/** Re-number surgery indexes (01, 02…) in list order. */
const renumber = (list: CmsSurgery[]) => list.map((s, i) => ({ ...s, index: String(i + 1).padStart(2, '0') }))
const move = <T,>(list: T[], i: number, dir: -1 | 1) => {
  const j = i + dir; if (j < 0 || j >= list.length) return list
  const next = [...list]; [next[i], next[j]] = [next[j], next[i]]; return next
}
type ListKey = 'surgeries' | 'faqs' | 'branches' | 'stats' | 'media'

export const cms = {
  setDoctor(patch: Partial<CmsDoctor>) { commit({ ...db, doctor: { ...db.doctor, ...patch } }) },

  upsert<K extends ListKey>(key: K, item: ContentDB[K][number]) {
    const list = db[key] as { id?: string; slug?: string }[]
    const idOf = (x: { id?: string; slug?: string }) => x.id ?? x.slug
    const exists = list.some(x => idOf(x) === idOf(item as never))
    let next = exists ? list.map(x => (idOf(x) === idOf(item as never) ? item : x)) : [...list, item]
    if (key === 'surgeries') next = renumber(next as CmsSurgery[])
    commit({ ...db, [key]: next })
  },
  remove(key: ListKey, id: string) {
    let next = (db[key] as { id?: string; slug?: string }[]).filter(x => (x.id ?? x.slug) !== id)
    if (key === 'surgeries') next = renumber(next as CmsSurgery[])
    const patch: Partial<ContentDB> = { [key]: next }
    if (key === 'media') {
      // Clear references to a deleted image
      patch.surgeries = db.surgeries.map(s => (s.image === id ? { ...s, image: null } : s))
      patch.branches = db.branches.map(b => (b.image === id ? { ...b, image: null } : b))
      patch.doctor = { ...db.doctor, portrait: db.doctor.portrait === id ? null : db.doctor.portrait, heroImage: db.doctor.heroImage === id ? null : db.doctor.heroImage }
    }
    commit({ ...db, ...patch })
  },
  toggle(key: ListKey, id: string) {
    commit({ ...db, [key]: (db[key] as { id?: string; slug?: string; enabled: boolean }[]).map(x => ((x.id ?? x.slug) === id ? { ...x, enabled: !x.enabled } : x)) })
  },
  move(key: ListKey, id: string, dir: -1 | 1) {
    const list = db[key] as { id?: string; slug?: string }[]
    let next = move(list, list.findIndex(x => (x.id ?? x.slug) === id), dir)
    if (key === 'surgeries') next = renumber(next as CmsSurgery[])
    commit({ ...db, [key]: next })
  },
  setPrimaryBranch(id: string) {
    const list = db.branches.map(b => ({ ...b, primary: b.id === id }))
    commit({ ...db, branches: [...list.filter(b => b.primary), ...list.filter(b => !b.primary)] })
  },
  addMedia(m: Omit<MediaItem, 'id' | 'createdAt' | 'enabled'>) {
    const item: MediaItem = { ...m, id: uid(), enabled: true, createdAt: new Date().toISOString() }
    commit({ ...db, media: [item, ...db.media] }); return item
  },
  reset() { commit(seed()) },
}

/** Resolve an image id to a src, or null when missing or disabled. */
export function imageSrc(d: ContentDB, id: string | null | undefined) {
  if (!id) return null
  const m = d.media.find(x => x.id === id)
  return m && m.enabled ? m.src : null
}

/** Read an uploaded file, scale it to at most `max` px and re-encode as WebP to keep storage small. */
export function compressImage(file: File, max = 1600, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k)
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(url)
      resolve(c.toDataURL('image/webp', quality))
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Not an image')) }
    img.src = url
  })
}

/** Public-site view: only enabled items, with images resolved. */
export function useSite() {
  const d = useContent(x => x)
  return {
    db: d,
    doctor: d.doctor,
    // Number procedures by their visible order on the site
    surgeries: d.surgeries.filter(s => s.enabled).map((s, i) => ({ ...s, index: String(i + 1).padStart(2, '0') })),
    faqs: d.faqs.filter(f => f.enabled),
    // Keep at least one branch so booking buttons always have a target
    branches: d.branches.some(b => b.enabled) ? d.branches.filter(b => b.enabled) : d.branches.slice(0, 1),
    stats: d.stats.filter(s => s.enabled),
    img: (id: string | null | undefined) => imageSrc(d, id),
  }
}
