import { Link } from 'react-router-dom'
import Hero from '../components/site/Hero'
import MeetDoctor from '../components/site/MeetDoctor'
import MediaExpand from '../components/site/MediaExpand'
import PromiseStats from '../components/site/PromiseStats'
import Procedures from '../components/site/Procedures'
import Journey from '../components/site/Journey'
import Videos from '../components/site/Videos'
import Branches from '../components/site/Branches'
import GoogleReviews from '../components/site/GoogleReviews'
import Faq from '../components/site/Faq'
import Reveal from '../components/site/Reveal'
import { useI18n } from '../lib/i18n'
import { useSite } from '../lib/content'

export default function Home() {
  const { lang } = useI18n()
  const { faqs: generalFaqs } = useSite()
  return (
    <>
      <Hero />
      <MeetDoctor />
      <MediaExpand />
      <PromiseStats />
      <Procedures />
      <Journey />
      <Videos />
      <GoogleReviews />
      <Branches />
      <section className="bg-cloud py-28 text-ink sm:py-36">
        <Reveal className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p data-reveal className="eyebrow mb-5 text-blue">{lang === 'ar' ? 'أسئلة الأهالي' : 'Parents\' questions'}</p>
            <h2 data-reveal className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light leading-tight">
              {lang === 'ar' ? 'اسأل اللي في بالك' : 'Ask what\'s on your mind'}
            </h2>
            <Link data-reveal to="/faq" className="btn-ghost mt-8 !border-navy/20 hover:!bg-navy/5">{lang === 'ar' ? 'كل الأسئلة' : 'All questions'}</Link>
          </div>
          <div data-reveal><Faq items={generalFaqs.slice(0, 4)} light /></div>
        </Reveal>
      </section>
    </>
  )
}
