import { Globe, Mail, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHero from './PageHero'
import Branches from '../components/site/Branches'
import Reveal from '../components/site/Reveal'
import SocialIcon from '../components/site/SocialIcon'
import { RingBadge } from '../components/site/PlayTiles'
import { useI18n } from '../lib/i18n'
import { ui, waLink } from '../content/site'
import { useSite } from '../lib/content'

/** Contact us: email, website and WhatsApp cards, a row of social links, then the branches. All editable in Dashboard → Website content → Contact. */
export default function Contact() {
  const { t, lang } = useI18n()
  const { contact, socials } = useSite()
  const cards = [
    contact.showWhatsapp && contact.whatsapp && {
      icon: MessageCircle, tone: 'sun' as const, label: lang === 'ar' ? 'واتساب' : 'WhatsApp',
      value: `+${contact.whatsapp}`, href: waLink(contact.whatsapp, t(ui.waMsg)), cta: lang === 'ar' ? 'ابعت رسالة' : 'Send a message',
    },
    contact.showEmail && contact.email && {
      icon: Mail, tone: 'blue' as const, label: lang === 'ar' ? 'البريد الإلكتروني' : 'Email',
      value: contact.email, href: `mailto:${contact.email}`, cta: lang === 'ar' ? 'ابعت إيميل' : 'Write an email',
    },
    contact.showWebsite && contact.website && {
      icon: Globe, tone: 'sun' as const, label: lang === 'ar' ? 'الموقع' : 'Website',
      value: contact.website.replace(/^https?:\/\//, ''), href: /^https?:/.test(contact.website) ? contact.website : `https://${contact.website}`, cta: lang === 'ar' ? 'افتح الموقع' : 'Open website',
    },
  ].filter(Boolean) as { icon: typeof Mail; tone: 'sun' | 'blue'; label: string; value: string; href: string; cta: string }[]

  return (
    <>
      <PageHero eyebrow={lang === 'ar' ? 'تواصل معنا' : 'Contact us'} title={lang === 'ar' ? 'إحنا هنا لأي سؤال' : 'We are here for any question'}>
        {lang === 'ar' ? 'اختار الطريقة اللي تريحك. بنرد خلال 15 دقيقة في مواعيد العمل.' : 'Choose whichever suits you. We reply within 15 minutes during working hours.'}
      </PageHero>

      <section className="bg-cloud py-20 text-ink sm:py-28">
        <Reveal className="mx-auto max-w-7xl px-6">
          <div className="grid gap-5 md:grid-cols-3">
            {cards.map((c, i) => (
              <a key={i} data-reveal data-delay={i * .08} href={c.href} target={c.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer"
                className="group flex flex-col gap-6 rounded-[1.75rem] bg-white p-8 ring-1 ring-navy/5 shadow-[0_20px_40px_-30px_rgba(22,62,122,.35)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_50px_-30px_rgba(22,62,122,.5)]">
                <RingBadge className="size-14" tone={c.tone}><c.icon className="size-6" /></RingBadge>
                <div>
                  <p className="text-sm text-ink/55">{c.label}</p>
                  <p className="mt-1 break-all font-display text-2xl text-navy" dir="ltr" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>{c.value}</p>
                </div>
                <span className="mt-auto inline-flex w-fit items-center rounded-full bg-mist px-4 py-2 text-sm font-semibold text-blue transition group-hover:bg-gold group-hover:text-navy">{c.cta}</span>
              </a>
            ))}
          </div>

          {socials.length > 0 && (
            <div data-reveal className="mt-14 flex flex-col items-center gap-6 rounded-[1.75rem] bg-navy px-6 py-10 text-cloud sm:flex-row sm:justify-between sm:px-10">
              <div>
                <p className="font-display text-2xl">{lang === 'ar' ? 'تابع الدكتور' : 'Follow the doctor'}</p>
                <p className="mt-1 text-sm text-cloud/65">{lang === 'ar' ? 'شرح بسيط لكل عملية وأسئلة الأهالي كل أسبوع.' : 'Simple explanations of each procedure and parents\' questions every week.'}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {socials.map(s => (
                  <a key={s.id} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label}
                    className="flex items-center gap-2 rounded-full border border-cloud/20 px-4 py-2.5 text-sm transition hover:border-gold hover:bg-gold hover:text-navy">
                    <SocialIcon platform={s.platform} />{s.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          <p data-reveal className="mt-10 text-center text-sm text-ink/55">
            {lang === 'ar' ? 'حابب تسيب بياناتك ونكلّمك إحنا؟ ' : 'Prefer that we call you? '}
            <Link to="/book" className="font-semibold text-blue underline-offset-4 hover:underline">{lang === 'ar' ? 'املأ طلب الحجز' : 'Fill in the booking request'}</Link>
          </p>
        </Reveal>
      </section>

      <Branches />
    </>
  )
}
