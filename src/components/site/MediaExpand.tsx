import { useRef } from 'react'
import { Play } from 'lucide-react'
import { useI18n } from '../../lib/i18n'
import { gsap, useGSAP } from '../../lib/smooth'
import { Mark } from './Logo'

/** Scroll-driven media expansion: a framed card grows to full bleed while the headline splits apart. */
export default function MediaExpand() {
  const { lang } = useI18n()
  const root = useRef<HTMLElement>(null)
  const ar = lang === 'ar'

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=140%', scrub: 1, pin: true },
      })
      tl.fromTo('[data-m="card"]', { width: '46vw', height: '56vh', borderRadius: 32 }, { width: '100vw', height: '100vh', borderRadius: 0, ease: 'power2.inOut' })
        .to('[data-m="a"]', { xPercent: ar ? 60 : -60, opacity: 0, ease: 'power2.in' }, 0)
        .to('[data-m="b"]', { xPercent: ar ? -60 : 60, opacity: 0, ease: 'power2.in' }, 0)
        .fromTo('[data-m="inner"]', { scale: 1.25 }, { scale: 1, ease: 'none' }, 0)
        .fromTo('[data-m="copy"]', { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'power2.out' }, 0.55)
    })
    return () => mm.revert()
  }, { scope: root, dependencies: [lang], revertOnUpdate: true })

  return (
    <section ref={root} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink py-20 md:py-0">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 hidden -translate-y-1/2 justify-between px-[4vw] font-display text-[clamp(3rem,8vw,8rem)] font-light md:flex">
        <span data-m="a" className="gold-text">{ar ? 'بنشرح' : 'Explain'}</span>
        <span data-m="b" className="text-ivory/90">{ar ? 'قبل ما نبدأ' : 'then begin'}</span>
      </div>

      <div data-m="card" className="relative mx-6 h-[70vh] w-full overflow-hidden rounded-[2rem] md:mx-0">
        <div data-m="inner" className="absolute inset-0 bg-[radial-gradient(90%_70%_at_30%_30%,#2a5254_0%,#132e31_50%,#0a1719_100%)]">
          {/* Concentric "lens" composition */}
          <svg viewBox="0 0 800 800" className="absolute -end-40 top-1/2 h-[140%] -translate-y-1/2 opacity-40" aria-hidden>
            {Array.from({ length: 14 }).map((_, i) => (
              <circle key={i} cx="400" cy="400" r={40 + i * 26} fill="none" stroke="#c9a96a" strokeWidth=".8" opacity={1 - i * 0.06} />
            ))}
          </svg>
          <div className="grain absolute inset-0" />
        </div>

        <div data-m="copy" className="relative flex h-full flex-col justify-between p-8 sm:p-14 md:pt-28">
          <div className="flex items-center gap-3 text-sm text-ivory/70">
            <Mark className="size-8" />
            <span>{ar ? 'قناة د. خالد صلاح على YouTube' : 'Dr. Khaled Salah on YouTube'}</span>
          </div>
          <div className="max-w-2xl">
            <a href="https://www.youtube.com/results?search_query=%D8%AF.+%D8%AE%D8%A7%D9%84%D8%AF+%D8%B5%D9%84%D8%A7%D8%AD+%D8%AC%D8%B1%D8%A7%D8%AD%D8%A9+%D8%A7%D9%84%D8%A3%D8%B7%D9%81%D8%A7%D9%84" target="_blank" rel="noreferrer"
              className="group mb-8 inline-flex size-20 items-center justify-center rounded-full bg-ivory/10 backdrop-blur-md transition-all duration-700 ease-lux hover:scale-110 hover:bg-gold">
              <Play className="size-7 fill-ivory text-ivory transition-colors group-hover:fill-ink group-hover:text-ink" />
            </a>
            <h2 className="font-display text-[clamp(2rem,4.5vw,4rem)] font-light leading-tight">
              {ar ? 'أكتر من 500 فيديو بيشرح لحضرتك قبل ما تيجي' : 'Over 500 videos that explain before you even visit'}
            </h2>
            <p className="mt-5 max-w-lg text-ivory/70">
              {ar
                ? 'الأول على YouTube في شرح الفتق الإربي عند الأطفال، وفيديو الخصية المعلقة وصل 171 ألف مشاهدة.'
                : 'The top YouTube result for pediatric inguinal hernia, and the undescended testis video passed 171K views.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
