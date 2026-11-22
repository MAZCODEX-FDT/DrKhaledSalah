import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import PageHero from './PageHero'
import Faq from '../components/site/Faq'
import { useI18n, type L } from '../lib/i18n'
import { useSite, type QA } from '../lib/content'

type Group = { id: string; name: L; items: QA[]; kind: 'general' | 'procedure' }

/** Parents' questions, grouped by category so each topic is one tap away. Categories are managed in Dashboard → Website content → FAQs. */
export default function FaqPage() {
  const { t, lang } = useI18n()
  const { faqs, faqCategories, surgeries } = useSite()
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState('')

  const groups = useMemo<Group[]>(() => {
    const out: Group[] = faqCategories
      .map(c => ({ id: c.id, name: c.name, kind: 'general' as const, items: faqs.filter(f => f.category === c.id) }))
    const known = new Set(faqCategories.map(c => c.id))
    const other = faqs.filter(f => !f.category || !known.has(f.category))
    if (other.length) out.push({ id: 'general', name: { ar: 'أسئلة عامة', en: 'General' }, kind: 'general', items: other })
    for (const s of surgeries) {
      const items = s.faqs.filter(f => f.enabled)
      if (items.length) out.push({ id: s.slug, name: s.name, kind: 'procedure', items })
    }
    return out.filter(g => g.items.length)
  }, [faqs, faqCategories, surgeries])

  const activeId = params.get('c') ?? groups[0]?.id
  const active = groups.find(g => g.id === activeId) ?? groups[0]
  const pick = (id: string) => { setQ(''); setParams({ c: id }, { replace: true }); window.scrollTo({ top: Math.min(window.scrollY, document.getElementById('faq-top')!.offsetTop - 90) }) }

  const needle = q.trim().toLowerCase()
  const results = needle
    ? groups.flatMap(g => g.items.filter(f => `${f.q.ar} ${f.q.en} ${f.a.ar} ${f.a.en}`.toLowerCase().includes(needle)).map(f => ({ g, f })))
    : []

  const general = groups.filter(g => g.kind === 'general')
  const procs = groups.filter(g => g.kind === 'procedure')
  const Chip = ({ g }: { g: Group }) => {
    const on = !needle && g.id === active?.id
    return (
      <button onClick={() => pick(g.id)} aria-current={on}
        className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-start text-sm transition ${on ? 'bg-navy text-cloud' : 'text-ink/75 hover:bg-mist'}`}>
        <span>{t(g.name)}</span>
        <span className={`rounded-full px-2 py-0.5 text-xs ${on ? 'bg-gold text-navy' : 'bg-mist text-blue'}`}>{g.items.length}</span>
      </button>
    )
  }

  return (
    <>
      <PageHero eyebrow={lang === 'ar' ? 'أسئلة الأهالي' : 'Parents\' questions'} title={lang === 'ar' ? 'اسأل قبل ما تقرر' : 'Ask before you decide'}>
        {lang === 'ar' ? 'اختار الموضوع اللي يهمك، أو دوّر على سؤالك.' : 'Pick the topic you care about, or search for your question.'}
      </PageHero>

      <section id="faq-top" className="bg-cloud pb-28 pt-12 text-ink">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative mb-8 max-w-2xl">
            <Search className="pointer-events-none absolute start-5 top-1/2 size-5 -translate-y-1/2 text-ink/40" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder={lang === 'ar' ? 'دوّر على سؤال… مثلًا: بنج، ميعاد، طهارة' : 'Search a question… e.g. anesthesia, booking'}
              className="w-full rounded-full border border-ink/10 bg-white py-4 pe-12 ps-14 outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/15" />
            {q && <button onClick={() => setQ('')} className="absolute end-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink/50 hover:bg-mist" aria-label="Clear"><X className="size-4" /></button>}
          </div>

          {/* Mobile: sticky row of topic chips */}
          <div className="sticky top-20 z-20 -mx-6 mb-8 overflow-x-auto bg-cloud/95 px-6 py-3 backdrop-blur lg:hidden">
            <div className="flex w-max gap-2">
              {groups.map(g => {
                const on = !needle && g.id === active?.id
                return <button key={g.id} onClick={() => pick(g.id)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${on ? 'bg-navy text-cloud' : 'bg-white text-ink/75 ring-1 ring-ink/10'}`}>{t(g.name)}</button>
              })}
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-[18rem_1fr]">
            {/* Desktop: sticky topic list */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 max-h-[calc(100vh-8rem)] space-y-6 overflow-y-auto pe-2" data-lenis-prevent>
                <div>
                  <p className="mb-2 px-4 text-xs font-semibold text-blue">{lang === 'ar' ? 'عن الحجز والزيارة' : 'Booking & visits'}</p>
                  <div className="space-y-1">{general.map(g => <Chip key={g.id} g={g} />)}</div>
                </div>
                {procs.length > 0 && (
                  <div>
                    <p className="mb-2 px-4 text-xs font-semibold text-blue">{lang === 'ar' ? 'عن العمليات' : 'About procedures'}</p>
                    <div className="space-y-1">{procs.map(g => <Chip key={g.id} g={g} />)}</div>
                  </div>
                )}
              </div>
            </aside>

            <div className="min-w-0">
              {needle ? (
                <>
                  <h2 className="mb-6 font-display text-3xl">{lang === 'ar' ? `نتايج البحث (${results.length})` : `Search results (${results.length})`}</h2>
                  {results.length === 0
                    ? <p className="text-ink/60">{lang === 'ar' ? 'مفيش سؤال بالكلام ده. جرّب كلمة تانية، أو ابعتلنا سؤالك على واتساب.' : 'No question matches. Try another word, or send us your question on WhatsApp.'}</p>
                    : <div className="space-y-10">
                        {[...new Set(results.map(r => r.g))].map(g => (
                          <div key={g.id}>
                            <p className="mb-2 text-sm font-semibold text-blue">{t(g.name)}</p>
                            <Faq items={results.filter(r => r.g === g).map(r => r.f)} light />
                          </div>
                        ))}
                      </div>}
                </>
              ) : active && (
                <>
                  <p className="mb-2 text-sm font-semibold text-blue">{active.kind === 'procedure' ? (lang === 'ar' ? 'عن العمليات' : 'About procedures') : (lang === 'ar' ? 'عن الحجز والزيارة' : 'Booking & visits')}</p>
                  <h2 className="mb-6 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">{t(active.name)}</h2>
                  <Faq key={active.id} items={active.items} light />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
