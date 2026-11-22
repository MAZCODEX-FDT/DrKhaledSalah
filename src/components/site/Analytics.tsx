import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useI18n } from '../../lib/i18n'
import { useContent } from '../../lib/content'

/**
 * Loads Google Analytics 4 and Meta Pixel when their IDs are set in Dashboard → Analytics,
 * after the visitor accepts (unless consent is switched off), and sends a page view on every route change.
 */
type W = Window & { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void; fbq?: ((...a: unknown[]) => void) & { queue?: unknown[]; callMethod?: (...a: unknown[]) => void; loaded?: boolean; version?: string; push?: unknown } }
const CONSENT = 'ks-consent'
export const validGa4 = (id: string) => /^G-[A-Z0-9]{4,}$/.test(id.trim())
export const validPixel = (id: string) => /^\d{8,20}$/.test(id.trim())

function readConsent(): 'yes' | 'no' | null { try { return (localStorage.getItem(CONSENT) as 'yes' | 'no' | null) } catch { return null } }

function loadScript(src: string) {
  if (document.querySelector(`script[src="${src}"]`)) return
  const s = document.createElement('script'); s.async = true; s.src = src; document.head.appendChild(s)
}

function startGa4(id: string) {
  const w = window as W
  if (w.gtag) return
  w.dataLayer = w.dataLayer || []
  // gtag must push the arguments object itself
  w.gtag = function () { w.dataLayer!.push(arguments) } // eslint-disable-line prefer-rest-params
  w.gtag('js', new Date())
  w.gtag('config', id, { send_page_view: false, anonymize_ip: true })
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`)
}

function startPixel(id: string) {
  const w = window as W
  if (w.fbq) return
  const f = function (...a: unknown[]) { f.callMethod ? f.callMethod(...a) : f.queue!.push(a) } as NonNullable<W['fbq']>
  f.queue = []; f.loaded = true; f.version = '2.0'; f.push = f
  w.fbq = f
  loadScript('https://connect.facebook.net/en_US/fbevents.js')
  w.fbq('init', id)
}

export default function Analytics() {
  const { lang } = useI18n()
  const cfg = useContent(d => d.tracking)
  const { pathname } = useLocation()
  const [consent, setConsent] = useState(readConsent)
  const ga = validGa4(cfg.ga4) ? cfg.ga4.trim() : ''
  const px = validPixel(cfg.pixel) ? cfg.pixel.trim() : ''
  const any = !!(ga || px)
  const allowed = any && (!cfg.askConsent || consent === 'yes')

  useEffect(() => { if (allowed) { if (ga) startGa4(ga); if (px) startPixel(px) } }, [allowed, ga, px])
  useEffect(() => {
    if (!allowed) return
    const w = window as W
    w.gtag?.('event', 'page_view', { page_path: pathname, page_location: location.href, page_title: document.title, language: lang })
    w.fbq?.('track', 'PageView')
  }, [allowed, pathname, lang])

  if (!any || !cfg.askConsent || consent) return null
  const choose = (v: 'yes' | 'no') => { try { localStorage.setItem(CONSENT, v) } catch { /* ignore */ } setConsent(v) }
  const ar = lang === 'ar'
  return (
    <div role="dialog" aria-label={ar ? 'الكوكيز' : 'Cookies'} className="fixed inset-x-3 bottom-[8.5rem] z-[70] mx-auto max-w-xl rounded-3xl bg-navy p-5 text-cloud shadow-2xl md:bottom-6 print:hidden">
      <p className="text-sm leading-relaxed text-cloud/85">{ar ? 'بنستخدم أدوات قياس بسيطة عشان نعرف أنهي صفحات وفيديوهات بتفيد الأهالي أكتر. مش بنجمع أسماء ولا بيانات طبية.' : 'We use simple measurement tools to learn which pages and videos help parents most. We do not collect names or medical details.'}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={() => choose('yes')} className="btn-gold min-h-11 !py-2.5">{ar ? 'موافق' : 'Accept'}</button>
        <button onClick={() => choose('no')} className="btn-ghost min-h-11 !py-2.5">{ar ? 'لا، شكرًا' : 'No, thanks'}</button>
      </div>
    </div>
  )
}
