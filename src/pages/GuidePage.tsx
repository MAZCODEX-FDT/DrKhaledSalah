import { Link } from 'react-router-dom'
import { Check, Download, MessageCircle, Phone, Printer } from 'lucide-react'
import PageHero from './PageHero'
import Reveal from '../components/site/Reveal'
import { FullLogo } from '../components/site/Logo'
import { useI18n } from '../lib/i18n'
import { ui } from '../content/site'
import { useSite } from '../lib/content'
import { track } from '../lib/track'

const lines = (s: string) => s.split('\n').map(x => x.trim()).filter(Boolean)

/** "Before your visit" guide, with a one-page sheet parents can print or save as PDF. */
export default function GuidePage() {
  const { t, lang } = useI18n()
  const { guide, branches, doctor } = useSite()
  const ar = lang === 'ar'
  const print = () => { track('guide_download'); window.print() }
  const last = guide.length - 1

  return (
    <>
      <PageHero eyebrow={t(ui.nav.guide)} title={ar ? 'كل اللي محتاج تعرفه قبل الزيارة' : 'Everything to know before your visit'}>
        {ar ? 'بنشرح قبل ما نبدأ. دي الخطوات اللي بتطمّنك من أول الكشف لحد ما ترجع البيت، وتقدر تحفظها PDF أو تطبعها.' : 'We explain before we begin. These are the steps from the first consultation until you are back home. Save them as a PDF or print them.'}
      </PageHero>

      <section className="bg-cloud py-24 text-ink sm:py-32">
        <Reveal className="mx-auto max-w-7xl px-6">
          <div data-reveal className="mb-12 flex flex-wrap items-center justify-between gap-4 rounded-[2rem] bg-mist p-6 sm:p-8">
            <p className="max-w-xl text-lg">{ar ? 'خد الورقة دي معاك: فيها كل النقط في صفحة واحدة، وأرقام الفرعين.' : 'Take this sheet with you: every point on one page, plus both branch numbers.'}</p>
            <div className="flex flex-wrap gap-3">
              <button onClick={print} className="btn-blue"><Download className="size-4" />{ar ? 'حمّل الورقة PDF' : 'Download the sheet (PDF)'}</button>
              <button onClick={print} className="btn-ghost !border-ink/15 hover:!bg-night/5"><Printer className="size-4" />{ar ? 'اطبع' : 'Print'}</button>
            </div>
          </div>

          <ol className="grid gap-5 md:grid-cols-2">
            {guide.map((g, i) => (
              <li key={g.id} data-reveal data-delay={(i % 2) * .08}
                className={`rounded-[2rem] p-8 sm:p-10 ${i === last ? 'calm-night brand-pattern text-cloud md:col-span-2' : 'border hairline-dark bg-white'}`}>
                <span className={`font-serif text-sm font-bold ${i === last ? 'text-gold' : 'text-blue'}`}>{String(i + 1).padStart(2, '0')}</span>
                <h2 className="mt-3 font-display text-2xl sm:text-3xl">{t(g.title)}</h2>
                <ul className={`mt-6 space-y-3 ${i === last ? 'sm:columns-2 sm:gap-10' : ''}`}>
                  {lines(t(g.items)).map((x, j) => (
                    <li key={j} className={`flex gap-3 break-inside-avoid ${i === last ? 'text-cloud/85' : 'text-ink/75'}`}>
                      <Check className={`mt-1 size-4 shrink-0 ${i === last ? 'text-gold' : 'text-blue'}`} />{x}
                    </li>
                  ))}
                </ul>
                {i === last && (
                  <div className="mt-8 flex flex-wrap gap-3">
                    {branches.map(b => (
                      <a key={b.id} href={`tel:${b.phone.replace(/\s/g, '')}`} className={b.primary ? 'btn-gold' : 'btn-ghost'}><Phone className="size-4" />{t(b.name)}</a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>

          <div data-reveal className="mt-14 flex flex-wrap items-center gap-4">
            <Link to="/book" className="btn-blue"><MessageCircle className="size-4" />{t(ui.nav.book)}</Link>
            <Link to="/faq" className="btn-ghost !border-ink/15 hover:!bg-night/5">{t(ui.nav.faq)}</Link>
            <Link to="/articles" className="btn-ghost !border-ink/15 hover:!bg-night/5">{t(ui.nav.articles)}</Link>
          </div>
          <p className="mt-6 text-sm text-ink/50">{ar ? 'الإرشادات دي عامة. التعليمات اللي الدكتور بيكتبهالك في الكشف هي اللي تمشي عليها.' : 'This guidance is general. Follow the instructions the doctor writes for you at the consultation.'}</p>
        </Reveal>
      </section>

      {/* One-page sheet: hidden on screen, the only thing printed (see .print-sheet in index.css) */}
      <div className="print-sheet" dir={ar ? 'rtl' : 'ltr'} aria-hidden="true">
        <header className="ps-head">
          <FullLogo className="h-12" tone="navy" />
          <div>
            <strong>{t(doctor.name)}</strong>
            <span>{t(doctor.title)}</span>
          </div>
        </header>
        <h1>{ar ? 'قبل زيارتك' : 'Before your visit'}</h1>
        <div className="ps-grid">
          {guide.map((g, i) => (
            <section key={g.id} className={i === last ? 'ps-alert' : ''}>
              <h2>{String(i + 1).padStart(2, '0')} · {t(g.title)}</h2>
              <ul>{lines(t(g.items)).map((x, j) => <li key={j}>{x}</li>)}</ul>
            </section>
          ))}
        </div>
        <footer className="ps-foot">
          {branches.map(b => (
            <div key={b.id}><strong>{t(b.name)}</strong><span dir="ltr">{b.phone}</span><span>{ar ? 'واتساب' : 'WhatsApp'}: <span dir="ltr">{b.whatsapp}</span></span></div>
          ))}
        </footer>
        <p className="ps-note">{ar ? 'إرشادات عامة. التعليمات المكتوبة في ورقة الكشف هي اللي تمشي عليها.' : 'General guidance. Follow the instructions written on your consultation sheet.'}</p>
      </div>
    </>
  )
}
