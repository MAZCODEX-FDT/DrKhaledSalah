import { MapPin, Clock, MessageCircle, Phone, Navigation } from 'lucide-react'
import Reveal from './Reveal'
import { RingBadge } from './PlayTiles'
import { useI18n } from '../../lib/i18n'
import { branches, ui, waLink } from '../../content/site'

export default function Branches() {
  const { t, lang } = useI18n()
  return (
    <section id="branches" className="bg-sand py-28 text-ink sm:py-36">
      <Reveal className="mx-auto max-w-7xl px-6">
        <p data-reveal className="eyebrow mb-5 text-navy/70">{lang === 'ar' ? 'الفروع' : 'Branches'}</p>
        <h2 data-reveal className="mb-14 max-w-3xl font-display text-[clamp(2rem,4.5vw,4rem)] font-light leading-tight">
          {lang === 'ar' ? 'نفس الدكتور، ونفس الهدوء، في فرعين' : 'The same doctor, the same calm, in two branches'}
        </h2>
        <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          {branches.map((b, i) => (
            <article key={b.id} data-reveal data-delay={i * 0.12}
              className={`relative overflow-hidden rounded-[2rem] p-8 sm:p-10 ${b.primary ? 'calm-night brand-pattern text-cloud' : 'border hairline-dark bg-white'}`}>
              {b.primary && (
                <>
                  <span className="relative mb-6 inline-block pill bg-gold text-navy">{lang === 'ar' ? 'الفرع الرئيسي' : 'Main branch'}</span>
                </>
              )}
              <h3 className="relative font-display text-3xl font-light sm:text-4xl">{t(b.name)}</h3>
              <p className={`relative mt-2 ${b.primary ? 'text-cloud/60' : 'text-ink/55'}`}>{t(b.serves)}</p>
              <ul className={`relative mt-8 space-y-4 text-sm ${b.primary ? 'text-cloud/80' : 'text-ink/70'}`}>
                <li className="flex items-center gap-4"><RingBadge className='size-9' tone={b.primary ? 'sun' : 'blue'} bg={b.primary ? 'bg-cloud/10 !text-gold' : 'bg-mist'}><MapPin className='size-4' /></RingBadge>{t(b.address)}</li>
                <li className="flex items-center gap-4"><RingBadge className='size-9' tone={b.primary ? 'sun' : 'blue'} bg={b.primary ? 'bg-cloud/10 !text-gold' : 'bg-mist'}><Clock className='size-4' /></RingBadge>{t(b.hours)}</li>
                <li className="flex items-center gap-4"><RingBadge className='size-9' tone={b.primary ? 'sun' : 'blue'} bg={b.primary ? 'bg-cloud/10 !text-gold' : 'bg-mist'}><Phone className='size-4' /></RingBadge><span dir="ltr">{b.phone}</span></li>
              </ul>
              <div className="relative mt-10 flex flex-wrap gap-3">
                <a href={waLink(b.whatsapp, t(ui.waMsg))} target="_blank" rel="noreferrer" className={b.primary ? 'btn-gold' : 'btn-blue'}>
                  <MessageCircle className="size-4" /> {b.primary ? t(ui.bookTagamoa) : t(ui.bookGiza)}
                </a>
                <a href={b.map} target="_blank" rel="noreferrer" className={`btn-ghost ${b.primary ? '' : '!border-ink/15 hover:!bg-night/5'}`}>
                  <Navigation className="size-4" /> {lang === 'ar' ? 'الاتجاهات' : 'Directions'}
                </a>
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
