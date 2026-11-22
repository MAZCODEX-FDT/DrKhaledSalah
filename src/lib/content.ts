import { useSyncExternalStore } from 'react'
import type { L } from './i18n'
import { branches as seedBranches, doctor as seedDoctor, generalFaqs, stats as seedStats, surgeries as baseSurgeries, type Surgery } from '../content/site'
import { extraSurgeries } from '../content/surgeries-extra'
import { stockPhotos, STOCK_VERSION } from '../content/stock'
import { contactSeed, doctorExtra, faqCategorySeed, generalFaqCategory, moreGeneralFaqs, type SocialPlatform } from '../content/about-contact'
export type { SocialPlatform }

/**
 * Website content store (CMS), edited from Dashboard → Website.
 * DEMO: persisted in this browser's localStorage, so edits are visible only in the same browser.
 * Before launch, swap load/commit for a real backend (e.g. Supabase tables + Storage for images)
 * so changes publish for every visitor.
 */

export type MediaItem = { id: string; name: string; src: string; alt: L; enabled: boolean; createdAt: string; stock?: boolean; stockKey?: string }
export type QA = { id: string; q: L; a: L; enabled: boolean; category?: string }
export type FaqCategory = { id: string; name: L; enabled: boolean }
export type Social = { id: string; platform: SocialPlatform; label: string; url: string; enabled: boolean }
export type CmsContact = { email: string; website: string; whatsapp: string; showEmail: boolean; showWebsite: boolean; showWhatsapp: boolean }
export type TitledText = { t: L; d: L }
/** Automatic import from the doctor's channel (YouTube Data API v3). */
export type YouTubeSync = { channel: string; apiKey: string; autoShow: boolean; lastSync: string | null; lastError: string | null }
export type Video = { id: string; title: L; url: string; views: string; featured: boolean; enabled: boolean; viewCount?: number; published?: string }
export type Milestone = { year: string; t: L; d: L }
export type CmsSurgery = Omit<Surgery, 'faqs'> & { id: string; enabled: boolean; image: string | null; video: string; faqs: QA[] }
export type CmsBranch = (typeof seedBranches)[number] & { enabled: boolean; image: string | null }
export type CmsStat = { id: string; value: number; suffix: string; label: L; enabled: boolean }
export type CmsDoctor = { name: L; title: L; promise: L; bio: L; highlights: L[]; portrait: string | null; heroImage: string | null; quote: L; story: L; values: TitledText[]; timeline: Milestone[]; aboutImage: string | null }

export interface ContentDB {
  version: 1
  doctor: CmsDoctor
  surgeries: CmsSurgery[]
  faqs: QA[]
  faqCategories: FaqCategory[]
  contact: CmsContact
  socials: Social[]
  videos: Video[]
  youtube: YouTubeSync
  branches: CmsBranch[]
  stats: CmsStat[]
  media: MediaItem[]
  /** Set once the sample stock photos were offered to this browser, so removing them sticks. */
  stockApplied?: boolean
  stockVersion?: number
}

const KEY = 'ks-content-v1'
export const uid = () => Math.random().toString(36).slice(2, 10)

function seed(): ContentDB {
  const qa = (x: { q: L; a: L }): QA => ({ id: uid(), q: x.q, a: x.a, enabled: true })
  const cats: FaqCategory[] = faqCategorySeed.map(c => ({ id: c.key, name: c.name, enabled: true }))
  const catId = (k: string) => cats.find(c => c.id === k)?.id
  return withStock({
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
      aboutImage: null,
      ...doctorExtra,
    },
    surgeries: [...baseSurgeries, ...extraSurgeries].map(s => ({ ...s, id: uid(), enabled: true, image: null, video: '', faqs: s.faqs.map(qa) })),
    faqCategories: cats,
    faqs: [
      ...generalFaqs.map((f, i) => ({ ...qa(f), category: catId(generalFaqCategory[i]) })),
      ...moreGeneralFaqs.map(f => ({ ...qa(f), category: catId(f.cat) })),
    ],
    contact: { email: contactSeed.email, website: contactSeed.website, whatsapp: contactSeed.whatsapp, showEmail: true, showWebsite: true, showWhatsapp: true },
    socials: contactSeed.socials.map(x => ({ ...x, id: uid(), enabled: true })),
    videos: [],
    youtube: { channel: 'UCmHqUf0vI7lohE_7NbLd3DA', apiKey: '', autoShow: false, lastSync: null, lastError: null },
    branches: seedBranches.map(b => ({ ...b, enabled: true, image: null })),
    stats: seedStats.map(s => ({ ...s, id: uid(), enabled: true })),
    media: [],
  })
}

/** Swap the early placeholder social links for the doctor's real accounts, and add any platform that is missing. */
function withRealSocials(saved: Social[], real: Social[]): Social[] {
  const placeholder = (u: string) => !u || /^https:\/\/(www\.|maps\.)?[a-z]+\.com\/?$/.test(u) || u.includes('@dr.khaledsalah3930')
  const out = saved.map(x => { const r = real.find(y => y.platform === x.platform); return r && placeholder(x.url) ? { ...x, url: r.url } : x })
  for (const r of real) if (!out.some(x => x.platform === r.platform)) out.push(r)
  return out
}

/** Removes sample photos that are no longer in the stock list and clears the slots that used them. */
function pruneStock(d: ContentDB, all = false): ContentDB {
  const current = new Set(stockPhotos.map(p => p.key))
  const gone = new Set(d.media.filter(m => m.stock && (all || !current.has(m.stockKey ?? ''))).map(m => m.id))
  if (!gone.size) return d
  const keep = (id: string | null) => (id && gone.has(id) ? null : id)
  return {
    ...d, media: d.media.filter(m => !gone.has(m.id)),
    doctor: { ...d.doctor, portrait: keep(d.doctor.portrait), heroImage: keep(d.doctor.heroImage), aboutImage: keep(d.doctor.aboutImage) },
    branches: d.branches.map(b => ({ ...b, image: keep(b.image) })),
    surgeries: d.surgeries.map(x => ({ ...x, image: keep(x.image) })),
  }
}

/** Adds the sample illustrations to the library and puts each in its slot if that slot is empty. */
function withStock(input: ContentDB): ContentDB {
  const d = pruneStock(input)
  const now = new Date().toISOString()
  const have = new Set(d.media.filter(m => m.stock).map(m => m.stockKey))
  const add: MediaItem[] = stockPhotos.filter(p => !have.has(p.key)).map(p => ({ id: uid(), name: p.key, src: p.src, alt: p.alt, enabled: true, createdAt: now, stock: true, stockKey: p.key }))
  const media = [...d.media, ...add]
  const idFor = (target: string) => { const p = stockPhotos.find(x => x.target === target); return p ? media.find(m => m.stock && m.stockKey === p.key)?.id ?? null : null }
  return {
    ...d, media, stockApplied: true, stockVersion: STOCK_VERSION,
    doctor: { ...d.doctor, heroImage: d.doctor.heroImage ?? idFor('hero'), aboutImage: d.doctor.aboutImage ?? idFor('about') },
    branches: d.branches.map((b, i) => ({ ...b, image: b.image ?? idFor(`branch:${i}`) })),
    surgeries: d.surgeries.map(x => ({ ...x, image: x.image ?? idFor(`procedure:${x.slug}`) })),
  }
}

function load(): ContentDB {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const d = JSON.parse(raw) as ContentDB
      if (d?.version === 1) {
        // Fill fields added after this browser first saved content
        const s = seed()
        const merged: ContentDB = {
          ...s, ...d,
          doctor: { ...s.doctor, ...d.doctor },
          faqCategories: d.faqCategories ?? s.faqCategories,
          faqs: d.faqCategories ? d.faqs : s.faqs,
          contact: d.contact ?? s.contact,
          videos: d.videos ?? s.videos,
          youtube: { ...s.youtube, ...d.youtube, channel: !d.youtube?.channel || d.youtube.channel === '@dr.khaledsalah3930' ? s.youtube.channel : d.youtube.channel },
          socials: withRealSocials(d.socials ?? s.socials, s.socials),
          branches: (d.branches ?? s.branches).map(b => b.lat != null ? b : { ...b, ...(({ lat, lng }) => ({ lat, lng }))(s.branches.find(x => x.id === b.id) ?? { lat: 0, lng: 0 }) }),
        }
        // Offer the sample photos once to browsers that saved content before they existed
        // Offer (or refresh) the sample illustrations unless this browser removed them on purpose
        const base = { ...merged, media: d.media ?? [] }
        if (d.stockVersion === STOCK_VERSION) return base
        return d.stockApplied && !d.stockVersion && !d.media?.some(m => m.stock) ? { ...base, stockVersion: STOCK_VERSION } : withStock(base)
      }
    }
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
type ListKey = 'surgeries' | 'faqs' | 'branches' | 'stats' | 'media' | 'faqCategories' | 'socials' | 'videos'

export const cms = {
  setDoctor(patch: Partial<CmsDoctor>) { commit({ ...db, doctor: { ...db.doctor, ...patch } }) },
  setContact(patch: Partial<CmsContact>) { commit({ ...db, contact: { ...db.contact, ...patch } }) },

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
    if (key === 'faqCategories') patch.faqs = db.faqs.map(f => (f.category === id ? { ...f, category: undefined } : f))
    if (key === 'media') {
      // Clear references to a deleted image
      patch.surgeries = db.surgeries.map(s => (s.image === id ? { ...s, image: null } : s))
      patch.branches = db.branches.map(b => (b.image === id ? { ...b, image: null } : b))
      patch.doctor = { ...db.doctor, portrait: db.doctor.portrait === id ? null : db.doctor.portrait, heroImage: db.doctor.heroImage === id ? null : db.doctor.heroImage, aboutImage: db.doctor.aboutImage === id ? null : db.doctor.aboutImage }
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
  setYouTube(p: Partial<YouTubeSync>) {
    commit({ ...db, youtube: { ...db.youtube, ...p } })
  },
  /** Adds channel videos that aren't in the list yet and refreshes view counts. Titles and order you edited are kept. */
  importVideos(items: { id: string; title: string; views: string; viewCount?: number; published?: string }[]) {
    const byId = new Map(db.videos.map(v => [youtubeId(v.url), v]))
    const updated = db.videos.map(v => { const f = items.find(i => i.id === youtubeId(v.url)); return f ? { ...v, views: f.views || v.views, viewCount: f.viewCount ?? v.viewCount, published: v.published ?? f.published } : v })
    const added: Video[] = items.filter(i => !byId.has(i.id)).map(i => ({
      id: uid(), url: `https://www.youtube.com/watch?v=${i.id}`, views: i.views, viewCount: i.viewCount, published: i.published, featured: false, enabled: db.youtube.autoShow,
      // Same YouTube title in both languages until someone translates it in the dashboard
      title: { ar: i.title, en: i.title },
    }))
    const videos = [...added, ...updated]
    commit({ ...db, videos, youtube: { ...db.youtube, lastSync: new Date().toISOString(), lastError: null } })
    return added.length
  },
  setFeaturedVideo(id: string) {
    commit({ ...db, videos: db.videos.map(v => ({ ...v, featured: v.id === id })) })
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
  addStock() { commit(withStock(db)) },
  /** Deletes every sample stock photo and clears the slots that used them. */
  removeStock() { commit({ ...pruneStock(db, true), stockApplied: true, stockVersion: STOCK_VERSION }) },
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
    faqCategories: d.faqCategories.filter(c => c.enabled),
    contact: d.contact,
    socials: d.socials.filter(x => x.enabled && x.url),
    videos: d.videos.filter(v => v.enabled && youtubeId(v.url)),
    // The featured video, or the first live one when none is marked
    featuredVideo: d.videos.find(v => v.featured && v.enabled && youtubeId(v.url)) ?? d.videos.find(v => v.enabled && youtubeId(v.url)) ?? null,
    img: (id: string | null | undefined) => imageSrc(d, id),
  }
}

/** Extract the 11-character YouTube id from a link (watch, youtu.be, shorts, embed, live) or a bare id. */
/** Numeric views for sorting: the synced count, else parsed from text like "171K" or "1.2M". */
export function viewsOf(v: Pick<Video, 'views' | 'viewCount'>): number {
  if (v.viewCount != null) return v.viewCount
  const m = (v.views ?? '').replace(/,/g, '').match(/([\d.]+)\s*([KkMm]?)/)
  if (!m) return 0
  return parseFloat(m[1]) * (/k/i.test(m[2]) ? 1e3 : /m/i.test(m[2]) ? 1e6 : 1)
}

export const CHANNEL_URL = 'https://www.youtube.com/channel/UCmHqUf0vI7lohE_7NbLd3DA'

export function youtubeId(input: string | undefined | null): string | null {
  if (!input) return null
  const v = input.trim()
  if (/^[\w-]{11}$/.test(v)) return v
  const m = v.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([\w-]{11})/)
  return m ? m[1] : null
}
