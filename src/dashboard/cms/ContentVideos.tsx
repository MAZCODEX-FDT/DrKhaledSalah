import { useEffect, useState } from 'react'
import { Plus, Star, ExternalLink, RefreshCw, KeyRound } from 'lucide-react'
import { syncChannel, autoSync } from '../../lib/youtubeSync'
import { useI18n } from '../../lib/i18n'
import { cms, uid, useContent, youtubeId, type Video } from '../../lib/content'
import { Btn, Card, Field, Modal, PageTitle } from '../ui'
import { tr } from '../labels'
import { DemoNote, emptyL, LInput, RowActions, StatusPill, Toggle } from './kit'

const blank = (): Video => ({ id: uid(), title: emptyL(), url: '', views: '', featured: false, enabled: true })
const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

/** Video title from YouTube's public oEmbed endpoint (no key needed), with noembed.com as a CORS-friendly fallback. */
async function fetchTitle(id: string): Promise<string | null> {
  const watch = encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)
  for (const u of [`https://www.youtube.com/oembed?format=json&url=${watch}`, `https://noembed.com/embed?url=${watch}`]) {
    try {
      const r = await fetch(u)
      if (!r.ok) continue
      const j = await r.json()
      if (j?.title) return String(j.title)
    } catch { /* try the next source */ }
  }
  return null
}

/** YouTube library: videos show in "الدكتور بيشرح"; the starred one plays in the channel section. */
export default function ContentVideos() {
  const { t } = useI18n()
  const list = useContent(d => d.videos)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<'all' | 'shown' | 'hidden'>('all')
  const [limit, setLimit] = useState(50)
  const needle = q.trim().toLowerCase()
  const rows = list.filter(v => (filter === 'all' || (filter === 'shown') === v.enabled) && (!needle || `${v.title.ar} ${v.title.en} ${v.url}`.toLowerCase().includes(needle)))
  const shownCount = list.filter(v => v.enabled).length
  const [edit, setEdit] = useState<Video | null>(null)
  const set = (p: Partial<Video>) => setEdit(e => (e ? { ...e, ...p } : e))
  const vid = edit ? youtubeId(edit.url) : null
  const [reading, setReading] = useState(false)
  const yt = useContent(d => d.youtube)
  const [syncing, setSyncing] = useState(false)
  const [note, setNote] = useState('')
  useEffect(() => { autoSync() }, [])
  const runSync = async () => {
    setSyncing(true); setNote('')
    try {
      const n = await syncChannel()
      setNote(n ? t(tr(`اتضاف ${n} فيديو جديد${yt.autoShow ? '' : '. الجديد بيتضاف مخفي، راجعه واظهره.'}`, `${n} new video${n > 1 ? 's' : ''} added${yt.autoShow ? '' : '. New videos arrive hidden: review and show them.'}`)) : t(tr('مفيش فيديوهات جديدة. عدد المشاهدات اتحدّث.', 'No new videos. View counts updated.')))
    } catch { /* lastError shows below */ }
    setSyncing(false)
  }

  // Read the title (and channel) from YouTube as soon as a valid link is pasted, unless a title is already typed.
  useEffect(() => {
    if (!vid || !edit || (edit.title.ar && edit.title.en)) return
    let live = true
    setReading(true)
    fetchTitle(vid).then(title => {
      if (!live || !title) return
      const arabic = /[\u0600-\u06FF]/.test(title)
      setEdit(e => e && youtubeId(e.url) === vid ? { ...e, title: { ar: e.title.ar || (arabic ? title : ''), en: e.title.en || (arabic ? '' : title) } } : e)
    }).finally(() => live && setReading(false))
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vid])
  const hasFeatured = list.some(v => v.featured && v.enabled && youtubeId(v.url))

  const save = () => {
    if (!edit || !vid) return
    const first = list.length === 0
    cms.upsert('videos', { ...edit, url: edit.url.trim() })
    if (first || edit.featured) cms.setFeaturedVideo(edit.id)
    setEdit(null)
  }

  return (
    <>
      <PageTitle title={t(tr('فيديوهات يوتيوب', 'YouTube videos'))}
        sub={t(tr('الفيديوهات بتظهر في قسم "الدكتور بيشرح". الفيديو اللي عليه نجمة هو اللي بيشتغل في قسم قناة اليوتيوب.', 'Videos appear in the "Doctor explains" section. The starred video plays in the YouTube channel section.'))}
        action={<Btn onClick={() => setEdit(blank())}><Plus className="size-4" />{t(tr('فيديو جديد', 'New video'))}</Btn>} />
      <DemoNote />
      <Card className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold">{t(tr('سحب الفيديوهات من القناة تلقائيًا', 'Import videos from the channel automatically'))}</h3>
            <p className="mt-1 max-w-2xl text-sm text-[#5e6a7a]">{t(tr('الموقع بيقرا القناة كل 6 ساعات، بيضيف الفيديوهات الجديدة بعناوينها وبيحدّث عدد المشاهدات. العناوين والترتيب اللي عدّلتهم بيفضلوا زي ما هم.', 'The site reads the channel every 6 hours, adds new videos with their titles and refreshes view counts. Titles and order you edited stay as they are.'))}</p>
          </div>
          <Btn onClick={runSync} disabled={!yt.apiKey || syncing}><RefreshCw className={`size-4 ${syncing ? 'animate-spin' : ''}`} />{t(tr('اسحب دلوقتي', 'Sync now'))}</Btn>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label={t(tr('القناة', 'Channel'))}><input dir="ltr" value={yt.channel} onChange={e => cms.setYouTube({ channel: e.target.value })} placeholder="@DrKhaledSalah" /></Field>
          <Field label={t(tr('مفتاح YouTube Data API', 'YouTube Data API key'))}><input dir="ltr" type="password" autoComplete="off" value={yt.apiKey} onChange={e => cms.setYouTube({ apiKey: e.target.value.trim(), lastError: null })} placeholder="AIza…" /></Field>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <Toggle on={yt.autoShow} onClick={() => cms.setYouTube({ autoShow: !yt.autoShow })} />
          <span>{t(tr('اظهر الفيديوهات الجديدة على الموقع على طول (من غير مراجعة)', 'Show new videos on the site right away (no review)'))}</span>
        </div>
        {!yt.apiKey && <p className="mt-4 flex items-start gap-2 rounded-xl bg-[#fff4d6] p-3 text-sm text-[#163e7a]"><KeyRound className="mt-0.5 size-4 shrink-0" />{t(tr('محتاج مفتاح مجاني من Google Cloud: مشروع جديد ← فعّل YouTube Data API v3 ← Credentials ← Create API key، وقصره على عنوان الموقع.', 'Needs a free key from Google Cloud: new project → enable YouTube Data API v3 → Credentials → Create API key, restricted to the website address.'))}</p>}
        {yt.lastError && <p className="mt-4 rounded-xl bg-[#fdecec] p-3 text-sm text-[#c0392b]">{t(tr('السحب فشل: ', 'Sync failed: '))}<span dir="ltr">{yt.lastError}</span></p>}
        {note && <p className="mt-4 text-sm text-[#1f7a4d]">{note}</p>}
        {yt.lastSync && <p className="mt-2 text-xs text-[#5e6a7a]">{t(tr('آخر سحب: ', 'Last sync: '))}{new Date(yt.lastSync).toLocaleString()}</p>}
      </Card>
      <Card>
        {list.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <input value={q} onChange={e => { setQ(e.target.value); setLimit(50) }} placeholder={t(tr('دوّر بالعنوان…', 'Search by title…'))} className="min-w-[14rem] flex-1 rounded-xl border border-[#dbe2e8] px-4 py-2.5 text-sm" />
            <div className="flex gap-1 rounded-xl bg-[#f3f6f9] p-1 text-sm">
              {([['all', tr(`الكل (${list.length})`, `All (${list.length})`)], ['shown', tr(`ظاهر (${shownCount})`, `Shown (${shownCount})`)], ['hidden', tr(`مخفي (${list.length - shownCount})`, `Hidden (${list.length - shownCount})`)]] as const).map(([k, l]) => (
                <button key={k} onClick={() => { setFilter(k); setLimit(50) }} className={`rounded-lg px-3 py-1.5 ${filter === k ? 'bg-white text-[#163e7a] shadow-sm' : 'text-[#5e6a7a]'}`}>{t(l)}</button>
              ))}
            </div>
          </div>
        )}
        {list.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#5e6a7a]">{t(tr('لسه مفيش فيديوهات. دوس "فيديو جديد" والصق رابط الفيديو من يوتيوب.', 'No videos yet. Press "New video" and paste the YouTube link.'))}</p>
        ) : (
          <ul className="divide-y divide-[#eef2f5]">
            {rows.slice(0, limit).map(v => {
              const id = youtubeId(v.url)
              const isDefault = v.featured || (!hasFeatured && v === list.find(x => x.enabled && youtubeId(x.url)))
              return (
                <li key={v.id} className="flex flex-wrap items-center gap-4 py-3">
                  <button title={t(tr('اجعله الفيديو الأساسي', 'Make default video'))} onClick={() => cms.setFeaturedVideo(v.id)}
                    className={`flex size-8 items-center justify-center rounded-lg ${isDefault ? 'bg-[#ffc83d] text-[#163e7a]' : 'text-[#cfd8e1] hover:text-[#ffc83d]'}`}><Star className="size-4 fill-current" /></button>
                  {id
                    ? <img src={thumb(id)} alt="" loading="lazy" onError={e => { e.currentTarget.style.visibility = 'hidden' }} className="aspect-video w-28 bg-[#e3f2fb] rounded-lg object-cover" />
                    : <div className="flex aspect-video w-28 items-center justify-center rounded-lg bg-[#fdecec] text-xs text-[#c0392b]">{t(tr('رابط غلط', 'Bad link'))}</div>}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{t(v.title) || t(tr('بدون عنوان', 'Untitled'))}</span>
                      <StatusPill on={v.enabled} />
                      {isDefault && <span className="rounded-full bg-[#fff4d6] px-2 py-0.5 text-xs text-[#163e7a]">{t(tr('الأساسي', 'Default'))}</span>}
                    </div>
                    <a href={v.url} target="_blank" rel="noreferrer" dir="ltr" className="inline-flex max-w-full items-center gap-1 truncate text-xs text-[#2f6fd1] hover:underline">{v.url}<ExternalLink className="size-3 shrink-0" /></a>
                  </div>
                  <RowActions enabled={v.enabled} onToggle={() => cms.toggle('videos', v.id)} onUp={() => cms.move('videos', v.id, -1)} onDown={() => cms.move('videos', v.id, 1)}
                    onEdit={() => setEdit(v)} onDelete={() => cms.remove('videos', v.id)} />
                </li>
              )
            })}
          </ul>
        )}
        {rows.length > limit && <div className="mt-4 flex justify-center"><Btn variant="ghost" onClick={() => setLimit(n => n + 50)}>{t(tr(`اعرض ${Math.min(50, rows.length - limit)} كمان`, `Show ${Math.min(50, rows.length - limit)} more`))}</Btn></div>}
      </Card>
      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit ? t(edit.title) || t(tr('فيديو جديد', 'New video')) : ''} wide>
        {edit && (
          <div className="space-y-4">
            <Field label={t(tr('رابط الفيديو على يوتيوب', 'YouTube link'))}>
              <input dir="ltr" value={edit.url} placeholder="https://www.youtube.com/watch?v=…" onChange={e => set({ url: e.target.value })} />
            </Field>
            {edit.url && !vid && <p className="text-sm text-[#c0392b]">{t(tr('الرابط ده مش رابط فيديو يوتيوب. انسخ الرابط من زرار "مشاركة" على الفيديو.', 'This is not a YouTube video link. Copy the link from the video\'s "Share" button.'))}</p>}
            {vid && <img src={thumb(vid)} alt="" onError={e => { e.currentTarget.style.visibility = 'hidden' }} className="aspect-video w-full max-w-sm rounded-xl object-cover" />}
            {reading && <p className="text-xs text-[#5e6a7a]">{t(tr('بنقرا عنوان الفيديو من يوتيوب…', 'Reading the video title from YouTube…'))}</p>}
            <LInput label={t(tr('عنوان الفيديو', 'Video title'))} value={edit.title} onChange={title => set({ title })} />
            <Field label={t(tr('عدد المشاهدات (اختياري)', 'Views (optional)'))}>
              <input value={edit.views} placeholder="171K" onChange={e => set({ views: e.target.value })} />
            </Field>
            <label className="flex w-fit cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" className="!size-4 !w-4 shrink-0 !p-0 accent-[#163e7a]" checked={edit.featured} onChange={e => set({ featured: e.target.checked })} />
              {t(tr('اعرضه في قسم قناة اليوتيوب (الفيديو الأساسي)', 'Show in the YouTube channel section (default video)'))}
            </label>
            <div className="flex justify-end gap-2">
              <Btn variant="ghost" onClick={() => setEdit(null)}>{t(tr('إلغاء', 'Cancel'))}</Btn>
              <Btn onClick={save} disabled={!vid}>{t(tr('حفظ', 'Save'))}</Btn>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
