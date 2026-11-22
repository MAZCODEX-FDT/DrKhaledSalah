import { Link, Navigate, useParams } from 'react-router-dom'
import { Check, MessageCircle, Play } from 'lucide-react'
import PageHero from './PageHero'
import Faq from '../components/site/Faq'
import Reveal from '../components/site/Reveal'
import ProcedureArt from '../components/site/ProcedureArt'
import Branches from '../components/site/Branches'
import { useI18n } from '../lib/i18n'
import { branches, surgeries, ui, waLink } from '../content/site'

export default function ProcedureDetail() {
  const { slug } = useParams()
  const { t, lang } = useI18n()
  const s = surgeries.find(x => x.slug === slug)
  if (!s) return <Navigate to="/procedures" replace />
  const others = surgeries.filter(x => x.slug !== s.slug)

  return (
    <>
      <PageHero eyebrow={`${s.index} · ${t(s.name)}`} title={t(s.hero)}>{t(s.short)}</PageHero>

      <section className="bg-ivory py-24 text-ink sm:py-32">
        <Reveal className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p data-reveal className="font-display text-[clamp(1.4rem,2.4vw,2.1rem)] font-light leading-[1.6]">{t(s.what)}</p>
            <div data-reveal className="mt-14 grid gap-4 sm:grid-cols-2">
              {s.signs.map((x, i) => (
                <div key={i} className="rounded-2xl border hairline-dark bg-white/60 p-6">
                  <span className="font-serif text-sm italic text-gold">{String(i + 1).padStart(2, '0')}</span>
                  <p className="mt-2 text-lg">{t(x)}</p>
                </div>
              ))}
            </div>
            <p data-reveal className="mt-4 text-sm text-ink/50">{lang === 'ar' ? 'كل النقط دي بتتشرح بالتفصيل في الكشف.' : 'All of these are explained in detail at the consultation.'}</p>
          </div>
          <aside data-reveal className="relative h-fit overflow-hidden rounded-[2rem] bg-pine p-8 text-ivory sm:p-10 lg:sticky lg:top-28">
            <ProcedureArt slug={s.slug} tone={s.tone} className="absolute -end-24 -top-24 size-80 opacity-60" />
            <h3 className="relative font-display text-2xl font-light">{lang === 'ar' ? 'اللي هتلاقيه معانا' : 'What you can expect'}</h3>
            <ul className="relative mt-6 space-y-4">
              {s.approach.map((a, i) => (
                <li key={i} className="flex gap-3 text-ivory/80"><Check className="mt-1 size-4 shrink-0 text-gold" />{t(a)}</li>
              ))}
            </ul>
            <div className="relative mt-10 space-y-3">
              {branches.map(b => (
                <a key={b.id} href={waLink(b.whatsapp, `${t(ui.waMsg)} · ${t(s.name)}`)} target="_blank" rel="noreferrer"
                  className={`${b.primary ? 'btn-gold' : 'btn-ghost'} w-full justify-center`}>
                  <MessageCircle className="size-4" /> {b.primary ? t(ui.bookTagamoa) : t(ui.bookGiza)}
                </a>
              ))}
            </div>
          </aside>
        </Reveal>
      </section>

      <section className="bg-ink py-24 sm:py-32">
        <Reveal className="mx-auto max-w-7xl px-6">
          <p data-reveal className="eyebrow mb-5 text-gold-2">{lang === 'ar' ? 'الخطوات' : 'The steps'}</p>
          <div className="grid gap-px overflow-hidden rounded-[2rem] border hairline bg-ivory/10 md:grid-cols-4">
            {s.steps.map((st, i) => (
              <div key={i} data-reveal data-delay={i * .08} className="bg-ink p-8">
                <span className="font-latin text-5xl font-extralight text-ivory/15">0{i + 1}</span>
                <h3 className="mt-6 font-display text-2xl font-light text-gold-2">{t(st.t)}</h3>
                <p className="mt-3 text-ivory/65">{t(st.d)}</p>
              </div>
            ))}
          </div>

          {/* TODO: embed the matching YouTube video ID for this procedure */}
          <div data-reveal className="relative mt-16 flex aspect-video items-center justify-center overflow-hidden rounded-[2rem] bg-[radial-gradient(70%_70%_at_50%_40%,#2a5254,#0f2427)]">
            <svg viewBox="0 0 800 450" className="absolute inset-0 size-full opacity-25" aria-hidden>
              {Array.from({ length: 12 }).map((_, k) => <circle key={k} cx="400" cy="225" r={30 + k * 28} fill="none" stroke="#c9a96a" strokeWidth=".7" />)}
            </svg>
            <div className="relative text-center">
              <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-ivory/10 backdrop-blur"><Play className="size-7 fill-ivory" /></span>
              <p className="mt-5 font-display text-xl font-light">{lang === 'ar' ? `الدكتور بيشرح: ${t(s.name)}` : `The doctor explains: ${t(s.name)}`}</p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-ink pb-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1fr_1.6fr]">
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-light leading-tight">{lang === 'ar' ? 'أسئلة الأهالي' : 'Parents ask'}</h2>
          <Faq items={s.faqs} />
        </div>
        <div className="mx-auto mt-24 max-w-7xl px-6">
          <p className="eyebrow mb-6 text-gold-2">{lang === 'ar' ? 'عمليات تانية' : 'Other procedures'}</p>
          <div className="grid gap-4 md:grid-cols-3">
            {others.map(o => (
              <Link key={o.slug} to={`/procedures/${o.slug}`} className="group relative overflow-hidden rounded-[1.5rem] border hairline bg-ink-2 p-7 transition-colors duration-700 hover:bg-pine">
                <ProcedureArt slug={o.slug} tone={o.tone} className="absolute -bottom-20 -end-20 size-56 opacity-40 transition-opacity group-hover:opacity-80" />
                <span className="font-serif text-sm italic text-gold-2">{o.index}</span>
                <h3 className="relative mt-8 font-display text-2xl font-light">{t(o.name)}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Branches />
    </>
  )
}
