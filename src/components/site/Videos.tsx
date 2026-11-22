import { Play } from 'lucide-react'
import SpotlightCard from '../reactbits/SpotlightCard'
import Reveal from './Reveal'
import { useI18n } from '../../lib/i18n'
import type { L } from '../../lib/i18n'

// TODO: replace `q` searches with the doctor's real YouTube video IDs once shared.
const videos: { title: L; views: string; q: string }[] = [
  { title: { ar: 'هل عملية الفتق الإربي للأطفال خطيرة؟', en: 'Is pediatric inguinal hernia surgery dangerous?' }, views: '54K', q: 'الفتق الاربي عند الاطفال د خالد صلاح' },
  { title: { ar: 'الخصية المعلقة: كل اللي محتاج تعرفه', en: 'Undescended testis: what you need to know' }, views: '171K', q: 'الخصية المعلقة د خالد صلاح' },
  { title: { ar: 'ليزر ولا جومكو؟ الفرق في دقيقة', en: 'Laser or Gomco? The difference in a minute' }, views: '—', q: 'طهارة الاطفال د خالد صلاح' },
]

export default function Videos() {
  const { t, lang } = useI18n()
  return (
    <section className="bg-cloud py-28 text-ink sm:py-36">
      <Reveal className="mx-auto max-w-7xl px-6">
        <p data-reveal className="eyebrow mb-5 text-blue">{lang === 'ar' ? 'الدكتور بيشرح' : 'The doctor explains'}</p>
        <h2 data-reveal className="mb-14 max-w-3xl font-display text-[clamp(2rem,4.5vw,4rem)] font-light leading-tight">
          {lang === 'ar' ? 'الإجابات اللي الأهالي بيدوّروا عليها، بصوت الدكتور' : 'The answers parents search for, in the doctor\'s own voice'}
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {videos.map((v, i) => (
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
      </Reveal>
    </section>
  )
}
