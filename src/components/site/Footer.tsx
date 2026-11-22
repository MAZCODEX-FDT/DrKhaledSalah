import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Play, Camera, ThumbsUp } from 'lucide-react'
import ShinyText from '../reactbits/ShinyText'
import Logo from './Logo'
import { useI18n } from '../../lib/i18n'
import { branches, doctor, surgeries, ui, waLink } from '../../content/site'
import { gsap, useGSAP } from '../../lib/smooth'

export default function Footer() {
  const { t, lang } = useI18n()
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    gsap.from('[data-f="big"]', {
      yPercent: 60, opacity: 0, ease: 'expo.out', duration: 1.6,
      scrollTrigger: { trigger: '[data-f="big"]', start: 'top 95%', once: true },
    })
  }, { scope: root, dependencies: [lang], revertOnUpdate: true })

  return (
    <footer ref={root} className="relative overflow-hidden bg-ink pt-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-10 border-b hairline pb-16 lg:flex-row lg:items-end">
          <h2 className="max-w-2xl font-display text-[clamp(2rem,4.5vw,4rem)] font-light leading-tight">
            {lang === 'ar' ? 'عندك سؤال؟ اسأل قبل ما تقرر.' : 'Have a question? Ask before you decide.'}
          </h2>
          <a href={waLink(branches[0].whatsapp, t(ui.waMsg))} target="_blank" rel="noreferrer" className="btn-gold">
            <MessageCircle className="size-4" /> {lang === 'ar' ? 'كلّمنا على واتساب' : 'Message us on WhatsApp'}
          </a>
        </div>

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-5">
            <Logo />
            <p className="text-sm leading-relaxed text-ivory/55">{t(doctor.title)}</p>
            <div className="flex gap-2">
              {[ThumbsUp, Camera, Play].map((I, i) => (
                <a key={i} href="#" className="flex size-10 items-center justify-center rounded-full border hairline text-ivory/70 transition hover:border-gold hover:text-gold" aria-label={["Facebook", "Instagram", "YouTube"][i]}><I className="size-4" /></a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-5 text-sm text-gold-2">{t(ui.nav.surgeries)}</h4>
            <ul className="space-y-3 text-sm text-ivory/65">
              {surgeries.map(s => <li key={s.slug}><Link className="hover:text-ivory" to={`/procedures/${s.slug}`}>{t(s.name)}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="mb-5 text-sm text-gold-2">{t(ui.nav.branches)}</h4>
            <ul className="space-y-3 text-sm text-ivory/65">
              {branches.map(b => <li key={b.id}>{t(b.name)}<span className="block text-ivory/40 rtl:text-right" dir="ltr">{b.phone}</span></li>)}
            </ul>
          </div>
          <div>
            <h4 className="mb-5 text-sm text-gold-2">{lang === 'ar' ? 'روابط' : 'Links'}</h4>
            <ul className="space-y-3 text-sm text-ivory/65">
              <li><Link className="hover:text-ivory" to="/about">{t(ui.nav.about)}</Link></li>
              <li><Link className="hover:text-ivory" to="/faq">{t(ui.nav.faq)}</Link></li>
              <li><Link className="hover:text-ivory" to="/book">{t(ui.nav.book)}</Link></li>
              <li><Link className="hover:text-ivory" to="/dashboard">{t(ui.nav.dashboard)}</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="pointer-events-none select-none overflow-hidden px-4">
        <div data-f="big" className="whitespace-nowrap text-center font-display text-[clamp(4rem,15vw,16rem)] font-light leading-[.9]">
          <ShinyText text={lang === 'ar' ? 'د. خالد صلاح' : 'Khaled Salah'} color="#1d3a3d" shineColor="#e4cf9f" speed={5} />
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 border-t hairline px-6 py-6 text-xs text-ivory/40">
        <span>© {new Date().getFullYear()} {t(doctor.name)}</span>
        <span>{lang === 'ar' ? 'المحتوى للتوعية ولا يغني عن الكشف الطبي' : 'Content is for awareness and does not replace a medical consultation'}</span>
      </div>
    </footer>
  )
}
