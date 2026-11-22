import PageHero from './PageHero'
import Faq from '../components/site/Faq'
import { useI18n } from '../lib/i18n'
import { generalFaqs, surgeries } from '../content/site'

export default function FaqPage() {
  const { t, lang } = useI18n()
  return (
    <>
      <PageHero eyebrow={lang === 'ar' ? 'أسئلة الأهالي' : 'Parents\' questions'} title={lang === 'ar' ? 'اسأل قبل ما تقرر' : 'Ask before you decide'} />
      <section className="bg-ivory py-24 text-ink">
        <div className="mx-auto max-w-5xl space-y-20 px-6">
          <div>
            <h2 className="mb-6 font-display text-3xl font-light">{lang === 'ar' ? 'عن الحجز والزيارة' : 'Booking & visits'}</h2>
            <Faq items={generalFaqs} light />
          </div>
          {surgeries.map(s => (
            <div key={s.slug}>
              <h2 className="mb-6 font-display text-3xl font-light">{t(s.name)}</h2>
              <Faq items={s.faqs} light />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
