import { cms, getContent } from './content'

const API = 'https://www.googleapis.com/youtube/v3'

const compact = (n: number) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(/\.0$/, '')}M` : n >= 1e3 ? `${(n / 1e3).toFixed(n >= 1e4 ? 0 : 1).replace(/\.0$/, '')}K` : String(n)

/** Turns "@handle", a channel link or a UC… id into the query the API needs. */
function channelQuery(input: string) {
  const v = input.trim()
  const id = v.match(/(UC[\w-]{22})/)?.[1]
  if (id) return `id=${id}`
  const handle = v.match(/@([\w.-]+)/)?.[1] ?? v.replace(/^https?:\/\/(www\.)?youtube\.com\//, '').replace(/\/.*$/, '')
  return `forHandle=${encodeURIComponent('@' + handle.replace(/^@/, ''))}`
}

async function get<T>(path: string, key: string): Promise<T> {
  const r = await fetch(`${API}/${path}&key=${encodeURIComponent(key)}`)
  const j = await r.json()
  if (!r.ok) throw new Error(j?.error?.message ?? `YouTube API error ${r.status}`)
  return j as T
}

/**
 * Reads every upload on the doctor's channel and adds the new ones to the video list.
 * New videos arrive hidden unless "show new videos automatically" is on. Returns how many were added.
 */
export async function syncChannel(max = Infinity): Promise<number> {
  const { channel, apiKey } = getContent().youtube
  if (!apiKey) throw new Error('No API key')
  try {
    const ch = await get<{ items?: { contentDetails: { relatedPlaylists: { uploads: string } } }[] }>(`channels?part=contentDetails&${channelQuery(channel)}`, apiKey)
    const uploads = ch.items?.[0]?.contentDetails.relatedPlaylists.uploads
    if (!uploads) throw new Error('Channel not found')
    const found: { id: string; title: string; published?: string }[] = []
    const seen = new Set<string>()
    let page = ''
    do {
      const pl = await get<{ nextPageToken?: string; items: { snippet: { title: string; resourceId: { videoId: string } }; contentDetails?: { videoPublishedAt?: string } }[] }>(
        `playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${uploads}${page ? `&pageToken=${page}` : ''}`, apiKey)
      for (const it of pl.items) {
        const id = it.snippet.resourceId.videoId
        if (seen.has(id) || it.snippet.title === 'Private video' || it.snippet.title === 'Deleted video') continue
        seen.add(id)
        found.push({ id, title: it.snippet.title, published: it.contentDetails?.videoPublishedAt })
      }
      page = pl.nextPageToken ?? ''
    } while (page && found.length < max)
    const views = new Map<string, number>()
    for (let i = 0; i < found.length; i += 50) {
      const st = await get<{ items: { id: string; statistics: { viewCount?: string } }[] }>(`videos?part=statistics&id=${found.slice(i, i + 50).map(f => f.id).join(',')}`, apiKey)
      for (const it of st.items) if (it.statistics.viewCount) views.set(it.id, +it.statistics.viewCount)
    }
    return cms.importVideos(found.map(f => { const n = views.get(f.id); return { ...f, viewCount: n, views: n != null ? compact(n) : '' } }))
  } catch (e) {
    cms.setYouTube({ lastError: e instanceof Error ? e.message : String(e) })
    throw e
  }
}

/** Quietly re-syncs when the last sync is older than `hours`. Used when the site and dashboard open. */
export function autoSync(hours = 6) {
  const { apiKey, lastSync } = getContent().youtube
  if (!apiKey) return
  if (lastSync && Date.now() - Date.parse(lastSync) < hours * 3600e3) return
  syncChannel().catch(() => { /* error is shown in the dashboard */ })
}
