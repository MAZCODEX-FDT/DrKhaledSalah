import { RotateCcw } from 'lucide-react'
import { useI18n } from '../../lib/i18n'
import { actions, useDB, type Settings as S } from '../../lib/store'
import { branches } from '../../content/site'
import { Btn, Card, Field, PageTitle } from '../ui'
import { tr } from '../labels'

export default function Settings() {
  const { t } = useI18n()
  const s = useDB(d => d.settings)
  const num = (k: keyof S) => (e: React.ChangeEvent<HTMLInputElement>) => actions.updateSettings({ [k]: Number(e.target.value) })
  return (
    <>
      <PageTitle title={t(tr('الإعدادات', 'Settings'))} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title={t(tr('أهداف الخطة', 'Plan goals'))}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t(tr('عمليات في الشهر', 'Surgeries per month'))}><input type="number" value={s.goalSurgeries} onChange={num('goalSurgeries')} /></Field>
            <Field label={t(tr('تقييمات التجمع (90 يوم)', 'Settlement reviews (90 days)'))}><input type="number" value={s.goalReviews} onChange={num('goalReviews')} /></Field>
            <Field label={t(tr('ميزانية الإعلانات الشهرية (جنيه)', 'Monthly ad budget (EGP)'))}><input type="number" value={s.adBudget} onChange={num('adBudget')} /></Field>
            <Field label={t(tr('وقت الرد المستهدف (دقيقة)', 'Target reply time (min)'))}><input type="number" value={s.replyMinutes} onChange={num('replyMinutes')} /></Field>
          </div>
        </Card>
        <Card title={t(tr('الفروع', 'Branches'))}>
          <ul className="space-y-3">
            {branches.map(b => (
              <li key={b.id} className="rounded-xl bg-[#f3f6f9] p-4 text-sm">
                <p className="font-medium">{t(b.name)}</p>
                <p className="mt-1 text-[#5b6773]">{t(b.address)}</p>
                <p className="mt-1 font-latin text-[#5b6773]" dir="ltr">{b.phone}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-[#5b6773]">{t(tr('الأرقام والعناوين بتتعدل من src/content/site.ts لحد ما يتربط نظام إدارة محتوى.', 'Numbers and addresses are edited in src/content/site.ts until a CMS is connected.'))}</p>
        </Card>
        <Card title={t(tr('بيانات العرض', 'Demo data'))} className="lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-[#5b6773]">{t(tr('البيانات دي تجريبية ومتخزنة على المتصفح ده بس. قبل الإطلاق هتتربط بقاعدة بيانات آمنة.', 'This data is demo-only and stored in this browser. Before launch it will connect to a secure database.'))}</p>
            <Btn variant="ghost" onClick={actions.reset}><RotateCcw className="size-4" />{t(tr('رجّع البيانات التجريبية', 'Reset demo data'))}</Btn>
          </div>
        </Card>
      </div>
    </>
  )
}
