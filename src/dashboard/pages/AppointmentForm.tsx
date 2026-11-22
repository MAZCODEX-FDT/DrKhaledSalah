import { useState, type FormEvent } from 'react'
import { useI18n } from '../../lib/i18n'
import { actions, useDB, todayISO, type Appointment, type BranchId, type ProcedureId } from '../../lib/store'
import { Btn, Field, Modal } from '../ui'
import { branchLabel, kindLabel, procLabel, procOrder, tr } from '../labels'

export default function AppointmentForm({ open, onClose, initial }: { open: boolean; onClose: () => void; initial?: Partial<Appointment> }) {
  const { t } = useI18n()
  const patients = useDB(d => d.patients)
  const [f, setF] = useState<Omit<Appointment, 'id'>>({
    patientId: initial?.patientId ?? patients[0]?.id ?? '', branch: initial?.branch ?? 'tagamoa', type: initial?.type ?? 'consultation',
    kind: initial?.kind ?? 'consultation', date: initial?.date ?? todayISO(), time: initial?.time ?? '18:00', status: 'scheduled', notes: '',
  })
  const submit = (e: FormEvent) => { e.preventDefault(); actions.addAppointment(f); onClose() }
  return (
    <Modal open={open} onClose={onClose} title={t(tr('ميعاد جديد', 'New appointment'))}>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label={t(tr('المريض', 'Patient'))}>
            <select value={f.patientId} onChange={e => setF({ ...f, patientId: e.target.value })} required>
              {patients.map(p => <option key={p.id} value={p.id}>{p.childName} · {p.guardian}</option>)}
            </select>
          </Field>
        </div>
        <Field label={t(tr('الفرع', 'Branch'))}>
          <select value={f.branch} onChange={e => setF({ ...f, branch: e.target.value as BranchId })}>
            {(Object.keys(branchLabel) as BranchId[]).map(b => <option key={b} value={b}>{t(branchLabel[b])}</option>)}
          </select>
        </Field>
        <Field label={t(tr('النوع', 'Type'))}>
          <select value={f.kind} onChange={e => setF({ ...f, kind: e.target.value as Appointment['kind'] })}>
            {(Object.keys(kindLabel) as Appointment['kind'][]).map(k => <option key={k} value={k}>{t(kindLabel[k])}</option>)}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field label={t(tr('الإجراء', 'Procedure'))}>
            <select value={f.type} onChange={e => setF({ ...f, type: e.target.value as ProcedureId })}>
              {procOrder.map(p => <option key={p} value={p}>{t(procLabel[p])}</option>)}
            </select>
          </Field>
        </div>
        <Field label={t(tr('التاريخ', 'Date'))}><input type="date" value={f.date} onChange={e => setF({ ...f, date: e.target.value })} required /></Field>
        <Field label={t(tr('الساعة', 'Time'))}><input type="time" value={f.time} onChange={e => setF({ ...f, time: e.target.value })} required /></Field>
        <div className="sm:col-span-2"><Field label={t(tr('ملاحظات', 'Notes'))}><textarea rows={2} value={f.notes} onChange={e => setF({ ...f, notes: e.target.value })} /></Field></div>
        <div className="flex justify-end gap-2 sm:col-span-2">
          <Btn type="button" variant="ghost" onClick={onClose}>{t(tr('إلغاء', 'Cancel'))}</Btn>
          <Btn type="submit">{t(tr('حفظ', 'Save'))}</Btn>
        </div>
      </form>
    </Modal>
  )
}
