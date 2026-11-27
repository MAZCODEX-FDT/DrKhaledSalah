import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ClipboardList, MessageCircle } from 'lucide-react'
import PageHero from './PageHero'
import Reveal from '../components/site/Reveal'
import ProcedureArt from '../components/site/ProcedureArt'
import { useI18n } from '../lib/i18n'
import { ui } from '../content/site'
import { useSite, type Article } from '../lib/content'

/** Renders the article body: "## " lines become headings, blank lines split paragraphs. */
export function ArticleBody({ text }: { text: string }) {
  const blocks = text.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean)
  return (
    <div className="space-y-6 text-lg leading-[1.9] text-ink/80">
      {blocks.flatMap((b, i) => b.split('\n').map((line, j) => line.startsWith('## ')
        ? <h2 key={`${i}-${j}`} className="!mt-12 font-display text-2xl text-navy sm:text-3xl">{line.slice(3)}</h2>
        : <p key={`${i}-${j}`}>{line}</p>))}
    </div>
  )
}

const fmtDate = (d: string, lang: string) => { try { return new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) } catch { return d } }

export function ArticleCard({ a }: { a: Article }) {
  const { t, lang } = useI18n()
  const { img, surgeries } = useSite()
  const s = surgeries.find(x => x.slug === a.procedure)
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight
  return (
    <Link to={`/articles/${a.slug}`} className="group flex flex-col overflow-hidden rounded-[2rem] border hairline-dark bg-white transition-transform duration-500 hover:-translate-y-1">
      <div className="relative aspect-[16/9] overflow-hidden bg-mist">
        {img(a.image) ? <img src={img(a.image)!} alt="" className="size-full object-cover" loading="lazy" />
          : <ProcedureArt slug={a.procedure || 'neonatal-surgery'} tone={s?.tone ?? '#2f6fd1'} className="absolute -end-10 -top-10 size-64 opacity-70" />}
      </div>
      <div className="flex flex-1 flex-col p-7">
        <div className="flex flex-wrap gap-2 text-xs text-ink/50">
          <span>{fmtDate(a.date, lang)}</span>{s && <span className="rounded-full bg-mist px-2.5 py-0.5 text-navy">{t(s.name)}</span>}
        </div>
        <h3 className="mt-3 font-display text-2xl leading-snug">{t(a.title)}</h3>
        <p className="mt-3 line-clamp-3 text-ink/65">{t(a.excerpt)}</p>
        <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-blue">{lang === 'ar' ? 'اقرأ المقال' : 'Read the article'} <Arrow className="size-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" /></span>
      </div>
    </Link>
  )
}

export function ArticlesPage() {
  const { t, lang } = useI18n()
  const { articles } = useSite()
  return (
    <>
      <PageHero eyebrow={t(ui.nav.articles)} title={lang === 'ar' ? 'إجابات واضحة على أسئلة الأهالي' : 'Calm answers to parents\' questions'}>
        {lang === 'ar' ? 'مقالات قصيرة بتشرح الحاجات اللي بتتسأل كتير في الكشف. مش بديل عن الكشف، لكنها بتساعدك تيجي وانت فاهم.' : 'Short articles on the questions we hear most at the consultation. Not a substitute for a visit, but they help you arrive informed.'}
      </PageHero>
      <section className="bg-cloud py-24 text-ink sm:py-32">
        <Reveal className="mx-auto max-w-7xl px-6">
          {articles.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{articles.map((a, i) => <div key={a.id} data-reveal data-delay={(i % 3) * .08} className="flex"><ArticleCard a={a} /></div>)}</div>
          ) : <p data-reveal className="text-ink/60">{lang === 'ar' ? 'المقالات جاية قريب.' : 'Articles are coming soon.'}</p>}
        </Reveal>
      </section>
    </>
  )
}

export function ArticlePage() {
  const { slug } = useParams()
  const { t, lang } = useI18n()
  const { articles, img, surgeries } = useSite()
  const a = articles.find(x => x.slug === slug)
  if (!a) return <Navigate to="/articles" replace />
  const s = surgeries.find(x => x.slug === a.procedure)
  const more = articles.filter(x => x.id !== a.id).slice(0, 3)
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight
  return (
    <>
      <PageHero eyebrow={`${t(ui.nav.articles)} · ${fmtDate(a.date, lang)}`} title={t(a.title)}>{t(a.excerpt)}</PageHero>
      <article className="bg-cloud py-20 text-ink sm:py-28">
        <div className="mx-auto max-w-3xl px-6">
          {img(a.image) && <img src={img(a.image)!} alt="" className="mb-12 aspect-[16/9] w-full rounded-[2rem] object-cover" />}
          <ArticleBody text={t(a.body)} />
          <div className="mt-16 rounded-[2rem] bg-mist p-8">
            <p className="font-display text-xl">{lang === 'ar' ? 'كل حالة ليها تفاصيلها، والدكتور بيشرحلك حالة طفلك بالظبط في الكشف.' : 'Every case has its own details; the doctor explains your child\'s situation at the consultation.'}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/book" className="btn-blue"><MessageCircle className="size-4" />{t(ui.nav.book)}</Link>
              {s && <Link to={`/procedures/${s.slug}`} className="btn-ghost !border-ink/15 hover:!bg-night/5">{t(s.name)} <Arrow className="size-4" /></Link>}
              <Link to="/before-your-visit" className="btn-ghost !border-ink/15 hover:!bg-night/5"><ClipboardList className="size-4" />{t(ui.nav.guide)}</Link>
            </div>
          </div>
        </div>
      </article>
      {more.length > 0 && (
        <section className="bg-sand pb-24 pt-16 text-ink">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-8 font-display text-3xl">{lang === 'ar' ? 'مقالات تانية' : 'More articles'}</h2>
            <div className="grid gap-5 md:grid-cols-3">{more.map(x => <div key={x.id} className="flex"><ArticleCard a={x} /></div>)}</div>
          </div>
        </section>
      )}
    </>
  )
}
