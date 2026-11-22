import { useEffect, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import PageHero from './PageHero'
import VideoCard from '../components/site/VideoCard'
import SocialIcon from '../components/site/SocialIcon'
import { useI18n } from '../lib/i18n'
import { useSite, viewsOf, CHANNEL_URL } from '../lib/content'
import { autoSync } from '../lib/youtubeSync'

const PAGE = 24
type Sort = 'views' | 'new'

/** Every visible video from Dashboard → Website content → YouTube videos, searchable. */
export default function VideosPage() {
  const { lang } = useI18n()
  const ar = lang === 'ar'
  const { videos, socials } = useSite()
  const channel = socials.find(s => s.platform === 'youtube')?.url ?? CHANNEL_URL
  useEffect(() => { autoSync() }, [])
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<Sort>('views')
  const [shown, setShown] = useState(PAGE)

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const hits = needle ? videos.filter(v => `${v.title.ar} ${v.title.en}`.toLowerCase().includes(needle)) : videos
    return sort === 'views'
      ? [...hits].sort((a, b) => viewsOf(b) - viewsOf(a))
      : [...hits].sort((a, b) => (b.published ?? '').localeCompare(a.published ?? ''))
  }, [videos, q, sort])
  useEffect(() => setShown(PAGE), [q, sort])

  const sorts: [Sort, string][] = [['views', ar ? 'الأكثر مشاهدة' : 'Most watched'], ['new', ar ? 'الأحدث' : 'Newest']]

  return (
    <>
      <PageHero eyebrow={ar ? 'الدكتور بيشرح' : 'The doctor explains'} title={ar ? 'كل الفيديوهات' : 'All videos'}>
        {ar ? `${videos.length} فيديو من قناة الدكتور على يوتيوب. دوّر على الموضوع اللي يهمك واتفرج هنا على طول.` : `${videos.length} videos from the doctor's YouTube channel. Search for your topic and watch right here.`}
      </PageHero>
      <section className="bg-cloud pb-28 pt-12 text-ink">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex flex-wrap items-center gap-4">
            <div className="relative min-w-[16rem] flex-1">
              <Search className="pointer-events-none absolute start-5 top-1/2 size-5 -translate-y-1/2 text-ink/40" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder={ar ? 'دوّر على فيديو… مثلًا: طهارة، فتق، خصية' : 'Search a video… e.g. circumcision, hernia'}
                className="w-full rounded-full border border-ink/10 bg-white py-4 pe-12 ps-14 outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/15" />
              {q && <button onClick={() => setQ('')} className="absolute end-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink/50 hover:bg-mist" aria-label="Clear"><X className="size-4" /></button>}
            </div>
            <div className="flex gap-2 rounded-full bg-white p-1 ring-1 ring-ink/10">
              {sorts.map(([k, label]) => (
                <button key={k} onClick={() => setSort(k)} className={`rounded-full px-5 py-2.5 text-sm transition ${sort === k ? 'bg-navy text-cloud' : 'text-ink/70 hover:bg-mist'}`}>{label}</button>
              ))}
            </div>
            <a href={channel} target="_blank" rel="noreferrer" className="btn-gold"><SocialIcon platform="youtube" />{ar ? 'اشترك في القناة' : 'Subscribe'}</a>
          </div>

          {q && <p className="mb-6 text-sm text-ink/60">{ar ? `${list.length} نتيجة` : `${list.length} results`}</p>}
          {list.length === 0
            ? <p className="py-16 text-center text-ink/60">{ar ? 'مفيش فيديو بالكلام ده. جرّب كلمة تانية.' : 'No video matches. Try another word.'}</p>
            : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.slice(0, shown).map(v => <VideoCard key={v.id} v={v} />)}</div>}
          {shown < list.length && (
            <div className="mt-12 flex justify-center">
              <button onClick={() => setShown(n => n + PAGE)} className="btn-blue">{ar ? `اعرض ${Math.min(PAGE, list.length - shown)} كمان` : `Show ${Math.min(PAGE, list.length - shown)} more`} <span className="opacity-70">({shown}/{list.length})</span></button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
