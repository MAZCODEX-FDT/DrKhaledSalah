import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react'
import ProcedureArt from './ProcedureArt'
import Reveal from './Reveal'
import { useI18n } from '../../lib/i18n'
import { useSite } from '../../lib/content'

/** Interactive accordion: the hovered/active panel opens wide, others collapse to slim columns. */
export default function Procedures({ heading = true, grid = false }: { heading?: boolean; grid?: boolean }) {
  const { t, lang } = useI18n()
  const { surgeries: all, img } = useSite()
  const surgeries = all.slice(0, 5)
  const [active, setActive] = useState(1)
  const Arrow = lang === 'ar' ? ArrowUpLeft : ArrowUpRight

  return (
    <section className="relative bg-cloud py-28 text-ink sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        {heading && (
          <Reveal className="mb-16 grid gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <p data-reveal className="eyebrow mb-6 text-blue">{lang === 'ar' ? 'العمليات' : 'Procedures'}</p>
              <h2 data-reveal className="font-display text-[clamp(2.2rem,5vw,4.5rem)] font-light leading-[1.1]">
                {lang === 'ar' ? 'من الطهارة لحد أدق العمليات' : 'From circumcision to the most delicate repairs'}
              </h2>
            </div>
            <p data-reveal className="max-w-md text-ink/65 lg:justify-self-end">
              {lang === 'ar'
                ? 'كل عملية ليها صفحة بتجاوب على الأسئلة اللي الأهالي فعلًا بيسألوها، وفيديو شرح من الدكتور.'
                : 'Each procedure has a page answering the questions parents actually ask, with an explainer from the doctor.'}
            </p>
          </Reveal>
        )}

        {grid ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {all.map(s => {
              const src = img(s.image)
              return (
                <Link key={s.slug} to={`/procedures/${s.slug}`} className="group relative flex min-h-[19rem] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-white p-7 shadow-[0_1px_0_rgba(22,62,122,.04),0_20px_40px_-30px_rgba(22,62,122,.35)] ring-1 ring-navy/5 transition duration-500 hover:-translate-y-1 hover:bg-navy hover:text-cloud">
                  {src
                    ? <img src={src} alt="" className="absolute inset-x-0 top-0 h-32 w-full object-cover opacity-90" />
                    : <ProcedureArt slug={s.slug} tone={s.tone} className="absolute -end-16 -top-16 size-60 opacity-50 transition-opacity group-hover:opacity-90" />}
                  <div className={`relative flex items-start justify-between ${src ? 'mt-28' : ''}`}>
                    <span className="font-serif text-base font-bold text-blue group-hover:text-gold">{s.index}</span>
                    <span className="flex size-10 items-center justify-center rounded-full border border-navy/15 transition group-hover:border-transparent group-hover:bg-gold group-hover:text-navy"><Arrow className="size-4" /></span>
                  </div>
                  <div className="relative">
                    <h3 className="font-display text-2xl leading-tight">{t(s.name)}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/60 group-hover:text-cloud/75">{t(s.short)}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
        <>
        <div className="flex flex-col gap-3 lg:h-[34rem] lg:flex-row">
          {surgeries.map((s, i) => {
            const on = active === i
            return (
              <Link
                key={s.slug}
                to={`/procedures/${s.slug}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={`group relative overflow-hidden rounded-[1.75rem] transition-[flex,background,color] duration-[900ms] ease-lux ${
                  on ? 'lg:flex-[3.2] bg-navy text-cloud' : 'lg:flex-[1] bg-sand/70 text-ink'
                } min-h-[16rem] lg:min-h-0`}
              >
                <ProcedureArt slug={s.slug} tone={on ? '#e3f2fb' : s.tone}
                  className={`absolute -bottom-16 -end-16 size-[26rem] transition-all duration-[1200ms] ease-lux ${on ? 'opacity-90 scale-100' : 'opacity-30 scale-90'}`} />
                <div className="relative flex h-full flex-col justify-between p-7 sm:p-9">
                  <div className="flex items-start justify-between">
                    <span className={`font-serif text-base font-bold ${on ? 'text-gold' : 'text-blue'}`}>{s.index}</span>
                    <span className={`flex size-11 items-center justify-center rounded-full border transition-all duration-700 ${on ? 'bg-blue text-white border-transparent' : 'border-navy/20'}`}>
                      <Arrow className="size-4" />
                    </span>
                  </div>
                  <div>
                    <h3 className={`font-display font-light leading-tight transition-all duration-700 ${on ? 'text-4xl' : 'text-2xl lg:[writing-mode:vertical-rl] lg:rotate-180 lg:text-2xl'} ${lang === 'ar' && !on ? 'lg:rotate-0' : ''}`}>
                      {t(s.name)}
                    </h3>
                    <p className={`mt-4 max-w-md text-cloud/75 transition-all duration-700 ${on ? 'opacity-100 translate-y-0' : 'lg:opacity-0 lg:translate-y-4 lg:h-0'}`}>
                      {t(s.short)}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        {all.length > surgeries.length && (
          <div className="mt-10 flex justify-center">
            <Link to="/procedures" className="btn-blue">{lang === 'ar' ? `كل العمليات (${all.length})` : `All procedures (${all.length})`} <Arrow className="size-4" /></Link>
          </div>
        )}
        </>
        )}
      </div>
    </section>
  )
}
