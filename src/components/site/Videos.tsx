import { Play } from 'lucide-react'
import SpotlightCard from '../reactbits/SpotlightCard'
import Reveal from './Reveal'
import { useI18n } from '../../lib/i18n'
import type { L } from '../../lib/i18n'
import { useState } from 'react'
import { useSite } from '../../lib/content'
import YouTubePlayer from './YouTubePlayer'

// Fallback shown only until videos are added in Dashboard → Website content → Videos.
const placeholders: { title: L; views: string; q: string }[] = [
  { title: { ar: 'هل عملية الفتق الإربي للأطفال خطيرة؟', en: 'Is pediatric inguinal hernia surgery dangerous?' }, views: '54K', q: 'الفتق الاربي عند الاطفال د خالد صلاح' },
  { title: { ar: 'الخصية المعلقة: كل اللي محتاج تعرفه', en: 'Undescended testis: what you need to know' }, views: '171K', q: 'الخصية المعلقة د خالد صلاح' },
  { title: { ar: 'ليزر ولا جومكو؟ الفرق في دقيقة', en: 'Laser or Gomco? The difference in a minute' }, views: '—', q: 'طهارة الاطفال د خالد صلاح' },
]

export default function Videos() {
  const { t, lang } = useI18n()
  const { videos } = useSite()
  const [all, setAll] = useState(false)
  const list = all ? videos : videos.slice(0, 6)
  return (
    <section className="bg-cloud py-28 text-ink sm:py-36">
      <Reveal className="mx-auto max-w-7xl px-6">
        <p data-reveal className="eyebrow mb-5 text-blue">{lang === 'ar' ? 'الدكتور بيشرح' : 'The doctor explains'}</p>
        <h2 data-reveal className="mb-14 max-w-3xl font-display text-[clamp(2rem,4.5vw,4rem)] font-light leading-tight">
          {lang === 'ar' ? 'الإجابات اللي الأهالي بيدوّروا عليها، بصوت الدكتور' : 'The answers parents search for, in the doctor\'s own voice'}
        </h2>
        {videos.length > 0 ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((v, i) => (
                <article key={v.id} data-reveal data-delay={(i % 3) * 0.08} className="overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-navy/5 shadow-[0_20px_40px_-30px_rgba(22,62,122,.35)]">
                  <YouTubePlayer url={v.url} title={t(v.title)} />
                  <div className="flex items-start justify-between gap-4 p-6">
                    <h3 className="font-display text-xl leading-snug">{t(v.title)}</h3>
                    {v.views && <span className="shrink-0 rounded-full bg-mist px-3 py-1 text-xs font-medium text-blue">{v.views} {lang === 'ar' ? 'مشاهدة' : 'views'}</span>}
                  </div>
                </article>
              ))}
            </div>
            {videos.length > 6 && (
              <div className="mt-10 flex justify-center">
                <button onClick={() => setAll(!all)} className="btn-blue">{all ? (lang === 'ar' ? 'عرض أقل' : 'Show fewer') : (lang === 'ar' ? `كل الفيديوهات (${videos.length})` : `All videos (${videos.length})`)}</button>
              </div>
            )}
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
