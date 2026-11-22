import { useState } from 'react'
import { Play } from 'lucide-react'
import { youtubeId } from '../../lib/content'

/**
 * Plays a YouTube video inside the site (the video stays hosted on YouTube).
 * Shows the YouTube thumbnail first and loads the privacy-enhanced player only on click,
 * so the page stays fast and no YouTube cookies are set until a visitor presses play.
 */
export default function YouTubePlayer({ url, title, className = '', big = false }: { url: string; title: string; className?: string; big?: boolean }) {
  const id = youtubeId(url)
  const [on, setOn] = useState(false)
  if (!id) return null
  return (
    <div className={`relative aspect-video overflow-hidden bg-gradient-to-br from-navy to-night ${className}`}>
      {on ? (
        <iframe className="absolute inset-0 size-full" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
      ) : (
        <button type="button" onClick={() => setOn(true)} className="group absolute inset-0 size-full" aria-label={`Play: ${title}`}>
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" onError={e => { e.currentTarget.style.display = 'none' }} className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105" />
          <span className="absolute inset-0 bg-gradient-to-t from-night/60 via-transparent to-transparent" />
          <span className={`absolute inset-0 m-auto flex items-center justify-center rounded-full bg-gold text-navy shadow-[0_12px_30px_-10px_rgba(0,0,0,.5)] transition duration-500 group-hover:scale-110 ${big ? 'size-20' : 'size-14'}`}>
            <Play className={`fill-current ${big ? 'size-8' : 'size-6'} translate-x-0.5`} />
          </span>
        </button>
      )}
    </div>
  )
}
