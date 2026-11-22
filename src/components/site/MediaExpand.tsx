import { useRef } from 'react'
import { Play } from 'lucide-react'
import { useI18n } from '../../lib/i18n'
import { gsap, useGSAP } from '../../lib/smooth'
import { Mark } from './Logo'
import { useSite } from '../../lib/content'
import YouTubePlayer from './YouTubePlayer'

/** Scroll-driven media expansion: a framed card grows to full bleed while the headline splits apart. */
export default function MediaExpand() {
  const { lang, t } = useI18n()
  const { featuredVideo: fv, socials } = useSite()
  const channel = socials.find(s => s.platform === 'youtube')?.url ?? 'https://www.youtube.com/'
  const root = useRef<HTMLElement>(null)
  const ar = lang === 'ar'

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=140%', scrub: 1, pin: true },
      })
      tl.fromTo('[data-m="card"]', { width: '38vw', height: '74vh', borderRadius: '999px 999px 28px 28px' }, { width: '100vw', height: '100vh', borderRadius: '0px 0px 0px 0px', ease: 'power2.inOut' })
        .to('[data-m="a"]', { xPercent: ar ? 60 : -60, opacity: 0, ease: 'power2.in' }, 0)
        .to('[data-m="b"]', { xPercent: ar ? -60 : 60, opacity: 0, ease: 'power2.in' }, 0)
        .fromTo('[data-m="inner"]', { scale: 1.25 }, { scale: 1, ease: 'none' }, 0)
        .fromTo('[data-m="copy"]', { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'power2.out' }, 0.55)
    })
    return () => mm.revert()
  }, { scope: root, dependencies: [lang], revertOnUpdate: true })

  return (
    <section ref={root} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-night py-20 md:py-0">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 hidden -translate-y-1/2 justify-between px-[4vw] font-display text-[clamp(3rem,8vw,8rem)] font-light md:flex">
        <span data-m="a" className="gold-text">{ar ? 'بنشرح' : 'Explain'}</span>
        <span data-m="b" className="text-cloud/90">{ar ? 'قبل ما نبدأ' : 'then begin'}</span>
      </div>

      <div data-m="card" className="arch relative mx-6 h-[70vh] w-full overflow-hidden md:mx-0">
        <div data-m="inner" className="calm-night brand-pattern absolute inset-0">
          <div className="grain absolute inset-0" />
        </div>

        <div data-m="copy" className="relative flex h-full flex-col justify-between p-8 sm:p-14 md:pt-28">
          <div className="flex items-center gap-3 text-sm text-cloud/70">
            <Mark className="h-8 w-10" />
            <span>{ar ? 'قناة د. خالد صلاح على YouTube' : 'Dr. Khaled Salah on YouTube'}</span>
          </div>
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div className="max-w-2xl">
              {!fv && (
                <a href={channel} target="_blank" rel="noreferrer"
                  className="group mb-8 inline-flex size-20 items-center justify-center rounded-full bg-cloud/10 backdrop-blur-md transition-all duration-700 ease-lux hover:scale-110 hover:bg-blue">
                  <Play className="size-7 fill-cloud text-cloud transition-colors group-hover:fill-white group-hover:text-white" />
                </a>
              )}
              <h2 className="font-display text-[clamp(2rem,4.5vw,4rem)] font-light leading-tight">
                {ar ? 'أكتر من 900 فيديو بيشرح لحضرتك قبل ما تيجي' : 'Over 900 videos that explain before you even visit'}
              </h2>
              <p className="mt-5 max-w-lg text-cloud/70">
                {ar
                  ? 'الأول على YouTube في شرح الفتق الإربي عند الأطفال، وفيديو الخصية المعلقة وصل 171 ألف مشاهدة.'
                  : 'The top YouTube result for pediatric inguinal hernia, and the undescended testis video passed 171K views.'}
              </p>
              <a href={channel} target="_blank" rel="noreferrer" className="btn-ghost mt-8">{ar ? 'افتح القناة' : 'Open the channel'}</a>
            </div>
            {fv && (
              <div>
                <YouTubePlayer url={fv.url} title={t(fv.title)} big className="rounded-[1.5rem] shadow-[0_40px_80px_-40px_rgba(0,0,0,.7)]" />
                <p className="mt-3 text-sm text-cloud/80">{t(fv.title)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
