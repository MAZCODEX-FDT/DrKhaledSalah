import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useI18n } from '../../lib/i18n'
import { cms, uid, useContent, type FaqCategory, type QA } from '../../lib/content'
import { Btn, Card, Field, Modal, PageTitle } from '../ui'
import { tr } from '../labels'
import { DemoNote, emptyL, LInput, RowActions, StatusPill } from './kit'
import { newQA } from './ContentProcedures'

export default function ContentFaqs() {
  const { t } = useI18n()
  const list = useContent(d => d.faqs)
  const cats = useContent(d => d.faqCategories)
  const [filter, setFilter] = useState<string>('all')
  const [edit, setEdit] = useState<QA | null>(null)
  const [cat, setCat] = useState<FaqCategory | null>(null)
  const catName = (id?: string) => { const c = cats.find(x => x.id === id); return c ? t(c.name) : t(tr('بدون تصنيف', 'Uncategorised')) }
  const shown = filter === 'all' ? list : list.filter(f => (filter === 'none' ? !cats.some(c => c.id === f.category) : f.category === filter))
  return (
    <>
      <PageTitle title={t(tr('أسئلة الأهالي', 'Parents\' questions'))}
        sub={t(tr('الأسئلة العامة متقسمة لتصنيفات. أسئلة كل عملية بتظهر تحت اسمها تلقائيًا، وبتتعدل من صفحة العمليات.', 'General questions are grouped by category. Each procedure\'s questions appear under its name automatically and are edited on the Procedures page.'))}
        action={<Btn onClick={() => setEdit({ ...newQA(), category: filter !== 'all' && filter !== 'none' ? filter : cats[0]?.id })}><Plus className="size-4" />{t(tr('سؤال جديد', 'New question'))}</Btn>} />
      <DemoNote />
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <Card>
          <div className="mb-4 flex flex-wrap gap-2">
            {[{ id: 'all', label: t(tr('الكل', 'All')) }, ...cats.map(c => ({ id: c.id, label: t(c.name) })), { id: 'none', label: t(tr('بدون تصنيف', 'Uncategorised')) }].map(x => (
              <button key={x.id} onClick={() => setFilter(x.id)} className={`rounded-full px-3 py-1.5 text-xs font-medium ${filter === x.id ? 'bg-[#163e7a] text-white' : 'bg-[#eef2f5] text-[#5e6a7a]'}`}>{x.label}</button>
            ))}
          </div>
          <ul className="divide-y divide-[#eef2f5]">
            {shown.map(f => (
              <li key={f.id} className="flex flex-wrap items-center gap-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><span className="font-medium">{t(f.q)}</span><StatusPill on={f.enabled} /><span className="rounded-full bg-[#fff4d6] px-2 py-0.5 text-[.7rem] text-[#5e4a12]">{catName(f.category)}</span></div>
                  <p className="line-clamp-1 text-xs text-[#5e6a7a]">{t(f.a)}</p>
                </div>
                <RowActions enabled={f.enabled} onToggle={() => cms.toggle('faqs', f.id)} onUp={() => cms.move('faqs', f.id, -1)} onDown={() => cms.move('faqs', f.id, 1)}
                  onEdit={() => setEdit(f)} onDelete={() => cms.remove('faqs', f.id)} />
              </li>
            ))}
            {shown.length === 0 && <li className="py-6 text-sm text-[#5e6a7a]">{t(tr('مفيش أسئلة هنا.', 'No questions here.'))}</li>}
          </ul>
        </Card>
        <Card title={t(tr('التصنيفات', 'Categories'))} action={<button onClick={() => setCat({ id: uid(), name: emptyL(), enabled: true })} className="flex items-center gap-1 text-xs font-medium text-[#2f6fd1]"><Plus className="size-3.5" />{t(tr('إضافة', 'Add'))}</button>}>
          <ul className="divide-y divide-[#eef2f5]">
            {cats.map(c => (
              <li key={c.id} className="flex flex-wrap items-center gap-2 py-2.5">
                <span className="min-w-0 flex-1 text-sm font-medium">{t(c.name)} <span className="text-xs text-[#98a2ac]">({list.filter(f => f.category === c.id).length})</span></span>
                <RowActions enabled={c.enabled} onToggle={() => cms.toggle('faqCategories', c.id)} onUp={() => cms.move('faqCategories', c.id, -1)} onDown={() => cms.move('faqCategories', c.id, 1)}
                  onEdit={() => setCat(c)} onDelete={() => cms.remove('faqCategories', c.id)} />
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-[#98a2ac]">{t(tr('حذف تصنيف مش بيحذف أسئلته، بيخليها "بدون تصنيف".', 'Deleting a category keeps its questions as "Uncategorised".'))}</p>
        </Card>
      </div>
      <Modal open={!!edit} onClose={() => setEdit(null)} title={t(tr('السؤال', 'Question'))} wide>
        {edit && (
          <div className="space-y-4">
            <Field label={t(tr('التصنيف', 'Category'))}>
              <select value={edit.category ?? ''} onChange={e => setEdit({ ...edit, category: e.target.value || undefined })}>
                <option value="">{t(tr('بدون تصنيف', 'Uncategorised'))}</option>
                {cats.map(c => <option key={c.id} value={c.id}>{t(c.name)}</option>)}
              </select>
            </Field>
            <LInput label={t(tr('السؤال', 'Question'))} value={edit.q} onChange={q => setEdit({ ...edit, q })} />
            <LInput label={t(tr('الإجابة', 'Answer'))} value={edit.a} onChange={a => setEdit({ ...edit, a })} area rows={4} />
            <div className="flex justify-end gap-2">
              <Btn variant="ghost" onClick={() => setEdit(null)}>{t(tr('إلغاء', 'Cancel'))}</Btn>
              <Btn onClick={() => { cms.upsert('faqs', edit); setEdit(null) }}>{t(tr('حفظ', 'Save'))}</Btn>
            </div>
          </div>
        )}
      </Modal>
      <Modal open={!!cat} onClose={() => setCat(null)} title={t(tr('تصنيف', 'Category'))}>
        {cat && (
          <div className="space-y-4">
            <LInput label={t(tr('اسم التصنيف', 'Category name'))} value={cat.name} onChange={name => setCat({ ...cat, name })} />
            <div className="flex justify-end gap-2">
              <Btn variant="ghost" onClick={() => setCat(null)}>{t(tr('إلغاء', 'Cancel'))}</Btn>
              <Btn onClick={() => { cms.upsert('faqCategories', cat); setCat(null) }}>{t(tr('حفظ', 'Save'))}</Btn>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
