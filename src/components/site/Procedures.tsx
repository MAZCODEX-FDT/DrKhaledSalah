import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react'
import ProcedureArt from './ProcedureArt'
import Reveal from './Reveal'
import { useI18n } from '../../lib/i18n'
import { surgeries } from '../../content/site'

/** Interactive accordion: the hovered/active panel opens wide, others collapse to slim columns. */
export default function Procedures({ heading = true }: { heading?: boolean }) {
  const { t, lang } = useI18n()
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
      </div>
    </section>
  )
}
