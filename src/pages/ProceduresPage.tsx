import PageHero from './PageHero'
import Procedures from '../components/site/Procedures'
import Journey from '../components/site/Journey'
import { useI18n } from '../lib/i18n'

export default function ProceduresPage() {
  const { lang } = useI18n()
  return (
    <>
      <PageHero eyebrow={lang === 'ar' ? 'العمليات' : 'Procedures'} title={lang === 'ar' ? 'من الطهارة لحد أدق العمليات' : 'From circumcision to the most delicate repairs'}>
        {lang === 'ar' ? 'اختار العملية عشان تشوف الشرح والأسئلة الشائعة وخطوات الرحلة.' : 'Choose a procedure to see the explanation, common questions and each step.'}
      </PageHero>
      <Procedures heading={false} />
      <Journey />
    </>
  )
}
