import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import SpotlightCard from '../reactbits/SpotlightCard'
import Reveal from './Reveal'
import { useI18n } from '../../lib/i18n'
import type { L } from '../../lib/i18n'
import { useEffect, useMemo, useRef } from 'react'
import { autoSync } from '../../lib/youtubeSync'
import { useSite, viewsOf } from '../../lib/content'
import VideoCard from './VideoCard'

// Fallback shown only until videos are added in Dashboard → Website content → Videos.
const placeholders: { title: L; views: string; q: string }[] = [
  { title: { ar: 'هل عملية الفتق الإربي للأطفال خطيرة؟', en: 'Is pediatric inguinal hernia surgery dangerous?' }, views: '54K', q: 'الفتق الاربي عند الاطفال د خالد صلاح' },
  { title: { ar: 'الخصية المعلقة: كل اللي محتاج تعرفه', en: 'Undescended testis: what you need to know' }, views: '171K', q: 'الخصية المعلقة د خالد صلاح' },
  { title: { ar: 'ليزر ولا جومكو؟ الفرق في دقيقة', en: 'Laser or Gomco? The difference in a minute' }, views: '—', q: 'طهارة الاطفال د خالد صلاح' },
]

export default function Videos() {
  const { t, lang } = useI18n()
  const { videos } = useSite()
  useEffect(() => { autoSync() }, [])
  // Home shows the 20 most watched; the full library lives on /videos
  const top = useMemo(() => [...videos].sort((a, b) => viewsOf(b) - viewsOf(a)).slice(0, 20), [videos])
  const strip = useRef<HTMLDivElement>(null)
  const ar = lang === 'ar'
  const Arrow = ar ? ArrowLeft : ArrowRight
  // dir: 1 = toward the end of the list (left in Arabic, right in English)
  const slide = (dir: 1 | -1) => { const el = strip.current; if (el) el.scrollBy({ left: dir * (ar ? -1 : 1) * el.clientWidth * 0.8, behavior: 'smooth' }) }
  return (
    <section className="bg-cloud py-28 text-ink sm:py-36">
      <Reveal className="mx-auto max-w-7xl px-6">
        <p data-reveal className="eyebrow mb-5 text-blue">{lang === 'ar' ? 'الدكتور بيشرح · الأكثر مشاهدة' : 'The doctor explains · most watched'}</p>
        <h2 data-reveal className="mb-14 max-w-3xl font-display text-[clamp(2rem,4.5vw,4rem)] font-light leading-tight">
          {lang === 'ar' ? 'الإجابات اللي الأهالي بيدوّروا عليها، بصوت الدكتور' : 'The answers parents search for, in the doctor\'s own voice'}
        </h2>
        {videos.length > 0 ? (
          <>
            <div ref={strip} data-lenis-prevent className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-6 px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {top.map(v => <VideoCard key={v.id} v={v} className="w-[82%] shrink-0 snap-start sm:w-[calc(50%-.625rem)] lg:w-[calc(33.333%-.84rem)]" />)}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <Link to="/videos" className="btn-blue">{ar ? `كل الفيديوهات (${videos.length})` : `All videos (${videos.length})`} <Arrow className="size-4" /></Link>
              {top.length > 1 && (
                <div className="flex gap-2">
                  <button onClick={() => slide(-1)} aria-label={ar ? 'السابق' : 'Previous'} className="flex size-12 items-center justify-center rounded-full bg-white text-navy ring-1 ring-navy/10 transition hover:bg-navy hover:text-cloud">{ar ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}</button>
                  <button onClick={() => slide(1)} aria-label={ar ? 'التالي' : 'Next'} className="flex size-12 items-center justify-center rounded-full bg-white text-navy ring-1 ring-navy/10 transition hover:bg-navy hover:text-cloud">{ar ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}</button>
                </div>
              )}
            </div>
          </>
        ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {placeholders.map((v, i) => (
            <a key={i} data-reveal data-delay={i * 0.1} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(v.q)}`} target="_blank" rel="noreferrer">
              <SpotlightCard theme="light" spotlightColor="rgba(46,106,150,.18)" className="!rounded-[1.75rem] !p-0 h-full">
                <div className="calm-night brand-pattern relative aspect-[4/3] overflow-hidden rounded-t-[1.75rem]">
                  <span className="absolute inset-0 m-auto flex size-16 items-center justify-center rounded-full bg-cloud/10 backdrop-blur transition-all duration-700 group-hover:scale-110">
                    <Play className="size-6 fill-cloud text-cloud" />
                  </span>
                  {v.views !== '—' && <span className="absolute bottom-4 start-4 rounded-full bg-night/60 px-3 py-1 text-xs text-cloud/80 backdrop-blur">{v.views} {lang === 'ar' ? 'مشاهدة' : 'views'}</span>}
                </div>
                <div className="p-7">
                  <h3 className="font-display text-xl leading-snug">{t(v.title)}</h3>
                </div>
              </SpotlightCard>
            </a>
          ))}
        </div>
        )}
      </Reveal>
    </section>
  )
}
