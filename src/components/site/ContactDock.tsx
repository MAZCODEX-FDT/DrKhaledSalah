import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CalendarCheck, LocateFixed, MessageCircle, Phone } from 'lucide-react'
import { useI18n } from '../../lib/i18n'
import { useSite } from '../../lib/content'
import { ui, waLink } from '../../content/site'
import { findNearest, setPreferredBranch, usePreferredBranch } from '../../lib/branchPref'
import { track } from '../../lib/track'

/**
 * WhatsApp + call on every page, for the visitor's branch (picked by hand or by location).
 * Desktop: a floating stack at the bottom corner. Mobile: a fixed bar along the bottom edge.
 */
export default function ContactDock() {
  const { t, lang } = useI18n()
  const ar = lang === 'ar'
  const { branches } = useSite()
  const pref = usePreferredBranch()
  const { pathname } = useLocation()
  const [locating, setLocating] = useState(false)
  const b = branches.find(x => x.id === pref) ?? branches[0]
  if (!b) return null
  const tel = `tel:${b.phone.replace(/[^\d+]/g, '')}`
  const wa = waLink(b.whatsapp, t(ui.waMsg))
  const shortName = (x: typeof b) => t(x.area).split('·')[0].trim()
  const locate = async () => { setLocating(true); const n = await findNearest(branches); setLocating(false); if (n) track('nearest_branch', { branch: n.id }) }

  const Picker = ({ dark }: { dark?: boolean }) => branches.length > 1 ? (
    <div className={`flex items-center gap-1 rounded-full p-1 text-xs ${dark ? 'bg-white/10' : 'bg-mist'}`} role="radiogroup" aria-label={ar ? 'اختار الفرع' : 'Choose branch'}>
      {branches.map(x => (
        <button key={x.id} role="radio" aria-checked={x.id === b.id} onClick={() => setPreferredBranch(x.id)}
          className={`min-h-9 rounded-full px-3 font-medium transition ${x.id === b.id ? 'bg-gold text-navy' : dark ? 'text-cloud/85' : 'text-navy/75'}`}>{shortName(x)}</button>
      ))}
      <button onClick={locate} disabled={locating} aria-label={ar ? 'أقرب فرع ليا' : 'Nearest branch to me'} title={ar ? 'أقرب فرع ليا' : 'Nearest branch to me'}
        className={`flex size-9 items-center justify-center rounded-full ${dark ? 'text-cloud/85 hover:bg-white/10' : 'text-navy/75 hover:bg-white'}`}><LocateFixed className={`size-4 ${locating ? 'animate-pulse' : ''}`} /></button>
    </div>
  ) : null

  return (
    <>
      {/* Desktop */}
      <div className="fixed bottom-6 end-6 z-40 hidden flex-col items-end gap-3 md:flex">
        <div className="group flex flex-col items-end gap-3">
          <div className="pointer-events-none translate-y-2 rounded-2xl bg-white p-2 opacity-0 shadow-[0_20px_40px_-20px_rgba(22,62,122,.5)] ring-1 ring-navy/10 transition group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
            <Picker />
          </div>
          <a href={tel} onClick={() => track('contact_call', { branch: b.id, page: pathname })} aria-label={`${ar ? 'اتصل بـ' : 'Call'} ${t(b.name)}`}
            className="flex size-14 items-center justify-center rounded-full bg-navy text-cloud shadow-[0_16px_30px_-12px_rgba(22,62,122,.6)] transition hover:scale-105 hover:bg-blue"><Phone className="size-6" /></a>
          <a href={wa} target="_blank" rel="noreferrer" onClick={() => track('contact_whatsapp', { branch: b.id, page: pathname })} aria-label={`WhatsApp ${t(b.name)}`}
            className="flex size-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_16px_30px_-12px_rgba(37,211,102,.7)] transition hover:scale-105"><MessageCircle className="size-6" /></a>
        </div>
      </div>

      {/* Mobile */}
      <div className="h-[7.5rem] md:hidden" aria-hidden />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy/95 px-3 pb-[max(.6rem,env(safe-area-inset-bottom))] pt-2 text-cloud backdrop-blur md:hidden">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="truncate text-xs text-cloud/75">{ar ? 'الفرع:' : 'Branch:'} {t(b.name)}</span>
          <Picker dark />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <a href={tel} onClick={() => track('contact_call', { branch: b.id, page: pathname })} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white/10 text-sm font-semibold"><Phone className="size-5" />{ar ? 'اتصل' : 'Call'}</a>
          <a href={wa} target="_blank" rel="noreferrer" onClick={() => track('contact_whatsapp', { branch: b.id, page: pathname })} className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#25d366] text-sm font-semibold text-white"><MessageCircle className="size-5" />{ar ? 'واتساب' : 'WhatsApp'}</a>
          <Link to="/book" className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gold text-sm font-semibold text-navy"><CalendarCheck className="size-5" />{ar ? 'احجز' : 'Book'}</Link>
        </div>
      </div>
    </>
  )
}
