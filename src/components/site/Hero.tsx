import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, ArrowDown, MessageCircle } from 'lucide-react'
import BlurText from '../reactbits/BlurText'
import Magnet from '../reactbits/Magnet'
import { useI18n } from '../../lib/i18n'
import { branches, doctor, ui, waLink } from '../../content/site'
import { gsap, useGSAP } from '../../lib/smooth'

const Silk = lazy(() => import('../reactbits/Silk'))

function useCanAnimate() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setOk(!reduce && window.innerWidth >= 768)
  }, [])
  return ok
}

export default function Hero() {
  const { t, lang } = useI18n()
  const root = useRef<HTMLElement>(null)
  const webgl = useCanAnimate()

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.from('[data-h="eyebrow"]', { y: 20, opacity: 0, duration: 1.2, delay: .2 })
      .from('[data-h="sub"]', { y: 24, opacity: 0, duration: 1.4 }, '-=.7')
      .from('[data-h="cta"] > *', { y: 24, opacity: 0, duration: 1.2, stagger: .1 }, '-=1')
      .from('[data-h="trust"]', { opacity: 0, duration: 1.4 }, '-=.8')
      .from('[data-h="line"]', { scaleX: 0, duration: 1.8, transformOrigin: lang === 'ar' ? 'right' : 'left' }, '-=1.4')
    // Parallax out on scroll
    gsap.to('[data-h="content"]', {
      yPercent: -18, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    })
  }, { scope: root, dependencies: [lang], revertOnUpdate: true })

  const main = branches[0]

  return (
    <section ref={root} className="grain relative isolate flex min-h-[100svh] items-end overflow-hidden pb-16 pt-32 sm:pb-24">
      {/* Background: React Bits Silk on desktop, static gradient fallback on mobile */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(120%_80%_at_70%_10%,#1f4c73_0%,#14304a_45%,#0d2236_100%)]" />
      {webgl && (
        <Suspense fallback={null}>
          <div className="absolute inset-0 -z-10 opacity-70">
            <Silk color="#1f4c73" sheenColor="#d8e7f2" speed={2.2} scale={1.1} sheen={0.35} glow={0.2} depth={0.55} noiseIntensity={0.9} rotation={0.35} clickRipple={false} interactionStrength={0.5} />
          </div>
        </Suspense>
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/40 to-night/10" />

      <div data-h="content" className="relative mx-auto w-full max-w-7xl px-6">
        <p data-h="eyebrow" className="eyebrow mb-8 flex items-center gap-3 text-mist">
          <span className="inline-block size-1.5 rounded-full bg-gold" />
          {t(ui.heroEyebrow)}
        </p>

        <h1 className="font-display text-[clamp(3rem,9vw,8.5rem)] font-light leading-[1.02]">
          <BlurText key={lang} text={t(ui.heroTitle)} animateBy="words" delay={140} direction="bottom" trigger="load" className="!justify-start" />
        </h1>

        <div data-h="line" className="my-10 h-px w-full max-w-3xl bg-gradient-to-l from-transparent via-gold/60 to-gold/0 rtl:bg-gradient-to-r" />

        <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_1fr]">
          <p data-h="sub" className="max-w-xl text-lg leading-relaxed text-cloud/75 sm:text-xl">
            {t(ui.heroSub)}
            <span className="mt-3 block text-sm text-mist/90">{t(doctor.name)} · {t(doctor.title)}</span>
          </p>

          <div className="flex flex-col gap-6 lg:items-end">
            <div data-h="cta" className="flex flex-wrap gap-3">
              <Magnet magnetStrength={4} maxOffset={14}>
                <a href={waLink(main.whatsapp, t(ui.waMsg))} target="_blank" rel="noreferrer" className="btn-gold">
                  <MessageCircle className="size-4" /> {t(ui.bookTagamoa)}
                </a>
              </Magnet>
              <Link to="/book" className="btn-ghost">{t(ui.bookGiza)}</Link>
            </div>
            <div data-h="trust" className="flex items-center gap-4 text-sm text-cloud/70">
              <span className="flex gap-0.5 text-gold">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-4 fill-current" />)}</span>
              <span>{lang === 'ar' ? '5.0 من 220 تقييم على Google' : '5.0 from 220 Google reviews'}</span>
            </div>
          </div>
        </div>

        <div className="mt-16 hidden items-center gap-3 text-xs text-mist sm:flex">
          <ArrowDown className="size-4 animate-bounce" /> {t(ui.scroll)}
        </div>
      </div>
    </section>
  )
}
