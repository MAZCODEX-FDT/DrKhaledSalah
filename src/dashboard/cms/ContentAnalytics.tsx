import { useState } from 'react'
import { CheckCircle2, CircleDashed } from 'lucide-react'
import { useI18n } from '../../lib/i18n'
import { cms, useContent, type Tracking } from '../../lib/content'
import { validGa4, validPixel } from '../../components/site/Analytics'
import { Btn, Card, Field, PageTitle } from '../ui'
import { tr } from '../labels'
import { DemoNote, Toggle } from './kit'

const events: [string, [string, string]][] = [
  ['page_view', ['كل صفحة اتفتحت (العمليات والمقالات وغيرها)', 'Every page opened (procedures, articles and more)']],
  ['book_submit', ['طلب حجز من صفحة الحجز (Lead في ميتا)', 'Booking request from the Book page (Lead in Meta)']],
  ['contact_whatsapp', ['ضغطة على زرار واتساب، مع الفرع والصفحة', 'WhatsApp button tap, with branch and page']],
  ['contact_call', ['ضغطة على زرار الاتصال، مع الفرع والصفحة', 'Call button tap, with branch and page']],
  ['video_play', ['تشغيل فيديو، مع اسمه', 'Video played, with its title']],
  ['guide_download', ['تحميل أو طباعة دليل قبل الزيارة', 'Before-your-visit sheet downloaded or printed']],
  ['nearest_branch', ['الزائر استخدم "أقرب فرع"', 'Visitor used "nearest branch"']],
]

export default function ContentAnalytics() {
  const { t } = useI18n()
  const saved = useContent(d => d.tracking)
  const [c, setC] = useState<Tracking>(saved)
  const [done, setDone] = useState(false)
  const set = (p: Partial<Tracking>) => { setC(x => ({ ...x, ...p })); setDone(false) }
  const status = (ok: boolean, empty: boolean) => empty
    ? <span className="flex items-center gap-1 text-xs text-[#98a2ac]"><CircleDashed className="size-3.5" />{t(tr('مش متوصل', 'Not connected'))}</span>
    : ok ? <span className="flex items-center gap-1 text-xs text-emerald-700"><CheckCircle2 className="size-3.5" />{t(tr('شغال', 'Active'))}</span>
      : <span className="text-xs text-rose-600">{t(tr('الصيغة مش صح', 'Wrong format'))}</span>
  return (
    <>
      <PageTitle title={t(tr('القياس والإحصائيات', 'Analytics'))}
        sub={t(tr('اربط Google Analytics وMeta Pixel عشان تعرف أنهي عمليات وفيديوهات بتجيب حجوزات. الأرقام دي عامة وبتظهر في كود أي موقع، فمفيش مشكلة تتحط هنا.', 'Connect Google Analytics and Meta Pixel to see which procedures and videos bring bookings. These IDs are public and appear in any site\'s code, so they are safe to store here.'))} />
      <DemoNote />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title={t(tr('الربط', 'Connections'))}>
          <div className="space-y-5">
            <div>
              <Field label="Google Analytics 4 (Measurement ID)"><input dir="ltr" placeholder="G-XXXXXXXXXX" value={c.ga4} onChange={e => set({ ga4: e.target.value.toUpperCase().trim() })} /></Field>
              <div className="mt-1.5 flex justify-between gap-3">{status(validGa4(c.ga4), !c.ga4)}<span className="text-xs text-[#98a2ac]">{t(tr('Admin ← Data streams ← Web', 'Admin → Data streams → Web'))}</span></div>
            </div>
            <div>
              <Field label="Meta Pixel ID"><input dir="ltr" placeholder="123456789012345" value={c.pixel} onChange={e => set({ pixel: e.target.value.replace(/\D/g, '') })} /></Field>
              <div className="mt-1.5 flex justify-between gap-3">{status(validPixel(c.pixel), !c.pixel)}<span className="text-xs text-[#98a2ac]">{t(tr('Events Manager ← Data sources', 'Events Manager → Data sources'))}</span></div>
            </div>
            <div className="flex items-start justify-between gap-4 rounded-xl bg-[#f5f8fc] p-3.5">
              <div>
                <p className="text-sm font-medium">{t(tr('اسأل الزائر الأول (موصى بيه)', 'Ask the visitor first (recommended)'))}</p>
                <p className="text-xs text-[#5e6a7a]">{t(tr('القياس بيبدأ بس بعد ما الزائر يوافق في رسالة صغيرة تحت.', 'Measurement starts only after the visitor accepts a small notice.'))}</p>
              </div>
              <Toggle on={c.askConsent} onClick={() => set({ askConsent: !c.askConsent })} />
            </div>
            <div className="flex items-center justify-end gap-3">
              {done && <span className="text-sm text-[#2f6fd1]">{t(tr('اتحفظ', 'Saved'))}</span>}
              <Btn disabled={(!!c.ga4 && !validGa4(c.ga4)) || (!!c.pixel && !validPixel(c.pixel))} onClick={() => { cms.setTracking(c); setDone(true) }}>{t(tr('حفظ', 'Save'))}</Btn>
            </div>
          </div>
        </Card>
        <Card title={t(tr('اللي بيتقاس', 'What gets measured'))}>
          <ul className="divide-y divide-[#eef2f5]">
            {events.map(([k, d]) => (
              <li key={k} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                <span className="text-sm">{t(tr(d[0], d[1]))}</span>
                <code dir="ltr" className="rounded bg-[#eef2f5] px-2 py-0.5 text-xs text-[#163e7a]">{k}</code>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-[#98a2ac]">{t(tr('مفيش أسماء ولا أرقام تليفونات ولا تفاصيل طبية بتتبعت لجوجل أو ميتا.', 'No names, phone numbers or medical details are sent to Google or Meta.'))}</p>
        </Card>
      </div>
    </>
  )
}
