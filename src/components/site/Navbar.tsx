import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, Globe, CalendarHeart } from 'lucide-react'
import Logo from './Logo'
import { useI18n } from '../../lib/i18n'
import { ui } from '../../content/site'
import { getLenis } from '../../lib/smooth'

const links = [
  { to: '/', k: 'home' },
  { to: '/about', k: 'about' },
  { to: '/procedures', k: 'surgeries' },
  { to: '/branches', k: 'branches' },
  { to: '/videos', k: 'videos' },
  { to: '/faq', k: 'faq' },
  { to: '/before-your-visit', k: 'guide' },
  { to: '/articles', k: 'articles' },
  { to: '/contact', k: 'contact' },
] as const

// Shorter labels so nine links fit the desktop bar (the menu sheet and footer keep the full names)
const short: Partial<Record<(typeof links)[number]['k'], { ar: string; en: string }>> = {
  faq: { ar: 'الأسئلة', en: 'FAQ' },
  articles: { ar: 'المدونة', en: 'Blog' },
  contact: { ar: 'تواصل', en: 'Contact' },
}

export default function Navbar() {
  const { t, toggle, lang } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    const l = getLenis()
    if (open) l?.stop(); else l?.start()
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-700 ease-lux sm:px-6 ${
          scrolled ? 'bg-navy/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_-30px_rgba(0,0,0,.7)]' : 'bg-transparent'
        }`}
      >
        <Logo className={`transition-all duration-700 ease-lux ${scrolled ? 'h-12' : 'h-[4.75rem]'}`} />
        <ul className="hidden items-center xl:flex">
          {links.filter(l => l.k !== 'home').map(l => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `relative whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors ${isActive ? 'text-mist' : 'text-cloud/75 hover:text-cloud'}`
                }
              >
                {t(short[l.k] ?? ui.nav[l.k])}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="flex min-h-11 items-center gap-1.5 rounded-full px-3 py-2 text-sm text-cloud/80 hover:text-cloud" aria-label="Change language">
            <Globe className="size-4" />
            <span className="font-latin">{lang === 'ar' ? 'EN' : 'ع'}</span>
          </button>
          <Link to="/book" className="btn-gold hidden !px-5 !py-2.5 text-sm md:inline-flex">
            <CalendarHeart className="size-4" /> {t(ui.nav.book)}
          </Link>
          <button className="flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 xl:hidden" onClick={() => setOpen(true)} aria-label="Menu">
            <Menu className="size-6" />
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div data-lenis-prevent className={`fixed inset-0 z-50 bg-night/95 backdrop-blur-xl transition-all duration-700 ease-lux xl:hidden overflow-y-auto ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
        <div className="flex items-center justify-between px-6 pt-6">
          <Logo className="h-12" />
          <button onClick={() => setOpen(false)} className="rounded-full p-2" aria-label="Close"><X className="size-6" /></button>
        </div>
        <ul className="mt-8 space-y-1 px-8">
          {links.map((l, i) => (
            <li key={l.to} style={{ transitionDelay: open ? `${120 + i * 60}ms` : '0ms' }} className={`transition-all duration-700 ease-lux ${open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
              <NavLink to={l.to} end={l.to === '/'} onClick={() => setOpen(false)} className="block border-b hairline py-3 font-display text-2xl font-light sm:text-3xl">
                {t(l.k === 'articles' ? short.articles! : ui.nav[l.k])}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="px-8 pb-10 pt-8">
          <Link to="/book" onClick={() => setOpen(false)} className="btn-gold w-full justify-center">{t(ui.nav.book)}</Link>
        </div>
      </div>
    </header>
  )
}
