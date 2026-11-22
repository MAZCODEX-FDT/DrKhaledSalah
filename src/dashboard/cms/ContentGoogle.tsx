import { useState } from 'react'
import { RefreshCw, Search, Star } from 'lucide-react'
import { useI18n } from '../../lib/i18n'
import { cms, useContent } from '../../lib/content'
import { findPlaces, syncReviews, type PlaceHit } from '../../lib/googleReviews'
import { Btn, Card, Field, PageTitle } from '../ui'
import { tr } from '../labels'
import { DemoNote, Toggle } from './kit'

export default function ContentGoogle() {
  const { t, lang } = useI18n()
  const g = useContent(d => d.google)
  const ytKey = useContent(d => d.youtube.apiKey)
  const [q, setQ] = useState(lang === 'ar' ? 'د. خالد صلاح جراحة أطفال' : 'Dr Khaled Salah pediatric surgery')
  const [hits, setHits] = useState<PlaceHit[] | null>(null)
  const [busy, setBusy] = useState<'' | 'find' | 'sync'>('')
  const [err, setErr] = useState('')
  const run = async (kind: 'find' | 'sync', f: () => Promise<void>) => { setBusy(kind); setErr(''); try { await f() } catch (e) { setErr((e as Error).message) } finally { setBusy('') } }
  const noKey = !g.apiKey && !ytKey
  return (
    <>
      <PageTitle title={t(tr('تقييمات جوجل', 'Google reviews'))}
        sub={t(tr('التقييم وعدد التقييمات وكلام الأهالي بيتسحبوا من صفحة العيادة على جوجل وبيتحدثوا تلقائيًا مرة في الأسبوع. مفيش أرقام مكتوبة بإيد.', 'The rating, review count and parents\' words are pulled from the clinic\'s Google listing and refresh automatically once a week. No numbers are typed by hand.'))} />
      <DemoNote />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title={t(tr('الربط', 'Connection'))}>
          <div className="space-y-4">
            <Field label={t(tr('مفتاح Google (اختياري لو نفس مفتاح يوتيوب)', 'Google key (optional if it is the same as the YouTube key)'))}>
              <input type="password" dir="ltr" autoComplete="off" value={g.apiKey} onChange={e => cms.setGoogle({ apiKey: e.target.value.trim() })} placeholder={ytKey ? t(tr('بيستخدم مفتاح يوتيوب', 'Using the YouTube key')) : 'AIza…'} />
            </Field>
            <p className="text-xs text-[#5e6a7a]">{t(tr('لازم "Places API (New)" يكون مفعّل على نفس المشروع في Google Cloud، والفوترة شغالة (جوجل بيدي حد مجاني شهري).', '"Places API (New)" must be enabled on the same Google Cloud project, with billing on (Google includes a free monthly allowance).'))}</p>
            <Field label={t(tr('دوّر على صفحة العيادة', 'Find the clinic listing'))}>
              <div className="flex gap-2">
                <input value={q} onChange={e => setQ(e.target.value)} />
                <Btn variant="ghost" disabled={noKey || busy !== ''} onClick={() => run('find', async () => setHits(await findPlaces(q)))}><Search className="size-4" />{t(tr('دوّر', 'Search'))}</Btn>
              </div>
            </Field>
            {hits && (
              <ul className="space-y-2">
                {hits.length === 0 && <li className="text-sm text-[#5e6a7a]">{t(tr('مفيش نتايج. جرّب اسم تاني.', 'No results. Try another name.'))}</li>}
                {hits.map(h => (
                  <li key={h.id}>
                    <button onClick={() => { cms.setGoogle({ placeId: h.id, placeName: h.name }); setHits(null); run('sync', syncReviews) }}
                      className={`w-full rounded-xl border p-3 text-start transition hover:border-[#2f6fd1] ${g.placeId === h.id ? 'border-[#2f6fd1] bg-[#e3f2fb]' : 'border-[#e1e7ec]'}`}>
                      <span className="block text-sm font-medium">{h.name}</span>
                      <span className="block text-xs text-[#5e6a7a]">{h.address}{h.count ? ` · ${h.rating?.toFixed(1)} ★ (${h.count})` : ''}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#f5f8fc] p-3.5">
              <div className="text-sm">
                <span className="block font-medium">{g.placeName || t(tr('لسه مفيش صفحة متختارة', 'No listing chosen yet'))}</span>
                <span className="text-xs text-[#5e6a7a]">{g.lastSync ? `${t(tr('آخر تحديث', 'Last update'))}: ${new Date(g.lastSync).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-GB')}` : ''}</span>
              </div>
              <Btn disabled={!g.placeId || noKey || busy !== ''} onClick={() => run('sync', syncReviews)}><RefreshCw className={`size-4 ${busy === 'sync' ? 'animate-spin' : ''}`} />{t(tr('حدّث دلوقتي', 'Update now'))}</Btn>
            </div>
            {noKey && <p className="text-sm text-amber-700">{t(tr('حط مفتاح يوتيوب أو مفتاح جوجل الأول.', 'Add the YouTube key or a Google key first.'))}</p>}
            {(err || g.lastError) && <p className="text-sm text-rose-600" dir="auto">{err || g.lastError}</p>}
          </div>
        </Card>
        <Card title={g.count ? `${g.rating?.toFixed(1)} ★ · ${g.count} ${t(tr('تقييم', 'reviews'))}` : t(tr('كلام الأهالي', 'Parents\' words'))}>
          {g.reviews.length === 0 ? <p className="text-sm text-[#5e6a7a]">{t(tr('هتظهر هنا بعد أول تحديث.', 'They appear here after the first update.'))}</p> : (
            <>
              <p className="mb-3 text-xs text-[#5e6a7a]">{t(tr('اخفي أي تقييم فيه تفاصيل عن حالة طفل أو اسم. الإخفاء بيفضل حتى بعد التحديث.', 'Hide any review that mentions a child\'s condition or a name. Hidden stays hidden after updates.'))}</p>
              <ul className="divide-y divide-[#eef2f5]">
                {g.reviews.map(r => (
                  <li key={r.id} className="flex gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-sm"><span className="font-medium">{r.author}</span>
                        <span className="flex text-[#e0a800]">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="size-3.5 fill-current" />)}</span>
                        <span className="text-xs text-[#98a2ac]">{r.when}</span></div>
                      <p dir="auto" className="mt-1 line-clamp-3 text-sm text-[#5e6a7a]">{r.text || t(tr('(تقييم بالنجوم بس)', '(stars only)'))}</p>
                    </div>
                    <Toggle on={!r.hidden} onClick={() => cms.setGoogle({ reviews: g.reviews.map(x => x.id === r.id ? { ...x, hidden: !x.hidden } : x) })} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      </div>
    </>
  )
}
