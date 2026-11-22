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
    <section className="bg-ink py-28 sm:py-36">
      <Reveal className="mx-auto max-w-7xl px-6">
        <p data-reveal className="eyebrow mb-5 text-gold-2">{lang === 'ar' ? 'الدكتور بيشرح' : 'The doctor explains'}</p>
        <h2 data-reveal className="mb-14 max-w-3xl font-display text-[clamp(2rem,4.5vw,4rem)] font-light leading-tight">
          {lang === 'ar' ? 'الإجابات اللي الأهالي بيدوّروا عليها، بصوت الدكتور' : 'The answers parents search for, in the doctor\'s own voice'}
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {videos.map((v, i) => (
            <a key={i} data-reveal data-delay={i * 0.1} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(v.q)}`} target="_blank" rel="noreferrer">
              <SpotlightCard spotlightColor="rgba(228,207,159,.22)" className="!rounded-[1.75rem] !p-0 h-full border hairline"
                style={{ ['--spotlight-card-surface' as string]: '#10262a' }}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-[1.75rem] bg-[radial-gradient(80%_80%_at_50%_30%,#2a5254,#0f2427)]">
                  <svg viewBox="0 0 400 300" className="absolute inset-0 size-full opacity-30" aria-hidden>
                    {Array.from({ length: 8 }).map((_, k) => <circle key={k} cx="200" cy="150" r={20 + k * 22} fill="none" stroke="#c9a96a" strokeWidth=".7" />)}
                  </svg>
                  <span className="absolute inset-0 m-auto flex size-16 items-center justify-center rounded-full bg-ivory/10 backdrop-blur transition-all duration-700 group-hover:scale-110">
                    <Play className="size-6 fill-ivory text-ivory" />
                  </span>
                  {v.views !== '—' && <span className="absolute bottom-4 start-4 rounded-full bg-ink/60 px-3 py-1 text-xs text-ivory/80 backdrop-blur">{v.views} {lang === 'ar' ? 'مشاهدة' : 'views'}</span>}
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
