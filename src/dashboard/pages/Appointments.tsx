import { useMemo, useState } from 'react'
import { Plus, Search, Trash2 } from 'lucide-react'
import { useI18n } from '../../lib/i18n'
import { actions, useDB, todayISO, type ApptStatus } from '../../lib/store'
import { useBranch } from '../DashboardApp'
import { Btn, Card, Dot, PageTitle } from '../ui'
import { branchLabel, kindLabel, procColor, procLabel, statusLabel, statusTone, tr } from '../labels'
import AppointmentForm from './AppointmentForm'

type Range = 'upcoming' | 'today' | 'past' | 'all'

export default function Appointments() {
  const { t, lang } = useI18n()
  const { branch } = useBranch()
  const appts = useDB(d => d.appointments)
  const patients = useDB(d => d.patients)
  const [range, setRange] = useState<Range>('upcoming')
  const [status, setStatus] = useState<'all' | ApptStatus>('all')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const today = todayISO()

  const rows = useMemo(() => {
    const pmap = new Map(patients.map(p => [p.id, p]))
    return appts
      .filter(a => branch === 'all' || a.branch === branch)
      .filter(a => range === 'all' || (range === 'today' ? a.date === today : range === 'upcoming' ? a.date >= today : a.date < today))
      .filter(a => status === 'all' || a.status === status)
      .map(a => ({ a, p: pmap.get(a.patientId) }))
      .filter(({ p }) => !q || `${p?.childName} ${p?.guardian} ${p?.phone}`.includes(q))
      .sort((x, y) => (range === 'past' ? -1 : 1) * (x.a.date + x.a.time).localeCompare(y.a.date + y.a.time))
  }, [appts, patients, branch, range, status, q, today])

  const ranges: [Range, string][] = [['upcoming', t(tr('الجاية', 'Upcoming'))], ['today', t(tr('النهارده', 'Today'))], ['past', t(tr('اللي فاتت', 'Past'))], ['all', t(tr('الكل', 'All'))]]

  return (
    <>
      <PageTitle title={t(tr('المواعيد', 'Appointments'))} sub={t(tr(`${rows.length} ميعاد`, `${rows.length} appointments`))}
        action={<Btn onClick={() => setOpen(true)}><Plus className="size-4" />{t(tr('ميعاد جديد', 'New appointment'))}</Btn>} />
      <Card>
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl border border-[#dbe2e8] p-1 text-sm">
            {ranges.map(([k, l]) => (
              <button key={k} onClick={() => setRange(k)} className={`rounded-lg px-3 py-1.5 ${range === k ? 'bg-[#eaf1f7] font-medium' : 'text-[#5b6773]'}`}>{l}</button>
            ))}
          </div>
          <select className="!w-auto" value={status} onChange={e => setStatus(e.target.value as 'all' | ApptStatus)}>
            <option value="all">{t(tr('كل الحالات', 'All statuses'))}</option>
            {(Object.keys(statusLabel) as ApptStatus[]).map(s => <option key={s} value={s}>{t(statusLabel[s])}</option>)}
          </select>
          <div className="relative ms-auto w-full sm:w-64">
            <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[#98a2ac]" />
            <input className="!ps-9" placeholder={t(tr('دوّر بالاسم أو الرقم', 'Search name or phone'))} value={q} onChange={e => setQ(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-[#e9eef2] text-start text-xs text-[#5b6773]">
                {[tr('التاريخ', 'Date'), tr('المريض', 'Patient'), tr('الإجراء', 'Procedure'), tr('النوع', 'Type'), tr('الفرع', 'Branch'), tr('الحالة', 'Status'), tr('', '')].map((h, i) => (
                  <th key={i} className="px-3 py-3 text-start font-medium">{t(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ a, p }) => (
                <tr key={a.id} className="border-b border-[#eef2f5] hover:bg-[#f7f9fb]">
                  <td className="px-3 py-3.5 font-latin whitespace-nowrap">
                    <span className="block">{new Date(a.date).toLocaleDateString(lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', { day: 'numeric', month: 'short' })}</span>
                    <span className="text-xs text-[#5b6773]">{a.time}</span>
                  </td>
                  <td className="px-3 py-3.5"><span className="font-medium">{p?.childName}</span><span className="block text-xs text-[#5b6773]">{p?.guardian}</span></td>
                  <td className="px-3 py-3.5"><span className="flex items-center gap-2"><Dot color={procColor(a.type)} />{t(procLabel[a.type])}</span></td>
                  <td className="px-3 py-3.5">{t(kindLabel[a.kind])}</td>
                  <td className="px-3 py-3.5">{t(branchLabel[a.branch])}</td>
                  <td className="px-3 py-3.5">
                    <select value={a.status} onChange={e => actions.updateAppointment(a.id, { status: e.target.value as ApptStatus })}
                      className={`!w-auto !rounded-full !border-0 !py-1 !px-3 text-xs font-medium ${statusTone[a.status]}`}>
                      {(Object.keys(statusLabel) as ApptStatus[]).map(s => <option key={s} value={s}>{t(statusLabel[s])}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-3.5 text-end">
                    <button onClick={() => actions.deleteAppointment(a.id)} className="rounded-lg p-1.5 text-[#98a2ac] hover:bg-rose-50 hover:text-rose-700" aria-label="Delete"><Trash2 className="size-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && <p className="py-12 text-center text-sm text-[#5b6773]">{t(tr('مفيش مواعيد', 'No appointments'))}</p>}
        </div>
      </Card>
      {open && <AppointmentForm open onClose={() => setOpen(false)} />}
    </>
  )
}
