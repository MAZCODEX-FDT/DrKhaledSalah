import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Star, ArrowDown, MessageCircle } from 'lucide-react'
import BlurText from '../reactbits/BlurText'
import Magnet from '../reactbits/Magnet'
import { useI18n } from '../../lib/i18n'
import { ui, waLink } from '../../content/site'
import { useSite } from '../../lib/content'
import { gsap, useGSAP } from '../../lib/smooth'
import PlayTiles from './PlayTiles'

export default function Hero() {
  const { t, lang } = useI18n()
  const { branches, doctor, img } = useSite()
  const heroImg = img(doctor.heroImage)
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.from('[data-h="eyebrow"]', { y: 20, opacity: 0, duration: 1.2, delay: .2 })
      .from('[data-h="sub"]', { y: 24, opacity: 0, duration: 1.4 }, '-=.7')
      .from('[data-h="cta"] > *', { y: 24, opacity: 0, duration: 1.2, stagger: .1 }, '-=1')
      .from('[data-h="trust"]', { opacity: 0, duration: 1.4 }, '-=.8')
      .from('[data-h="tiles"] > div > *', { scale: .6, opacity: 0, duration: 1, stagger: { each: .03, from: 'random' } }, 0)
      .from('[data-h="line"]', { scaleX: 0, duration: 1.8, transformOrigin: lang === 'ar' ? 'right' : 'left' }, '-=1.4')
    // Parallax out on scroll
    gsap.to('[data-h="content"]', {
      yPercent: -18, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    })
  }, { scope: root, dependencies: [lang], revertOnUpdate: true })

  const main = branches[0]

  return (
    <section ref={root} className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-16 pt-32 sm:pb-20">
      {/* Blue Sky gradient + soft dots */}
      <div className="calm-night brand-pattern absolute inset-0 -z-20" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-6 lg:grid-cols-[1.3fr_1fr]">
        <div data-h="content">
          <p data-h="eyebrow" className="mb-8">
            <span className="pill bg-gold text-navy">{t(ui.heroEyebrow)}</span>
          </p>

          <h1 className="font-display text-[clamp(3rem,7.4vw,6.8rem)] leading-[1.05]">
            <BlurText key={lang} text={t(ui.heroTitle)} animateBy="words" delay={140} direction="bottom" trigger="load" className="!justify-start" />
          </h1>

          <div data-h="line" className="my-9 h-1.5 w-24 rounded-full bg-gold" />

          <p data-h="sub" className="max-w-xl text-lg leading-relaxed text-cloud/85 sm:text-xl">
            {t(ui.heroSub)}
            <span className="mt-3 block text-sm text-sky">{t(doctor.name)} · {t(doctor.title)}</span>
          </p>

          <div data-h="cta" className="mt-10 flex flex-wrap gap-3">
            <Magnet magnetStrength={4} maxOffset={14}>
              <a href={waLink(main.whatsapp, t(ui.waMsg))} target="_blank" rel="noreferrer" className="btn-gold">
                <MessageCircle className="size-4" /> {t(ui.bookTagamoa)}
              </a>
            </Magnet>
            <Link to="/book" className="btn-ghost">{t(ui.bookGiza)}</Link>
          </div>
          <div data-h="trust" className="mt-6 flex items-center gap-4 text-sm text-cloud/80">
            <span className="flex gap-0.5 text-gold">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-4 fill-current" />)}</span>
            <span>{lang === 'ar' ? '5.0 من 220 تقييم على Google' : '5.0 from 220 Google reviews'}</span>
          </div>
        </div>

        {/* KS Play mosaic: edge decoration, no text on it */}
        {heroImg ? (
          <div data-h="tiles" className="relative hidden lg:block">
            <div><img src={heroImg} alt={t(doctor.name)} className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-[0_40px_80px_-40px_rgba(0,0,0,.5)]" /></div>
            <PlayTiles cols={2} rows={1} offset={1} className="absolute -bottom-6 -start-6 w-40 overflow-hidden rounded-2xl" />
          </div>
        ) : (
          <div data-h="tiles" className="hidden overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-40px_rgba(0,0,0,.5)] lg:block">
            <PlayTiles cols={4} rows={5} />
          </div>
        )}
        <PlayTiles cols={6} rows={1} offset={4} className="-mx-6 lg:hidden" />
      </div>

      <div className="absolute bottom-6 start-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs text-sky rtl:translate-x-1/2 sm:flex">
        <ArrowDown className="size-4 animate-bounce" /> {t(ui.scroll)}
      </div>
    </section>
  )
}
