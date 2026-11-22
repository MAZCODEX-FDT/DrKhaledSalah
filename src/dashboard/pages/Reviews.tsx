import { useMemo } from 'react'
import { Star, Send, CheckCircle2 } from 'lucide-react'
import { useI18n } from '../../lib/i18n'
import { actions, useDB } from '../../lib/store'
import { useBranch } from '../DashboardApp'
import { Btn, Card, PageTitle, Pill } from '../ui'
import { branchLabel, tr } from '../labels'

// TODO: replace with the Settlement Google Business review short link once the two listings are merged.
const REVIEW_LINK = 'https://g.page/r/REPLACE_WITH_SETTLEMENT_REVIEW_LINK/review'

export default function Reviews() {
  const { t, lang } = useI18n()
  const { branch } = useBranch()
  const reviews = useDB(d => d.reviews)
  const patients = useDB(d => d.patients)
  const goal = useDB(d => d.settings.goalReviews)
  const pmap = useMemo(() => new Map(patients.map(p => [p.id, p])), [patients])
  const list = reviews.filter(r => branch === 'all' || r.branch === branch)
  const done = reviews.filter(r => r.branch === 'tagamoa' && r.status === 'reviewed').length
  const total = 11 + done
  const pct = Math.min(100, Math.round((total / goal) * 100))
  const msg = lang === 'ar'
    ? `أهلًا بحضرتك، نتمنى يكون البيبي بخير. رأي حضرتك في زيارتك لفرع التجمع بيساعد عيلة تانية تلاقينا: ${REVIEW_LINK}`
    : `Hello, we hope your little one is doing well. Your feedback on your visit to our Settlement branch helps another family find us: ${REVIEW_LINK}`

  return (
    <>
      <PageTitle title={t(tr('التقييمات', 'Reviews'))} sub={t(tr('طلب تقييم بعد الزيارة بأسبوع، على صفحة التجمع', 'Request a review one week after the visit, on the Settlement page'))} />
      <div className="grid gap-4 lg:grid-cols-[22rem_1fr]">
        <Card className="h-fit">
          <p className="text-sm text-[#5d6865]">{t(tr('تقييمات Google لفرع التجمع', 'Settlement Google reviews'))}</p>
          <div className="relative mx-auto my-6 size-48">
            <svg viewBox="0 0 120 120" className="size-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#efe9dc" strokeWidth="10" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="#13917f" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(pct / 100) * 326.7} 326.7`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-latin text-5xl font-light">{total}</span>
              <span className="text-xs text-[#5d6865]">{t(tr(`من ${goal}`, `of ${goal}`))}</span>
            </div>
          </div>
          <p className="text-center text-xs text-[#5d6865]">{t(tr('البداية: 11 تقييم (نوفمبر 2026) · الهدف في 90 يوم', 'Start: 11 reviews (Nov 2026) · 90-day goal'))}</p>
          <a href={`https://wa.me/?text=${encodeURIComponent(msg)}`} target="_blank" rel="noreferrer" className="mt-6 block">
            <Btn variant="gold" className="w-full"><Send className="size-4" />{t(tr('نسخ رسالة طلب التقييم', 'Open review request message'))}</Btn>
          </a>
        </Card>

        <Card title={t(tr('طلبات التقييم', 'Review requests'))}>
          <ul className="divide-y divide-[#efe9dc]">
            {list.map(r => {
              const p = pmap.get(r.patientId)
              return (
                <li key={r.id} className="flex flex-wrap items-center gap-3 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{p?.guardian ?? '—'} <span className="text-sm font-normal text-[#5d6865]">· {p?.childName}</span></p>
                    <p className="text-xs text-[#5d6865]">{t(branchLabel[r.branch])} · <span className="font-latin">{r.sentAt}</span></p>
                  </div>
                  {r.status === 'reviewed' ? (
                    <Pill className="bg-emerald-50 text-emerald-800"><CheckCircle2 className="size-3.5" />{t(tr('اتكتب', 'Reviewed'))} {r.rating && <span className="flex text-amber-500">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="size-3 fill-current" />)}</span>}</Pill>
                  ) : (
                    <>
                      <Pill className={r.status === 'sent' ? 'bg-sky-50 text-sky-800' : 'bg-stone-100 text-stone-700'}>{t(r.status === 'sent' ? tr('اتبعت', 'Sent') : tr('مستني', 'Pending'))}</Pill>
                      <Btn variant="ghost" className="!py-1.5 text-xs" onClick={() => actions.updateReview(r.id, { status: 'reviewed', rating: 5 })}>{t(tr('اتكتب', 'Mark reviewed'))}</Btn>
                    </>
                  )}
                </li>
              )
            })}
          </ul>
        </Card>
      </div>
    </>
  )
}
