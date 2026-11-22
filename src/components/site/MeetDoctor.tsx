import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import Reveal from './Reveal'
import DoctorPortrait from './DoctorPortrait'
import { RingBadge } from './PlayTiles'
import { useI18n } from '../../lib/i18n'
import { useSite } from '../../lib/content'

/** Home: "Meet the doctor", right after the hero. Text and portrait come from Dashboard → Website → Doctor. */
export default function MeetDoctor() {
  const { t, lang } = useI18n()
  const { doctor } = useSite()
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight
  return (
    <section className="relative overflow-hidden bg-cloud py-24 text-ink sm:py-32">
      <Reveal className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[0.9fr_1.2fr] lg:gap-20">
        <div data-reveal className="mx-auto w-full max-w-sm lg:max-w-md">
          <DoctorPortrait />
        </div>
        <div>
          <p data-reveal className="mb-5"><span className="pill bg-mist text-blue">{lang === 'ar' ? 'تعرّف على الدكتور' : 'Meet the doctor'}</span></p>
          <h2 data-reveal className="font-display text-[clamp(2.2rem,4.6vw,4rem)] leading-tight text-navy">{t(doctor.name)}</h2>
          <p data-reveal className="mt-2 text-lg text-blue">{t(doctor.title)}</p>
          <p data-reveal className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/75">{t(doctor.promise)}</p>
          <p data-reveal className="mt-4 max-w-2xl leading-relaxed text-ink/60">{t(doctor.bio)}</p>
          {(doctor.highlights ?? []).length > 0 && (
            <ul data-reveal className="mt-10 grid gap-5 sm:grid-cols-3">
              {(doctor.highlights ?? []).map((h, i) => (
                <li key={i} className="flex items-center gap-4 sm:flex-col sm:items-start">
                  <RingBadge className="size-11" tone={i % 2 ? 'blue' : 'sun'}><Check className="size-4" /></RingBadge>
                  <span className="text-sm leading-snug text-ink/80">{t(h)}</span>
                </li>
              ))}
            </ul>
          )}
          <Link data-reveal to="/about" className="btn-blue mt-10">{lang === 'ar' ? 'اعرف أكتر عن الدكتور' : 'More about the doctor'} <Arrow className="size-4" /></Link>
        </div>
      </Reveal>
    </section>
  )
}
