import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Visitors who ask their phone for less motion get near-instant animations everywhere. */
export const reduceMotion = typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)
if (reduceMotion) gsap.globalTimeline.timeScale(20)

let lenis: Lenis | null = null
export const getLenis = () => lenis

/** One Lenis instance, ticked by GSAP's ticker so ScrollTrigger stays in sync. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()

  useEffect(() => {
    lenis = new Lenis({ lerp: 0.09, respectReducedMotion: true, anchors: { offset: -90 }, allowNestedScroll: true, autoToggle: true, stopInertiaOnNavigate: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis?.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    const onLoad = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(onLoad)
    return () => { gsap.ticker.remove(tick); lenis?.destroy(); lenis = null }
  }, [])

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true })
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [pathname])

  return <>{children}</>
}

export { gsap, ScrollTrigger, useGSAP }
