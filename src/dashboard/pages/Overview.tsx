import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { ArrowUpRight, CalendarCheck2, Inbox, Scissors, Star, Clock3 } from 'lucide-react'
import { useI18n } from '../../lib/i18n'
import { useDB, todayISO, iso, addDays } from '../../lib/store'
import { useBranch } from '../DashboardApp'
import { Card, PageTitle, Pill, Dot } from '../ui'
import { SERIES, procLabel, procOrder, procColor, sourceLabel, statusLabel, statusTone, kindLabel, tr, stageLabel } from '../labels'

const tip = { borderRadius: 12, border: '1px solid #e7e1d4', boxShadow: '0 12px 32px -18px rgba(20,33,31,.35)', fontSize: 12 }

export default function Overview() {
  const { t, lang } = useI18n()
  const { branch } = useBranch()
  const all = useDB(d => d)
  const today = todayISO()

  const m = useMemo(() => {
    const inB = <T extends { branch: string }>(x: T) => branch === 'all' || x.branch === branch
    const appts = all.appointments.filter(inB)
    const inq = all.inquiries.filter(inB)
    const month = today.slice(0, 7)
    const surgeries = appts.filter(a => a.kind === 'surgery' && a.date.startsWith(month) && a.status !== 'cancelled')
    const todays = appts.filter(a => a.date === today).sort((a, b) => a.time.localeCompare(b.time))
    const open = inq.filter(q => q.stage !== 'booked' && q.stage !== 'lost')
    const booked = inq.filter(q => q.stage === 'booked').length
    const conv = inq.length ? Math.round((booked / inq.length) * 100) : 0
    const reviewsDone = all.reviews.filter(r => r.status === 'reviewed' && r.branch === 'tagamoa').length
    const tagReviews = 11 + reviewsDone // 11 = Settlement Google reviews at plan start (Nov 2026)
    const followDue = inq.filter(q => q.stage === 'follow-24' || q.stage === 'follow-72')

    const days = Array.from({ length: 14 }, (_, i) => iso(addDays(i - 10)))
    const trend = days.map(d => ({
      d: new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', { day: 'numeric', month: 'short' }),
      v: appts.filter(a => a.date === d && a.status !== 'cancelled').length,
    }))
    const mix = procOrder.map(p => ({ p, v: appts.filter(a => a.type === p).length })).filter(x => x.v > 0)
    const sources = Object.keys(sourceLabel).map(s => ({ s, v: inq.filter(q => q.source === s).length })).filter(x => x.v).sort((a, b) => b.v - a.v)
    return { surgeries, todays, open, conv, tagReviews, followDue, trend, mix, sources, inqTotal: inq.length }
  }, [all, branch, today, lang])

  const patient = (id: string) => all.patients.find(p => p.id === id)
  const goal = all.settings.goalSurgeries
  const pct = Math.min(100, Math.round((m.surgeries.length / goal) * 100))

  const kpis = [
    { icon: Scissors, label: tr('عمليات الشهر', 'Surgeries this month'), value: `${m.surgeries.length}`, sub: t(tr(`الهدف ${goal}`, `Goal ${goal}`)), bar: pct },
    { icon: CalendarCheck2, label: tr('مواعيد النهارده', 'Today\'s appointments'), value: `${m.todays.length}`, sub: t(tr('في كل الفروع المختارة', 'Across selected branches')) },
    { icon: Inbox, label: tr('استفسارات مفتوحة', 'Open inquiries'), value: `${m.open.length}`, sub: t(tr(`نسبة الحجز ${m.conv}% · الهدف 30%`, `Booking rate ${m.conv}% · target 30%`)) },
    { icon: Star, label: tr('تقييمات Google للتجمع', 'Settlement Google reviews'), value: `${m.tagReviews}`, sub: t(tr(`الهدف ${all.settings.goalReviews} في 90 يوم`, `Goal ${all.settings.goalReviews} in 90 days`)), bar: Math.round((m.tagReviews / all.settings.goalReviews) * 100) },
  ]

  return (
    <>
      <PageTitle
        title={t(tr('صباح الخير يا دكتور', 'Good morning, Doctor'))}
        sub={new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k, i) => (
          <Card key={i} className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <p className="text-sm text-[#5d6865]">{t(k.label)}</p>
              <span className="flex size-9 items-center justify-center rounded-xl bg-[#f2eee5] text-[#14302f]"><k.icon className="size-4" /></span>
            </div>
            <p className="mt-3 font-latin text-4xl font-light tracking-tight">{k.value}</p>
            <p className="mt-1 text-xs text-[#5d6865]">{k.sub}</p>
            {k.bar !== undefined && (
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#efe9dc]"><div className="h-full rounded-full bg-[#13917f]" style={{ width: `${Math.min(100, k.bar)}%` }} /></div>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card title={t(tr('المواعيد يوم بيوم', 'Appointments per day'))} action={<span className="text-xs text-[#5d6865]">{t(tr('آخر 10 أيام والجاي', 'Last 10 days and upcoming'))}</span>}>
          <div className="h-64" dir="ltr">
            <ResponsiveContainer>
              <AreaChart data={m.trend} margin={{ left: -24, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={SERIES[0]} stopOpacity=".25" /><stop offset="1" stopColor={SERIES[0]} stopOpacity="0" /></linearGradient>
                </defs>
                <CartesianGrid stroke="#efe9dc" vertical={false} />
                <XAxis dataKey="d" tick={{ fontSize: 11, fill: '#5d6865' }} axisLine={false} tickLine={false} interval={1} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#5d6865' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tip} formatter={(v) => [v, t(tr('مواعيد', 'Appointments'))]} cursor={{ stroke: '#c9a96a', strokeDasharray: '3 3' }} />
                <Area type="monotone" dataKey="v" stroke={SERIES[0]} strokeWidth={2} fill="url(#g1)" activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title={t(tr('توزيع العمليات', 'Procedure mix'))}>
          <div className="flex items-center gap-4">
            <div className="h-48 w-40 shrink-0" dir="ltr">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={m.mix} dataKey="v" nameKey="p" innerRadius={48} outerRadius={72} paddingAngle={2} stroke="#fff" strokeWidth={2}>
                    {m.mix.map(x => <Cell key={x.p} fill={procColor(x.p)} />)}
                  </Pie>
                  <Tooltip contentStyle={tip} formatter={(v, _n, item) => [v, t(procLabel[(item.payload as { p: keyof typeof procLabel }).p])]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex-1 space-y-2.5 text-sm">
              {m.mix.map(x => (
                <li key={x.p} className="flex items-center gap-2.5"><Dot color={procColor(x.p)} /><span className="flex-1 text-[#3b4744]">{t(procLabel[x.p])}</span><span className="font-latin font-medium">{x.v}</span></li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card title={t(tr('جدول النهارده', 'Today\'s schedule'))} className="xl:col-span-2"
          action={<Link to="/dashboard/schedule" className="flex items-center gap-1 text-xs text-[#14302f] hover:underline">{t(tr('الجدول كامل', 'Full schedule'))}<ArrowUpRight className="size-3.5 rtl:-scale-x-100" /></Link>}>
          {m.todays.length === 0 ? <p className="py-8 text-center text-sm text-[#5d6865]">{t(tr('مفيش مواعيد النهارده', 'No appointments today'))}</p> : (
            <ul className="divide-y divide-[#efe9dc]">
              {m.todays.map(a => {
                const p = patient(a.patientId)
                return (
                  <li key={a.id} className="flex items-center gap-4 py-3">
                    <span className="flex w-16 items-center gap-1.5 font-latin text-sm text-[#5d6865]"><Clock3 className="size-3.5" />{a.time}</span>
                    <Dot color={procColor(a.type)} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p?.childName} <span className="font-normal text-[#5d6865]">· {p?.guardian}</span></p>
                      <p className="text-xs text-[#5d6865]">{t(kindLabel[a.kind])} · {t(procLabel[a.type])}</p>
                    </div>
                    <Pill className={statusTone[a.status]}>{t(statusLabel[a.status])}</Pill>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        <Card title={t(tr('متابعات مستحقة', 'Follow-ups due'))}
          action={<Link to="/dashboard/inquiries" className="text-xs text-[#14302f] hover:underline">{t(tr('كل الاستفسارات', 'All inquiries'))}</Link>}>
          <ul className="space-y-3">
            {m.followDue.slice(0, 5).map(q => (
              <li key={q.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#f7f4ee] px-3.5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{q.name}</p>
                  <p className="text-xs text-[#5d6865]">{t(procLabel[q.procedure])}</p>
                </div>
                <Pill className="bg-amber-50 text-amber-800">{t(stageLabel[q.stage])}</Pill>
              </li>
            ))}
            {!m.followDue.length && <p className="py-6 text-center text-sm text-[#5d6865]">{t(tr('مفيش متابعات', 'All caught up'))}</p>}
          </ul>
        </Card>
      </div>

      <div className="mt-4">
        <Card title={t(tr('مصدر الاستفسارات', 'Where inquiries come from'))} action={<span className="text-xs text-[#5d6865]">{m.inqTotal} {t(tr('استفسار', 'inquiries'))}</span>}>
          <div className="h-56" dir="ltr">
            <ResponsiveContainer>
              <BarChart data={m.sources.map(s => ({ ...s, name: t(sourceLabel[s.s as keyof typeof sourceLabel]) }))} margin={{ left: -24, right: 8, top: 8 }}>
                <CartesianGrid stroke="#efe9dc" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5d6865' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#5d6865' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tip} cursor={{ fill: '#f7f4ee' }} formatter={(v) => [v, t(tr('استفسار', 'Inquiries'))]} />
                <Bar dataKey="v" fill={SERIES[0]} radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </>
  )
}
