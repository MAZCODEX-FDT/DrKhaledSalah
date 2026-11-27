import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, MessageCircle, Quote } from 'lucide-react'
import PageHero from './PageHero'
import PromiseStats from '../components/site/PromiseStats'
import Reveal from '../components/site/Reveal'
import DoctorPortrait from '../components/site/DoctorPortrait'
import SocialIcon from '../components/site/SocialIcon'
import PlayTiles, { RingBadge } from '../components/site/PlayTiles'
import { useI18n } from '../lib/i18n'
import { ui, waLink } from '../content/site'
import { useSite } from '../lib/content'

/** About the doctor. Every block is edited in Dashboard → Website content → The doctor. */
export default function About() {
  const { t, lang } = useI18n()
  const { doctor, surgeries, socials, branches, img } = useSite()
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight
  const wide = img(doctor.aboutImage)
  const paragraphs = t(doctor.story ?? { ar: '', en: '' }).split(/\n\s*\n/).filter(Boolean)
  const values = doctor.values ?? []
  const timeline = doctor.timeline ?? []
  const youtube = socials.find(s => s.platform === 'youtube')

  return (
    <>
      <PageHero eyebrow={t(doctor.title)} title={t(doctor.name)}>{t(doctor.bio)}</PageHero>

      {/* Story */}
      <section className="bg-cloud py-24 text-ink sm:py-32">
        <Reveal className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[0.9fr_1.2fr] lg:gap-20">
          <div data-reveal className="mx-auto w-full max-w-md"><DoctorPortrait /></div>
          <div>
            <span data-reveal className="pill bg-mist text-blue">{lang === 'ar' ? 'الحكاية' : 'The story'}</span>
            {doctor.quote && (t(doctor.quote)) && (
              <blockquote data-reveal className="relative mt-6 font-display text-[clamp(1.7rem,3.2vw,2.6rem)] leading-snug text-navy">
                <Quote className="mb-3 size-8 text-gold" />
                {t(doctor.quote)}
              </blockquote>
            )}
            <div className="mt-8 space-y-5">
              {paragraphs.map((p, i) => <p key={i} data-reveal className="text-lg leading-relaxed text-ink/70">{p}</p>)}
            </div>
          </div>
        </Reveal>
      </section>

      {wide && (
        <section className="bg-cloud pb-24">
          <div className="mx-auto max-w-7xl px-6"><Reveal className="grid items-center gap-10 overflow-hidden rounded-[2rem] bg-white px-6 pt-10 shadow-[0_30px_60px_-40px_rgba(22,62,122,.35)] sm:px-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:pt-0">
            <img data-reveal src={wide} alt={t(doctor.name)} loading="lazy" className="mx-auto max-h-[34rem] w-auto max-w-full self-end object-contain lg:mt-10" />
            {(doctor.highlights ?? []).length > 0 && (
              <ul className="space-y-4 pb-10 text-ink lg:py-12">
                {(doctor.highlights ?? []).map((h, i) => (
                  <li key={i} data-reveal className="flex items-start gap-3 text-lg leading-relaxed">
                    <span className="mt-2.5 size-2.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                    {t(h)}
                  </li>
                ))}
              </ul>
            )}
          </Reveal></div>
        </section>
      )}

      {/* Values */}
      {values.length > 0 && (
        <section className="relative overflow-hidden bg-navy py-24 sm:py-32">
          <PlayTiles cols={2} rows={2} offset={6} className="absolute end-0 top-0 hidden w-48 overflow-hidden rounded-es-[2rem] lg:grid" />
          <Reveal className="relative mx-auto max-w-7xl px-6">
            <p data-reveal className="mb-5"><span className="pill bg-gold text-navy">{lang === 'ar' ? 'طريقة الشغل' : 'How we work'}</span></p>
            <h2 data-reveal className="max-w-3xl font-display text-[clamp(2rem,4vw,3.5rem)] leading-tight">
              {lang === 'ar' ? 'الأهل اللي بيفهموا، بيقرروا وهم مطمّنين' : 'Parents who understand decide with peace of mind'}
            </h2>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((v, i) => (
                <div key={i} data-reveal data-delay={i * .06} className="rounded-[1.75rem] bg-white/5 p-7 ring-1 ring-white/10">
                  <RingBadge className="size-12" tone={i % 2 ? 'blue' : 'sun'} bg="bg-white/10 !text-cloud"><span className="font-latin text-sm font-semibold">0{i + 1}</span></RingBadge>
                  <h3 className="mt-6 font-display text-2xl">{t(v.t)}</h3>
                  <p className="mt-3 leading-relaxed text-cloud/70">{t(v.d)}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* Career */}
      {timeline.length > 0 && (
        <section className="bg-cloud py-24 text-ink sm:py-32">
          <Reveal className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1fr_1.6fr]">
            <div>
              <span data-reveal className="pill bg-mist text-blue">{lang === 'ar' ? 'المسيرة' : 'Career'}</span>
              <h2 data-reveal className="mt-5 font-display text-[clamp(2rem,4vw,3.2rem)] leading-tight text-navy">{lang === 'ar' ? 'خبرة اتبنت خطوة بخطوة' : 'Experience built step by step'}</h2>
            </div>
            <ol className="relative space-y-10 border-s-2 border-mist ps-8">
              {timeline.map((m, i) => (
                <li key={i} data-reveal data-delay={i * .06} className="relative">
                  <span className={`absolute -start-[2.6rem] top-1 size-4 rounded-full ring-4 ring-cloud ${i % 2 ? 'bg-blue' : 'bg-gold'}`} />
                  {m.year && m.year !== '—' && <span className="font-latin text-sm font-semibold text-blue">{m.year}</span>}
                  <h3 className="font-display text-2xl text-navy">{t(m.t)}</h3>
                  <p className="mt-1 text-ink/60">{t(m.d)}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>
      )}

      {/* Expertise */}
      <section className="bg-mist py-24 text-ink sm:py-28">
        <Reveal className="mx-auto max-w-7xl px-6">
          <span data-reveal className="pill bg-white text-blue">{lang === 'ar' ? 'مجالات الخبرة' : 'Areas of care'}</span>
          <h2 data-reveal className="mt-5 max-w-3xl font-display text-[clamp(2rem,4vw,3.2rem)] leading-tight text-navy">
            {lang === 'ar' ? `${surgeries.length} عملية وإجراء، لكل واحد صفحة بتشرحه` : `${surgeries.length} procedures, each with its own explainer page`}
          </h2>
          <div data-reveal className="mt-10 flex flex-wrap gap-3">
            {surgeries.map(s => (
              <Link key={s.slug} to={`/procedures/${s.slug}`} className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-navy ring-1 ring-navy/10 transition hover:bg-navy hover:text-cloud">{t(s.name)}</Link>
            ))}
          </div>
        </Reveal>
      </section>

      <PromiseStats />

      {/* CTA */}
      <section className="bg-cloud pb-28 text-ink">
        <div className="mx-auto max-w-7xl px-6">
          <div className="calm-night brand-pattern relative flex flex-col gap-8 overflow-hidden rounded-[2rem] p-10 text-cloud sm:p-14 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-xl">
              <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.8rem)] leading-tight">{lang === 'ar' ? 'عندك سؤال للدكتور؟' : 'A question for the doctor?'}</h2>
              <p className="mt-3 text-cloud/75">{lang === 'ar' ? 'ابعت سؤالك على واتساب، أو اتفرج على شرح العمليات على يوتيوب.' : 'Send your question on WhatsApp, or watch the procedure explainers on YouTube.'}</p>
            </div>
            <div className="relative flex flex-wrap gap-3">
              <a href={waLink(branches[0].whatsapp, t(ui.waMsg))} target="_blank" rel="noreferrer" className="btn-gold"><MessageCircle className="size-4" />{lang === 'ar' ? 'كلّم الدكتور' : 'Message the doctor'}</a>
              {youtube && <a href={youtube.url} target="_blank" rel="noreferrer" className="btn-ghost"><SocialIcon platform="youtube" />YouTube</a>}
              <Link to="/contact" className="btn-ghost">{t(ui.nav.contact)} <Arrow className="size-4" /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
