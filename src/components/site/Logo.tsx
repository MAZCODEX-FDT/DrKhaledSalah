import { Link } from 'react-router-dom'
import { useI18n } from '../../lib/i18n'

/** Official KS Kids Surgeon files from the brand book. Never redraw, recolour or re-space them. */
export const brandAsset = (name: string) => `${import.meta.env.BASE_URL}brand/${name}`

type Tone = 'white' | 'navy' | 'blue'

export function Mark({ className = 'size-9', tone = 'white' }: { className?: string; tone?: Tone }) {
  return <img src={brandAsset(`mark-${tone}.webp`)} alt="" aria-hidden className={`object-contain ${className}`} draggable={false} />
}

export function FullLogo({ className = 'h-14', tone = 'white' }: { className?: string; tone?: 'white' | 'navy' }) {
  const { lang } = useI18n()
  return (
    <img src={brandAsset(`logo-${tone}.webp`)} className={`w-auto object-contain ${className}`} draggable={false}
      alt={lang === 'ar' ? 'د. خالد صلاح، جراح أطفال' : 'Dr. Khaled Salah, Kids Surgeon'} />
  )
}

export default function Logo({ to = '/', className = 'h-14', tone = 'white' }: { to?: string; className?: string; tone?: 'white' | 'navy' }) {
  return (
    <Link to={to} className="block shrink-0" aria-label="Home">
      <FullLogo className={className} tone={tone} />
    </Link>
  )
}
