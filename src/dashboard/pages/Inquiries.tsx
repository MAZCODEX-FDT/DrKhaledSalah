import { useMemo, useState, type DragEvent } from 'react'
import { MessageCircle, CalendarCheck, Trash2, Plus } from 'lucide-react'
import { useI18n } from '../../lib/i18n'
import { actions, useDB, todayISO, type InquiryStage, type Source, type BranchId, type ProcedureId } from '../../lib/store'
import { useBranch } from '../DashboardApp'
import { Btn, Card, Field, Modal, PageTitle, Pill } from '../ui'
import { branchLabel, procLabel, procOrder, sourceLabel, stageLabel, stageOrder, tr } from '../labels'

const stageTone: Record<InquiryStage, string> = {
  new: 'bg-sky-500', replied: 'bg-teal-600', 'follow-24': 'bg-amber-500', 'follow-72': 'bg-orange-600', booked: 'bg-emerald-600', lost: 'bg-zinc-400',
}

export default function Inquiries() {
  const { t } = useI18n()
  const { branch } = useBranch()
  const inquiries = useDB(d => d.inquiries)
  const [drag, setDrag] = useState<string | null>(null)
  const [convert, setConvert] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [when, setWhen] = useState({ date: todayISO(), time: '18:00' })
  const [nf, setNf] = useState({ name: '', phone: '', branch: 'tagamoa' as BranchId, procedure: 'consultation' as ProcedureId, source: 'whatsapp' as Source, message: '' })

  const list = useMemo(() => inquiries.filter(q => branch === 'all' || q.branch === branch), [inquiries, branch])
  const booked = list.filter(q => q.stage === 'booked').length
  const rate = list.length ? Math.round((booked / list.length) * 100) : 0

  const onDrop = (stage: InquiryStage) => (e: DragEvent) => { e.preventDefault(); if (drag) actions.moveInquiry(drag, stage); setDrag(null) }

  return (
    <>
      <PageTitle title={t(tr('الاستفسارات', 'Inquiries'))}
        sub={t(tr(`كل استفسار متسجّل لحد الحجز · نسبة الحجز ${rate}% (الهدف 3 من كل 10)`, `Every inquiry tracked to booking · booking rate ${rate}% (target 3 in 10)`))}
        action={<Btn onClick={() => setAdding(true)}><Plus className="size-4" />{t(tr('استفسار جديد', 'New inquiry'))}</Btn>} />

      <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
        <div className="grid min-w-[1180px] grid-cols-6 gap-3">
          {stageOrder.map(s => {
            const col = list.filter(q => q.stage === s)
            return (
              <div key={s} onDragOver={e => e.preventDefault()} onDrop={onDrop(s)} className="flex min-h-[28rem] flex-col rounded-2xl bg-[#ece6d9]/60 p-2.5">
                <div className="mb-3 flex items-center gap-2 px-1.5 pt-1">
                  <span className={`size-2 rounded-full ${stageTone[s]}`} />
                  <span className="text-sm font-semibold">{t(stageLabel[s])}</span>
                  <span className="ms-auto font-latin text-xs text-[#5d6865]">{col.length}</span>
                </div>
                <div className="flex-1 space-y-2">
                  {col.map(q => (
                    <article key={q.id} draggable onDragStart={() => setDrag(q.id)} onDragEnd={() => setDrag(null)}
                      className={`dash-card cursor-grab !rounded-xl p-3 text-sm active:cursor-grabbing ${drag === q.id ? 'opacity-50' : ''}`}>
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium">{q.name}</p>
                        <Pill className="bg-[#f2eee5] !px-2 !py-0.5 text-[.65rem] text-[#5d6865]">{t(sourceLabel[q.source])}</Pill>
                      </div>
                      <p className="mt-1 text-xs text-[#5d6865]">{t(procLabel[q.procedure])} · {t(branchLabel[q.branch])}</p>
                      {q.message && <p className="mt-2 line-clamp-2 text-xs text-[#3b4744]">{q.message}</p>}
                      <div className="mt-3 flex items-center gap-1 border-t border-[#f2eee5] pt-2">
                        <a href={`https://wa.me/${q.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="rounded-lg p-1.5 text-[#13917f] hover:bg-[#eef7f5]" aria-label="WhatsApp"><MessageCircle className="size-4" /></a>
                        {q.stage !== 'booked' && <button onClick={() => setConvert(q.id)} className="rounded-lg p-1.5 text-[#14302f] hover:bg-[#f2eee5]" aria-label="Book"><CalendarCheck className="size-4" /></button>}
                        <select value={q.stage} onChange={e => actions.moveInquiry(q.id, e.target.value as InquiryStage)} className="ms-auto !w-auto !border-0 !bg-transparent !p-0 text-[.7rem] text-[#5d6865]" aria-label="Stage">
                          {stageOrder.map(x => <option key={x} value={x}>{t(stageLabel[x])}</option>)}
                        </select>
                        <button onClick={() => actions.deleteInquiry(q.id)} className="rounded-lg p-1.5 text-[#9aa29f] hover:text-rose-700" aria-label="Delete"><Trash2 className="size-3.5" /></button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <Card className="mt-2 !bg-[#14302f] !border-0 text-ivory">
        <p className="text-sm text-ivory/80">{t(tr('القاعدة: رد خلال 15 دقيقة، وسؤال «أنهي فرع أقرب؟»، ومتابعة بعد 24 و72 ساعة لأي حد سأل ومحجزش.', 'Rule: reply within 15 minutes, ask "which branch is closer?", and follow up at 24 and 72 hours with anyone who asked but did not book.'))}</p>
      </Card>

      <Modal open={!!convert} onClose={() => setConvert(null)} title={t(tr('تحويل لحجز كشف', 'Convert to consultation'))}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t(tr('التاريخ', 'Date'))}><input type="date" value={when.date} onChange={e => setWhen({ ...when, date: e.target.value })} /></Field>
          <Field label={t(tr('الساعة', 'Time'))}><input type="time" value={when.time} onChange={e => setWhen({ ...when, time: e.target.value })} /></Field>
          <div className="flex justify-end gap-2 sm:col-span-2">
            <Btn variant="ghost" onClick={() => setConvert(null)}>{t(tr('إلغاء', 'Cancel'))}</Btn>
            <Btn onClick={() => { if (convert) actions.convertInquiry(convert, when.date, when.time); setConvert(null) }}>{t(tr('احجز', 'Book'))}</Btn>
          </div>
        </div>
      </Modal>

      <Modal open={adding} onClose={() => setAdding(false)} title={t(tr('استفسار جديد', 'New inquiry'))}>
        <form onSubmit={e => { e.preventDefault(); actions.addInquiry(nf); setAdding(false); setNf({ ...nf, name: '', phone: '', message: '' }) }} className="grid gap-4 sm:grid-cols-2">
          <Field label={t(tr('الاسم', 'Name'))}><input required value={nf.name} onChange={e => setNf({ ...nf, name: e.target.value })} /></Field>
          <Field label={t(tr('الموبايل', 'Phone'))}><input required dir="ltr" value={nf.phone} onChange={e => setNf({ ...nf, phone: e.target.value })} /></Field>
          <Field label={t(tr('الفرع', 'Branch'))}>
            <select value={nf.branch} onChange={e => setNf({ ...nf, branch: e.target.value as BranchId })}>
              {(Object.keys(branchLabel) as BranchId[]).map(b => <option key={b} value={b}>{t(branchLabel[b])}</option>)}
            </select>
          </Field>
          <Field label={t(tr('المصدر', 'Source'))}>
            <select value={nf.source} onChange={e => setNf({ ...nf, source: e.target.value as Source })}>
              {(Object.keys(sourceLabel) as Source[]).map(s => <option key={s} value={s}>{t(sourceLabel[s])}</option>)}
            </select>
          </Field>
          <div className="sm:col-span-2"><Field label={t(tr('الإجراء', 'Procedure'))}>
            <select value={nf.procedure} onChange={e => setNf({ ...nf, procedure: e.target.value as ProcedureId })}>
              {procOrder.map(p => <option key={p} value={p}>{t(procLabel[p])}</option>)}
            </select>
          </Field></div>
          <div className="sm:col-span-2"><Field label={t(tr('الرسالة', 'Message'))}><textarea rows={2} value={nf.message} onChange={e => setNf({ ...nf, message: e.target.value })} /></Field></div>
          <div className="flex justify-end gap-2 sm:col-span-2">
            <Btn type="button" variant="ghost" onClick={() => setAdding(false)}>{t(tr('إلغاء', 'Cancel'))}</Btn>
            <Btn type="submit">{t(tr('حفظ', 'Save'))}</Btn>
          </div>
        </form>
      </Modal>
    </>
  )
}
