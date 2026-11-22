import PageHero from './PageHero'
import PromiseStats from '../components/site/PromiseStats'
import Reveal from '../components/site/Reveal'
import DoctorPortrait from '../components/site/DoctorPortrait'
import { useI18n } from '../lib/i18n'
import { useSite } from '../lib/content'

const values = [
  { t: { ar: 'بنشرح قبل ما نبدأ', en: 'We explain before we begin' }, d: { ar: 'كل كشف بيخرج بورقة مكتوبة: الخطوات والتخدير والتكلفة والميعاد.', en: 'Every consultation ends with a written sheet: steps, anesthesia, cost and date.' } },
  { t: { ar: 'كل حالة ليها خطتها', en: 'Every case has its own plan' }, d: { ar: 'مفيش حلول جاهزة. الخطة بتتبني على حالة طفلك وأسئلتك.', en: 'No off-the-shelf answers. The plan is built around your child and your questions.' } },
  { t: { ar: 'قريبين منك', en: 'Close to you' }, d: { ar: 'فرع في التجمع الخامس وفرع في الجيزة، ونفس الدكتور في الاتنين.', en: 'A branch in the Fifth Settlement and one in Giza, with the same doctor at both.' } },
]

export default function About() {
  const { t, lang } = useI18n()
  const { doctor } = useSite()
  return (
    <>
      <PageHero eyebrow={t(doctor.title)} title={t(doctor.name)}>
        {t(doctor.bio)}
      </PageHero>

      <section className="bg-night py-28">
        <Reveal className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div data-reveal className="mx-auto w-full max-w-md"><DoctorPortrait /></div>
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
