import { useI18n } from '../../lib/i18n'
import type { Video } from '../../lib/content'
import YouTubePlayer from './YouTubePlayer'

/** One YouTube video: plays in place, title and view count underneath. */
export default function VideoCard({ v, className = '' }: { v: Video; className?: string }) {
  const { t, lang } = useI18n()
  return (
    <article className={`flex flex-col overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-navy/5 shadow-[0_20px_40px_-30px_rgba(22,62,122,.35)] ${className}`}>
      <YouTubePlayer url={v.url} title={t(v.title)} />
      <div className="flex flex-1 items-start justify-between gap-4 p-5">
        <h3 className="line-clamp-3 font-display text-lg leading-snug">{t(v.title)}</h3>
        {v.views && <span className="shrink-0 rounded-full bg-mist px-3 py-1 text-xs font-medium text-blue">{v.views} {lang === 'ar' ? 'مشاهدة' : 'views'}</span>}
      </div>
    </article>
  )
}
