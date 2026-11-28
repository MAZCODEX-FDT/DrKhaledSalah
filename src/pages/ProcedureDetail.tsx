import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowDown, ArrowLeft, ArrowRight, Check, ClipboardList, MessageCircle, Play } from 'lucide-react'
import { ArticleCard } from './Articles'
import YouTubePlayer from '../components/site/YouTubePlayer'
import VideoCard from '../components/site/VideoCard'
import { videosForProcedure } from '../lib/videoMatch'
import PageHero from './PageHero'
import Reveal from '../components/site/Reveal'
import ProcedureArt from '../components/site/ProcedureArt'
import Branches from '../components/site/Branches'
import { useI18n } from '../lib/i18n'
import { ui, waLink } from '../content/site'
import { useSite } from '../lib/content'

export default function ProcedureDetail() {
  const { slug } = useParams()
  const { t, lang } = useI18n()
  const { branches, surgeries, img, videos, articles } = useSite()
  const s = surgeries.find(x => x.slug === slug)
  if (!s) return <Navigate to="/procedures" replace />
  const others = surgeries.filter(x => x.slug !== s.slug).slice(0, 6)
  const cover = img(s.image)
  const vids = videosForProcedure(s.slug, videos, s.video || undefined)
  const [main, ...more] = vids
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight
  const reads = articles.filter(a => a.procedure === s.slug)
  const answers = s.faqs.filter(f => f.enabled)

  return (
    <>
      <PageHero eyebrow={`${s.index} · ${t(s.name)}`} title={t(s.hero)}>{t(s.short)}</PageHero>

      <section className="bg-cloud py-24 text-ink sm:py-32">
        <Reveal className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1.3fr_1fr]">
          <div>
            {cover && <img data-reveal src={cover} alt={t(s.name)} className="mb-12 aspect-[16/9] w-full rounded-[2rem] object-cover" />}
            <p data-reveal className="font-display text-[clamp(1.4rem,2.4vw,2.1rem)] font-light leading-[1.6]">{t(s.what)}</p>
            <div data-reveal className="mt-14 grid gap-4 sm:grid-cols-2">
              {s.signs.map((x, i) => (
                <div key={i} className="rounded-2xl border hairline-dark bg-white/60 p-6">
                  <span className="font-serif text-sm font-bold text-blue">{String(i + 1).padStart(2, '0')}</span>
                  <p className="mt-2 text-lg">{t(x)}</p>
                </div>
              ))}
            </div>
            <button type="button" data-reveal onClick={() => document.getElementById('procedure-faq')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue underline-offset-4 hover:underline">
              {lang === 'ar' ? `الإجابات الكاملة في دليل الأهل تحت (${((n: number) => `${n} ${n >= 3 && n <= 10 ? 'أسئلة' : 'سؤال'}`)(answers.length)})` : `Full answers are in the parents' guide below (${answers.length} questions)`}
              <ArrowDown className="size-4" />
            </button>
          </div>
          <div role="group" aria-label={lang === 'ar' ? 'احجز' : 'Book'} data-reveal className="relative h-fit overflow-hidden rounded-[2rem] bg-navy p-8 text-cloud sm:p-10 lg:sticky lg:top-28">
            <ProcedureArt slug={s.slug} tone={s.tone} className="absolute -end-24 -top-24 size-80 opacity-60" />
            <h2 className="relative font-display text-2xl font-light">{lang === 'ar' ? 'اللي هتلاقيه معانا' : 'What you can expect'}</h2>
            <ul className="relative mt-6 space-y-4">
              {s.approach.map((a, i) => (
                <li key={i} className="flex gap-3 text-cloud/80"><Check className="mt-1 size-4 shrink-0 text-gold" />{t(a)}</li>
              ))}
            </ul>
            <div className="relative mt-10 space-y-3">
              {branches.map(b => (
                <a key={b.id} href={waLink(b.whatsapp, `${t(ui.waMsg)} · ${t(s.name)}`)} target="_blank" rel="noreferrer"
                  className={`${b.primary ? 'btn-gold' : 'btn-ghost'} w-full justify-center`}>
                  <MessageCircle className="size-4" /> {b.primary ? t(ui.bookTagamoa) : t(ui.bookGiza)}
                </a>
              ))}
              <Link to="/before-your-visit" className="flex min-h-11 items-center justify-center gap-2 text-sm text-cloud/70 underline-offset-4 hover:text-gold hover:underline">
                <ClipboardList className="size-4" />{lang === 'ar' ? 'اقرا دليل قبل الزيارة' : 'Read the before-your-visit guide'}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Parents' guide: every question with its answer right under it */}
      {answers.length > 0 && (
        <section id="procedure-faq" className="scroll-mt-24 bg-white py-20 text-ink sm:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <p className="eyebrow mb-4 text-blue">{lang === 'ar' ? 'دليل الأهل' : "Parents' guide"}</p>
            <h2 className="max-w-3xl font-display text-[clamp(1.9rem,4vw,3.2rem)] leading-tight">{lang === 'ar' ? `كل اللي محتاج تعرفه عن ${t(s.name)}` : `Everything you need to know about ${t(s.name)}`}</h2>
            <p className="mt-4 max-w-2xl text-lg text-ink/60">{lang === 'ar' ? 'من أول ما تلاحظ العلامات، لحد الرجوع للبيت والمتابعة.' : 'From the first signs you notice to coming home and follow-up.'}</p>
            <div className="mt-12 grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-16">
              <nav aria-label={lang === 'ar' ? 'محتوى الدليل' : 'Guide contents'} className="hidden h-fit lg:sticky lg:top-28 lg:block">
                <p className="mb-4 text-sm font-semibold text-ink/50">{lang === 'ar' ? 'في الصفحة دي' : 'On this page'}</p>
                <ol className="space-y-1 border-s-2 border-sky">
                  {answers.map((f, i) => (
                    <li key={f.id}>
                      <button type="button" onClick={() => document.getElementById(`q-${i + 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                        className="-ms-0.5 block w-full border-s-2 border-transparent py-2 ps-4 text-start text-sm leading-snug text-ink/65 transition-colors hover:border-blue hover:text-blue">
                        {t(f.q)}
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>
              <div className="space-y-5">
                {answers.map((f, i) => (
                  <article key={f.id} id={`q-${i + 1}`} className="scroll-mt-28 rounded-[1.75rem] border hairline-dark bg-cloud/60 p-6 sm:p-9">
                    <div className="flex items-start gap-4 sm:gap-5">
                      <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue font-latin text-sm font-bold text-white sm:size-12 sm:text-base">{String(i + 1).padStart(2, '0')}</span>
                      <div className="min-w-0">
                        <h3 className="font-display text-xl leading-snug text-navy sm:text-2xl">{t(f.q)}</h3>
                        <p className="mt-3 text-[1.05rem] leading-[1.9] text-ink/75">{t(f.a)}</p>
                      </div>
                    </div>
                  </article>
                ))}
                <p className="pt-2 text-sm text-ink/50">{lang === 'ar' ? 'المعلومات دي للتوعية، والخطة المناسبة لكل طفل بتتحدد في الكشف.' : 'This information is for awareness; the right plan for each child is decided at the consultation.'}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="bg-night py-24 sm:py-32">
        <Reveal className="mx-auto max-w-7xl px-6">
          <p data-reveal className="eyebrow mb-5 text-mist">{lang === 'ar' ? 'الخطوات' : 'The steps'}</p>
          <div className="grid gap-px overflow-hidden rounded-[2rem] border hairline bg-cloud/10 md:grid-cols-4">
            {s.steps.map((st, i) => (
              <div key={i} data-reveal data-delay={i * .08} className="bg-night p-8">
                <span aria-hidden="true" className="font-latin text-5xl font-extralight text-cloud/30">0{i + 1}</span>
                <h3 className="mt-6 font-display text-2xl font-light text-mist">{t(st.t)}</h3>
                <p className="mt-3 text-cloud/65">{t(st.d)}</p>
              </div>
            ))}
          </div>

          {/* Videos: the one pinned in Dashboard → Procedures first, then channel videos whose title matches this procedure */}
          {main ? (
            <div className="mt-16">
              <div data-reveal className="overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-40px_rgba(22,62,122,.6)]">
                <YouTubePlayer url={main.url} title={t(main.title) || t(s.name)} big />
              </div>
              {t(main.title) && <p data-reveal className="mt-4 font-display text-lg">{t(main.title)}</p>}
            </div>
          ) : (
          <div data-reveal className="calm-night brand-pattern relative mt-16 flex aspect-video items-center justify-center overflow-hidden rounded-[2rem]">
            <div className="relative text-center">
              <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-cloud/10 backdrop-blur"><Play className="size-7 fill-cloud" /></span>
              <p className="mt-5 font-display text-xl font-light">{lang === 'ar' ? `الدكتور بيشرح: ${t(s.name)}` : `The doctor explains: ${t(s.name)}`}</p>
            </div>
          </div>
          )}
        </Reveal>
      </section>

      {more.length > 0 && (
        <section className="bg-cloud pb-24 text-ink">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight">{lang === 'ar' ? `فيديوهات تانية عن ${t(s.name)}` : `More videos on ${t(s.name)}`}</h2>
              <Link to={`/videos?q=${encodeURIComponent(t(s.name))}&p=${s.slug}`} className="btn-blue">{lang === 'ar' ? `كل الفيديوهات (${vids.length})` : `All videos (${vids.length})`} <Arrow className="size-4" /></Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{more.slice(0, 6).map(v => <VideoCard key={v.id} v={v} />)}</div>
          </div>
        </section>
      )}

      {reads.length > 0 && (
        <section className={`bg-cloud pb-24 text-ink ${more.length ? '' : 'pt-24'}`}>
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-8 font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight">{lang === 'ar' ? `اقرا عن ${t(s.name)}` : `Read about ${t(s.name)}`}</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{reads.slice(0, 3).map(a => <div key={a.id} className="flex"><ArticleCard a={a} /></div>)}</div>
          </div>
        </section>
      )}

      <section className="bg-night pb-28 pt-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="eyebrow mb-6 text-mist">{lang === 'ar' ? 'عمليات تانية' : 'Other procedures'}</p>
          <div className="grid gap-4 md:grid-cols-3">
            {others.map(o => (
              <Link key={o.slug} to={`/procedures/${o.slug}`} className="group relative overflow-hidden rounded-[1.5rem] border hairline bg-navy-2 p-7 transition-colors duration-700 hover:bg-navy">
                <ProcedureArt slug={o.slug} tone={o.tone} className="absolute -bottom-20 -end-20 size-56 opacity-40 transition-opacity group-hover:opacity-80" />
                <span className="font-serif text-sm font-bold text-mist">{o.index}</span>
                <h3 className="relative mt-8 font-display text-2xl font-light">{t(o.name)}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Branches />
    </>
  )
}
