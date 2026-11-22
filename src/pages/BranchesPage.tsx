import PageHero from './PageHero'
import Branches from '../components/site/Branches'
import { useI18n } from '../lib/i18n'

export default function BranchesPage() {
  const { lang } = useI18n()
  return (
    <>
      <PageHero eyebrow={lang === 'ar' ? 'الفروع' : 'Branches'} title={lang === 'ar' ? 'أقرب فرع لحضرتك' : 'The branch nearest you'}>
        {lang === 'ar' ? 'رقم واحد لكل فرع، وزرار حجز مباشر على واتساب.' : 'One number per branch, and a direct WhatsApp booking button.'}
      </PageHero>
      <Branches />
    </>
  )
}
