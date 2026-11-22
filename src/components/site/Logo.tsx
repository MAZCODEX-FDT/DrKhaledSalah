import { Link } from 'react-router-dom'
import { useI18n } from '../../lib/i18n'
import { doctor } from '../../content/site'

export function Mark({ className = 'size-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id="ks-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3e3bd" />
          <stop offset=".55" stopColor="#c9a96a" />
          <stop offset="1" stopColor="#a8864a" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="none" stroke="url(#ks-g)" strokeWidth="1.2" />
      <path d="M22 17v30M22 32l15-15M26 29.5l13 17.5" stroke="url(#ks-g)" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="44" cy="20" r="2.4" fill="url(#ks-g)" />
    </svg>
  )
}

export default function Logo({ to = '/' }: { to?: string }) {
  const { t, lang } = useI18n()
  return (
    <Link to={to} className="flex items-center gap-3 group">
      <Mark className="size-10 transition-transform duration-700 group-hover:rotate-[20deg]" />
      <span className="leading-tight">
        <span className="block whitespace-nowrap font-display text-[1.05rem] font-medium">{t(doctor.name)}</span>
        <span className={`block text-[.68rem] text-mist ${lang === 'en' ? 'tracking-[.18em] uppercase' : ''}`}>
          {lang === 'ar' ? 'جراحة الأطفال وحديثي الولادة' : 'Pediatric Surgery'}
        </span>
      </span>
    </Link>
  )
}
