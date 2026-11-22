import { useRef } from 'react'
import { useI18n } from '../../lib/i18n'
import { journey } from '../../content/site'
import { gsap, useGSAP } from '../../lib/smooth'

/** Pinned horizontal track: the family's journey from first message to the one-week check-up. */
export default function Journey() {
  const { t, lang } = useI18n()
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const el = track.current!
      const dist = () => el.scrollWidth - window.innerWidth + 96
      const sign = lang === 'ar' ? 1 : -1
      gsap.to(el, {
        x: () => sign * dist(), ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${dist()}`, scrub: 1, pin: true, invalidateOnRefresh: true },
      })
      gsap.fromTo('[data-j="bar"]', { scaleX: 0 }, {
        scaleX: 1, ease: 'none', transformOrigin: lang === 'ar' ? 'right' : 'left',
        scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${dist()}`, scrub: true },
      })
    })
    return () => mm.revert()
  }, { scope: root, dependencies: [lang], revertOnUpdate: true })

  return (
    <section ref={root} className="relative overflow-hidden bg-ink-2 py-24 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0">
      <div className="mx-auto mb-14 w-full max-w-7xl px-6">
        <p className="eyebrow mb-5 text-gold-2">{lang === 'ar' ? 'رحلة حضرتك معانا' : 'Your journey with us'}</p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-2xl font-display text-[clamp(2rem,4.5vw,4rem)] font-light leading-tight">
            {lang === 'ar' ? 'نظام مكتوب، من أول رسالة لحد آخر متابعة' : 'A written system, from first message to last follow-up'}
          </h2>
          <div className="hidden h-px w-64 bg-ivory/10 lg:block"><div data-j="bar" className="h-px bg-gold" /></div>
        </div>
      </div>

      <div ref={track} className="flex flex-col gap-5 px-6 lg:flex-row lg:gap-6 lg:ps-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
        {journey.map((s, i) => (
          <article key={s.k} className="group relative flex shrink-0 flex-col justify-between overflow-hidden rounded-[1.75rem] border hairline bg-ink p-8 lg:h-[24rem] lg:w-[26rem]">
            <div className="absolute -end-10 -top-10 size-40 rounded-full bg-gold/5 blur-2xl transition-all duration-700 group-hover:bg-gold/15" />
            <span className="font-latin text-[5.5rem] font-extralight leading-none text-ivory/10">{s.k}</span>
            <div>
              <h3 className="font-display text-2xl font-normal text-gold-2 sm:text-3xl">{t(s.t)}</h3>
              <p className="mt-4 leading-relaxed text-ivory/70">{t(s.d)}</p>
            </div>
            {i < journey.length - 1 && <span className="absolute bottom-8 end-8 hidden h-px w-10 bg-gold/40 lg:block" />}
          </article>
        ))}
        <div className="hidden w-24 shrink-0 lg:block" />
      </div>
    </section>
  )
}
