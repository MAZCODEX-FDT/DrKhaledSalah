import PageHero from './PageHero'
import PromiseStats from '../components/site/PromiseStats'
import Reveal from '../components/site/Reveal'
import { Mark } from '../components/site/Logo'
import { useI18n } from '../lib/i18n'
import { doctor } from '../content/site'

const values = [
  { t: { ar: 'بنشرح قبل ما نبدأ', en: 'We explain before we begin' }, d: { ar: 'كل كشف بيخرج بورقة مكتوبة: الخطوات والتخدير والتكلفة والميعاد.', en: 'Every consultation ends with a written sheet: steps, anesthesia, cost and date.' } },
  { t: { ar: 'كل حالة ليها خطتها', en: 'Every case has its own plan' }, d: { ar: 'مفيش حلول جاهزة. الخطة بتتبني على حالة طفلك وأسئلتك.', en: 'No off-the-shelf answers. The plan is built around your child and your questions.' } },
  { t: { ar: 'قريبين منك', en: 'Close to you' }, d: { ar: 'فرع في التجمع الخامس وفرع في الجيزة، ونفس الدكتور في الاتنين.', en: 'A branch in the Fifth Settlement and one in Giza, with the same doctor at both.' } },
]

export default function About() {
  const { t, lang } = useI18n()
  return (
    <>
      <PageHero eyebrow={t(doctor.title)} title={t(doctor.name)}>
        {lang === 'ar'
          ? 'أكتر من 15 سنة في جراحة الأطفال وحديثي الولادة، وقناة بيتعلم منها أكتر من 100 ألف أب وأم.'
          : 'Over 15 years in pediatric and neonatal surgery, and a channel more than 100,000 parents learn from.'}
      </PageHero>

      <section className="bg-night py-28">
        <Reveal className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          {/* TODO: replace with the doctor's portrait from the photo shoot */}
          <div data-reveal className="relative mx-auto aspect-square w-full max-w-md">
            {/* Circle portrait with a two-colour ring (brand book v2) */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90" aria-hidden>
              <circle cx="50" cy="50" r="48" fill="none" stroke="#2f6fd1" strokeWidth="2.2" strokeDasharray="190 400" strokeLinecap="round" />
              <circle cx="50" cy="50" r="48" fill="none" stroke="#ffc83d" strokeWidth="2.2" strokeDasharray="88 400" strokeDashoffset="-205" strokeLinecap="round" />
            </svg>
            <div className="calm-night brand-pattern absolute inset-[6%] flex flex-col items-center justify-center gap-4 overflow-hidden rounded-full text-center text-cloud/60">
              <Mark className="h-24 w-28" />
              <span className="text-sm">{lang === 'ar' ? 'صورة الدكتور من يوم التصوير' : 'Doctor\'s portrait from the shoot'}</span>
            </div>
          </div>
          <div>
            <p data-reveal className="eyebrow mb-5 text-mist">{lang === 'ar' ? 'طريقة الشغل' : 'How we work'}</p>
            <h2 data-reveal className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light leading-tight">
              {lang === 'ar' ? 'الأهل اللي بيفهموا، بيقرروا وهم مطمّنين' : 'Parents who understand decide with peace of mind'}
            </h2>
            <div className="mt-12 space-y-8">
              {values.map((v, i) => (
                <div key={i} data-reveal data-delay={i * .08} className="flex gap-6 border-t hairline pt-8">
                  <span className="font-serif text-lg font-bold text-gold">0{i + 1}</span>
                  <div>
                    <h3 className="font-display text-2xl font-light">{t(v.t)}</h3>
                    <p className="mt-2 text-cloud/65">{t(v.d)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
      <PromiseStats />
    </>
  )
}
