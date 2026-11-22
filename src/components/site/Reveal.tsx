import { useRef, type ReactNode, type ElementType } from 'react'
import { gsap, useGSAP } from '../../lib/smooth'

/** Fades/rises every [data-reveal] child into view. One ScrollTrigger batch per wrapper. */
export default function Reveal({ children, as: Tag = 'div', className = '', y = 40 }: { children: ReactNode; as?: ElementType; className?: string; y?: number }) {
  const ref = useRef<HTMLElement>(null)
  useGSAP(() => {
    const els = ref.current?.querySelectorAll('[data-reveal]')
    if (!els?.length) return
    gsap.set(els, { opacity: 0, y })
    gsap.utils.toArray<HTMLElement>(els).forEach(el => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1.2, ease: 'expo.out',
        delay: Number(el.dataset.delay || 0),
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
    })
  }, { scope: ref })
  return <Tag ref={ref} className={className}>{children}</Tag>
}
