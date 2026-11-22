import { useMemo, useState, type FormEvent } from 'react'
import { Plus, Search, Phone, X, CalendarPlus, Star } from 'lucide-react'
import { useI18n } from '../../lib/i18n'
import { actions, useDB, type Patient, type BranchId, type ProcedureId } from '../../lib/store'
import { useBranch } from '../DashboardApp'
import { Btn, Card, Dot, Field, Modal, PageTitle, Pill } from '../ui'
import { branchLabel, kindLabel, procColor, procLabel, procOrder, statusLabel, statusTone, tr } from '../labels'
import AppointmentForm from './AppointmentForm'

const ageOf = (b: string, ar: boolean) => {
  if (!b) return '—'
  const m = Math.max(0, Math.floor((Date.now() - new Date(b).getTime()) / (30.44 * 864e5)))
  if (m < 24) return ar ? `${m} شهر` : `${m} mo`
  return ar ? `${Math.floor(m / 12)} سنة` : `${Math.floor(m / 12)} yrs`
}

function PatientForm({ onClose }: { onClose: () => void }) {
  const { t } = useI18n()
  const [f, setF] = useState<Omit<Patient, 'id' | 'createdAt'>>({ childName: '', guardian: '', phone: '', birthDate: '', gender: 'male', branch: 'tagamoa', procedure: 'consultation', notes: '' })
  const submit = (e: FormEvent) => { e.preventDefault(); actions.addPatient(f); onClose() }
  return (
    <Modal open onClose={onClose} title={t(tr('مريض جديد', 'New patient'))}>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label={t(tr('اسم الطفل', 'Child\'s name'))}><input required value={f.childName} onChange={e => setF({ ...f, childName: e.target.value })} /></Field>
        <Field label={t(tr('ولي الأمر', 'Guardian'))}><input required value={f.guardian} onChange={e => setF({ ...f, guardian: e.target.value })} /></Field>
        <Field label={t(tr('الموبايل', 'Phone'))}><input required dir="ltr" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} /></Field>
        <Field label={t(tr('تاريخ الميلاد', 'Date of birth'))}><input type="date" value={f.birthDate} onChange={e => setF({ ...f, birthDate: e.target.value })} /></Field>
        <Field label={t(tr('الفرع', 'Branch'))}>
          <select value={f.branch} onChange={e => setF({ ...f, branch: e.target.value as BranchId })}>
            {(Object.keys(branchLabel) as BranchId[]).map(b => <option key={b} value={b}>{t(branchLabel[b])}</option>)}
          </select>
        </Field>
        <Field label={t(tr('الإجراء', 'Procedure'))}>
          <select value={f.procedure} onChange={e => setF({ ...f, procedure: e.target.value as ProcedureId })}>
            {procOrder.map(p => <option key={p} value={p}>{t(procLabel[p])}</option>)}
          </select>
        </Field>
        <div className="sm:col-span-2"><Field label={t(tr('ملاحظات طبية', 'Clinical notes'))}><textarea rows={3} value={f.notes} onChange={e => setF({ ...f, notes: e.target.value })} /></Field></div>
        <div className="flex justify-end gap-2 sm:col-span-2">
          <Btn type="button" variant="ghost" onClick={onClose}>{t(tr('إلغاء', 'Cancel'))}</Btn>
          <Btn type="submit">{t(tr('حفظ', 'Save'))}</Btn>
        </div>
      </form>
    </Modal>
  )
}

export default function Patients() {
  const { t, lang } = useI18n()
  const { branch } = useBranch()
  const patients = useDB(d => d.patients)
  const appts = useDB(d => d.appointments)
  const [q, setQ] = useState('')
  const [proc, setProc] = useState<'all' | ProcedureId>('all')
  const [adding, setAdding] = useState(false)
  const [sel, setSel] = useState<string | null>(null)
  const [booking, setBooking] = useState(false)

  const rows = useMemo(() => patients
    .filter(p => branch === 'all' || p.branch === branch)
    .filter(p => proc === 'all' || p.procedure === proc)
    .filter(p => !q || `${p.childName} ${p.guardian} ${p.phone}`.includes(q)), [patients, branch, proc, q])
  const cur = patients.find(p => p.id === sel)
  const history = useMemo(() => appts.filter(a => a.patientId === sel).sort((a, b) => b.date.localeCompare(a.date)), [appts, sel])

  return (
    <>
      <PageTitle title={t(tr('المرضى', 'Patients'))} sub={t(tr(`${rows.length} ملف`, `${rows.length} records`))}
        action={<Btn onClick={() => setAdding(true)}><Plus className="size-4" />{t(tr('مريض جديد', 'New patient'))}</Btn>} />
      <div className="grid gap-4 xl:grid-cols-[1fr_24rem]">
        <Card>
          <div className="mb-5 flex flex-wrap gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[#9aa29f]" />
              <input className="!ps-9" placeholder={t(tr('دوّر بالاسم أو الرقم', 'Search name or phone'))} value={q} onChange={e => setQ(e.target.value)} />
            </div>
            <select className="!w-auto" value={proc} onChange={e => setProc(e.target.value as 'all' | ProcedureId)}>
              <option value="all">{t(tr('كل الإجراءات', 'All procedures'))}</option>
              {procOrder.map(p => <option key={p} value={p}>{t(procLabel[p])}</option>)}
            </select>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {rows.map(p => (
              <li key={p.id}>
                <button onClick={() => setSel(p.id)} className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-start transition ${sel === p.id ? 'border-[#c9a96a] bg-[#fbf7ee]' : 'border-[#efe9dc] hover:bg-[#faf8f3]'}`}>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#14302f] font-display text-ivory">{p.childName.slice(0, 1)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{p.childName} <span className="text-xs font-normal text-[#5d6865]">· {ageOf(p.birthDate, lang === 'ar')}</span></span>
                    <span className="block truncate text-xs text-[#5d6865]">{p.guardian} · {t(branchLabel[p.branch])}</span>
                  </span>
                  <Dot color={procColor(p.procedure)} />
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="h-fit xl:sticky xl:top-24">
          {!cur ? <p className="py-16 text-center text-sm text-[#5d6865]">{t(tr('اختار مريض عشان تشوف ملفه', 'Select a patient to see their record'))}</p> : (
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-2xl font-light">{cur.childName}</h3>
                  <p className="text-sm text-[#5d6865]">{cur.guardian} · {ageOf(cur.birthDate, lang === 'ar')}</p>
                </div>
                <button onClick={() => setSel(null)} className="rounded-lg p-1 hover:bg-[#f2eee5]" aria-label="Close"><X className="size-4" /></button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Pill className="bg-[#f2eee5] text-[#14302f]"><Dot color={procColor(cur.procedure)} />{t(procLabel[cur.procedure])}</Pill>
                <Pill className="bg-[#f2eee5] text-[#14302f]">{t(branchLabel[cur.branch])}</Pill>
              </div>
              <a href={`tel:${cur.phone}`} className="mt-5 flex items-center gap-2 text-sm text-[#14302f]" dir="ltr"><Phone className="size-4" />{cur.phone}</a>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Btn variant="ghost" onClick={() => setBooking(true)}><CalendarPlus className="size-4" />{t(tr('ميعاد', 'Book'))}</Btn>
                <Btn variant="ghost" onClick={() => actions.addReviewRequest(cur.id, cur.branch)}><Star className="size-4" />{t(tr('طلب تقييم', 'Ask review'))}</Btn>
              </div>
              <Field label={t(tr('ملاحظات طبية', 'Clinical notes'))}>
                <textarea className="mt-5" rows={3} value={cur.notes} onChange={e => actions.updatePatient(cur.id, { notes: e.target.value })} />
              </Field>
              <h4 className="mb-3 mt-6 text-sm font-semibold">{t(tr('سجل الزيارات', 'Visit history'))}</h4>
              <ul className="space-y-2">
                {history.map(a => (
                  <li key={a.id} className="flex items-center justify-between rounded-xl bg-[#f7f4ee] px-3 py-2.5 text-sm">
                    <span><span className="font-latin">{a.date}</span> · {t(kindLabel[a.kind])}</span>
                    <Pill className={statusTone[a.status]}>{t(statusLabel[a.status])}</Pill>
                  </li>
                ))}
                {!history.length && <li className="text-sm text-[#5d6865]">—</li>}
              </ul>
            </div>
          )}
        </Card>
      </div>
      {adding && <PatientForm onClose={() => setAdding(false)} />}
      {booking && cur && <AppointmentForm open initial={{ patientId: cur.id, branch: cur.branch, type: cur.procedure }} onClose={() => setBooking(false)} />}
    </>
  )
}
