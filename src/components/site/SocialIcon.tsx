import type { SocialPlatform } from '../../lib/content'

/** Simple line glyphs for social platforms (Lucide has no brand icons). */
export default function SocialIcon({ platform, className = 'size-4' }: { platform: SocialPlatform; className?: string }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {platform === 'facebook' && <path {...p} d="M15 3.5h-2.2A3.3 3.3 0 0 0 9.5 6.8V10H7v3.2h2.5V21h3.2v-7.8h2.6l.6-3.2h-3.2V7.4c0-.6.4-.9.9-.9H15z" />}
      {platform === 'instagram' && <g {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r=".6" fill="currentColor" /></g>}
      {platform === 'youtube' && <g {...p}><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" /></g>}
      {platform === 'tiktok' && <path {...p} d="M14 3.5v11.2a3.8 3.8 0 1 1-3.8-3.8M14 3.5c.4 2.6 2.2 4.3 4.8 4.5" />}
      {platform === 'whatsapp' && <g {...p}><path d="M4 20l1.2-3.6A8 8 0 1 1 8 19z" /><path d="M9.2 8.8c0 3 2.9 6 6 6l.9-1.6-2-1-1 .8a4.6 4.6 0 0 1-2.1-2.1l.8-1-1-2z" /></g>}
      {platform === 'google' && <path {...p} d="M20 12.2c0-.6 0-1.1-.1-1.6H12v3.1h4.5a4.6 4.6 0 0 1-4.5 3.5 5.2 5.2 0 1 1 3.4-9.1l2.2-2.2A8.3 8.3 0 1 0 20 12.2z" />}
      {platform === 'x' && <path {...p} d="M4 4l16 16M20 4L4 20" />}
      {platform === 'linkedin' && <g {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M8 10.5V16M8 8v.01M11.5 16v-5.5M11.5 13a2.5 2.5 0 0 1 5 0v3" /></g>}
      {platform === 'other' && <g {...p}><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17" /></g>}
    </svg>
  )
}
