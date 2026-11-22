import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useI18n } from '../../lib/i18n'
import { cms, useContent, type QA } from '../../lib/content'
import { Btn, Card, Modal, PageTitle } from '../ui'
import { tr } from '../labels'
import { DemoNote, LInput, RowActions, StatusPill } from './kit'
import { newQA } from './ContentProcedures'

export default function ContentFaqs() {
  const { t } = useI18n()
  const list = useContent(d => d.faqs)
  const [edit, setEdit] = useState<QA | null>(null)
  return (
    <>
      <PageTitle title={t(tr('أسئلة الأهالي', 'Parents\' questions'))}
        sub={t(tr('الأسئلة العامة عن الحجز والزيارة. أسئلة كل عملية بتتعدل من صفحة العمليات.', 'General booking and visit questions. Each procedure\'s questions are edited on the Procedures page.'))}
        action={<Btn onClick={() => setEdit(newQA())}><Plus className="size-4" />{t(tr('سؤال جديد', 'New question'))}</Btn>} />
      <DemoNote />
      <Card>
        <ul className="divide-y divide-[#eef2f5]">
          {list.map(f => (
            <li key={f.id} className="flex flex-wrap items-center gap-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><span className="font-medium">{t(f.q)}</span><StatusPill on={f.enabled} /></div>
                <p className="line-clamp-1 text-xs text-[#5e6a7a]">{t(f.a)}</p>
              </div>
              <RowActions enabled={f.enabled} onToggle={() => cms.toggle('faqs', f.id)} onUp={() => cms.move('faqs', f.id, -1)} onDown={() => cms.move('faqs', f.id, 1)}
                onEdit={() => setEdit(f)} onDelete={() => cms.remove('faqs', f.id)} />
            </li>
          ))}
        </ul>
      </Card>
      <Modal open={!!edit} onClose={() => setEdit(null)} title={t(tr('السؤال', 'Question'))} wide>
        {edit && (
          <div className="space-y-4">
            <LInput label={t(tr('السؤال', 'Question'))} value={edit.q} onChange={q => setEdit({ ...edit, q })} />
            <LInput label={t(tr('الإجابة', 'Answer'))} value={edit.a} onChange={a => setEdit({ ...edit, a })} area rows={4} />
            <div className="flex justify-end gap-2">
              <Btn variant="ghost" onClick={() => setEdit(null)}>{t(tr('إلغاء', 'Cancel'))}</Btn>
              <Btn onClick={() => { cms.upsert('faqs', edit); setEdit(null) }}>{t(tr('حفظ', 'Save'))}</Btn>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
