import { useEffect } from 'react'
import { ExternalLink, Star } from 'lucide-react'
import Reveal from './Reveal'
import { useI18n } from '../../lib/i18n'
import { useSite } from '../../lib/content'
import { autoSyncReviews } from '../../lib/googleReviews'

/** Rating and a few parents' words, pulled live from the clinic's Google listing. Hidden until the first sync. */
export default function GoogleReviews() {
  const { lang } = useI18n()
  const { google, googleReviews } = useSite()
  useEffect(() => { autoSyncReviews() }, [])
  if (!google.count || !google.rating) return null
  const ar = lang === 'ar'
  const quotes = googleReviews.slice(0, 6)
  return (
    <section className="bg-mist py-24 text-ink sm:py-32">
      <Reveal className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-8">
          <div>
            <p data-reveal className="eyebrow mb-5 text-navy/70">{ar ? 'رأي الأهالي على Google' : 'What parents say on Google'}</p>
            <div data-reveal className="flex flex-wrap items-center gap-5">
              <span dir="ltr" className="font-latin text-[clamp(3.2rem,7vw,5.5rem)] font-light leading-none text-navy">{google.rating.toFixed(1)}</span>
              <div>
                <span className="flex gap-1 text-[#e0a800]" aria-label={`${google.rating.toFixed(1)} / 5`}>{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`size-5 ${i < Math.round(google.rating!) ? 'fill-current' : 'opacity-30'}`} />)}</span>
                <p className="mt-2 text-ink/65">{ar ? `من ${google.count.toLocaleString('en')} تقييم` : `from ${google.count.toLocaleString('en')} reviews`}</p>
              </div>
            </div>
          </div>
          {google.mapsUrl && <a data-reveal href={google.mapsUrl} target="_blank" rel="noreferrer" className="btn-blue">{ar ? 'كل التقييمات على Google' : 'All reviews on Google'} <ExternalLink className="size-4" /></a>}
        </div>
        {quotes.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {quotes.map((r, i) => (
              <figure key={r.id} data-reveal data-delay={(i % 3) * .08} className="flex flex-col rounded-[2rem] bg-white p-7 sm:p-8">
                <span className="flex gap-0.5 text-[#e0a800]" aria-label={`${r.rating} / 5`}>{Array.from({ length: 5 }).map((_, k) => <Star key={k} className={`size-4 ${k < r.rating ? 'fill-current' : 'opacity-30'}`} />)}</span>
                <blockquote dir="auto" className="mt-4 line-clamp-6 flex-1 leading-relaxed text-ink/80">{r.text}</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 text-sm">
                  {r.photo ? <img src={r.photo} alt="" referrerPolicy="no-referrer" className="size-9 rounded-full object-cover" loading="lazy" />
                    : <span className="flex size-9 items-center justify-center rounded-full bg-mist font-semibold text-navy">{r.author.slice(0, 1)}</span>}
                  <span><span className="block font-semibold">{r.author}</span><span className="text-ink/50">{r.when}</span></span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
        <p className="mt-6 text-xs text-ink/45">{ar ? 'التقييمات من Google وبتتحدث تلقائيًا.' : 'Reviews from Google, updated automatically.'}</p>
      </Reveal>
    </section>
  )
}
