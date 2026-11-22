import ScrollReveal from '../reactbits/ScrollReveal'
import CountUp from '../reactbits/CountUp'
import Reveal from './Reveal'
import { useI18n } from '../../lib/i18n'
import { doctor, stats } from '../../content/site'

export default function PromiseStats() {
  const { t, lang } = useI18n()
  return (
    <section className="relative bg-cloud py-28 text-ink sm:py-40">
      <div className="mx-auto max-w-6xl px-6">
        <p className="eyebrow mb-10 text-navy/70">{lang === 'ar' ? 'وعدنا لحضرتك' : 'Our promise to you'}</p>
        <ScrollReveal key={lang} baseOpacity={0.12} enableBlur blurStrength={6} baseRotation={0} containerClassName="!my-0"
          textClassName="font-display !font-medium !text-[clamp(1.8rem,4vw,3.6rem)] !leading-[1.35] font-light text-ink">
          {t(doctor.promise)}
        </ScrollReveal>

        <Reveal className="mt-24 grid grid-cols-2 border-t hairline-dark lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} data-reveal data-delay={i * 0.08} className="border-b hairline-dark py-10 pe-6 lg:border-b-0 lg:border-e lg:last:border-e-0 lg:ps-8 lg:first:ps-0">
              <div className="font-latin text-[clamp(2.6rem,5vw,4.2rem)] font-light tracking-tight text-navy">
                <span dir="ltr" className="inline-block"><CountUp to={s.value} duration={2.4} />{s.suffix}</span>
              </div>
              <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-ink/60">{t(s.label)}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
