import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Plus } from 'lucide-react'
import { useI18n } from '../../lib/i18n'
import { cms, uid, useContent, type CmsSurgery, type QA } from '../../lib/content'
import { Btn, Card, Field, Modal, PageTitle } from '../ui'
import { tr } from '../labels'
import { DemoNote, emptyL, ImagePicker, LInput, ListEditor, RowActions, StatusPill } from './kit'

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || uid()

export const newQA = (): QA => ({ id: uid(), q: emptyL(), a: emptyL(), enabled: true })

function blank(): CmsSurgery {
  return {
    id: uid(), slug: '', index: '', enabled: false, image: null, video: '', tone: '#2f6fd1',
    name: emptyL(), short: emptyL(), hero: emptyL(), what: emptyL(),
    signs: [], approach: [], steps: [], faqs: [],
  }
}

/** FAQ list editor reused for procedure FAQs. */
export function QAEditor({ items, onChange }: { items: QA[]; onChange: (v: QA[]) => void }) {
  const { t } = useI18n()
  return (
    <ListEditor label={t(tr('أسئلة شائعة', 'FAQs'))} items={items} onChange={onChange} make={newQA}
      render={(f, set) => (
        <div className="space-y-2">
          <LInput label={t(tr('السؤال', 'Question'))} value={f.q} onChange={q => set({ ...f, q })} />
          <LInput label={t(tr('الإجابة', 'Answer'))} value={f.a} onChange={a => set({ ...f, a })} area rows={2} />
          <label className="flex items-center gap-2 text-xs text-[#5e6a7a]"><input type="checkbox" className="!w-auto" checked={f.enabled} onChange={e => set({ ...f, enabled: e.target.checked })} />{t(tr('ظاهر على الموقع', 'Shown on site'))}</label>
        </div>
      )} />
  )
}

function Editor({ value, onClose }: { value: CmsSurgery; onClose: () => void }) {
  const { t } = useI18n()
  const [s, setS] = useState(value)
  const all = useContent(d => d.surgeries)
  const isNew = !all.some(x => x.id === s.id)
  const set = (p: Partial<CmsSurgery>) => setS(prev => ({ ...prev, ...p }))
  const [err, setErr] = useState('')
  const save = () => {
    if (!s.name.ar.trim() && !s.name.en.trim()) { setErr(t(tr('اكتب اسم العملية.', 'Enter the procedure name.'))); return }
    const slug = s.slug.trim() ? slugify(s.slug) : slugify(s.name.en || s.name.ar)
    if (all.some(x => x.slug === slug && x.id !== s.id)) { setErr(t(tr('الرابط ده مستخدم لعملية تانية.', 'That link is already used by another procedure.'))); return }
    cms.upsert('surgeries', { ...s, slug, hero: s.hero.ar || s.hero.en ? s.hero : s.name })
    onClose()
  }
  return (
    <div className="space-y-5">
      <LInput label={t(tr('اسم العملية', 'Procedure name'))} value={s.name} onChange={name => set({ name })} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={t(tr('الرابط (إنجليزي)', 'URL slug'))}><input dir="ltr" value={s.slug} placeholder="e.g. umbilical-hernia" onChange={e => set({ slug: e.target.value })} /></Field>
        <Field label={t(tr('فيديو يوتيوب (ID أو رابط)', 'YouTube video (ID or link)'))}>
          <input dir="ltr" value={s.video} placeholder="dQw4w9WgXcQ" onChange={e => {
            const v = e.target.value.trim(); const m = v.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{6,})/); set({ video: m ? m[1] : v })
          }} />
        </Field>
      </div>
      <ImagePicker label={t(tr('صورة الغلاف', 'Cover image'))} value={s.image} onChange={image => set({ image })}
        hint={t(tr('استخدم رسومات مش صور أطفال للحالات الحساسة.', 'Use illustrations, not photos of children, for sensitive conditions.'))} />
      <LInput label={t(tr('وصف قصير', 'Short description'))} value={s.short} onChange={short => set({ short })} area rows={2} />
      <LInput label={t(tr('عنوان الصفحة', 'Page headline'))} value={s.hero} onChange={hero => set({ hero })} />
      <LInput label={t(tr('الشرح', 'Explanation'))} value={s.what} onChange={what => set({ what })} area rows={4} />
      <ListEditor label={t(tr('النقط اللي بتتشرح في الكشف', 'Topics explained at the consultation'))} items={s.signs} onChange={signs => set({ signs })} make={emptyL}
        render={(v, setV) => <LInput label="" value={v} onChange={setV} />} />
      <ListEditor label={t(tr('اللي هتلاقيه معانا', 'What you can expect'))} items={s.approach} onChange={approach => set({ approach })} make={emptyL}
        render={(v, setV) => <LInput label="" value={v} onChange={setV} />} />
      <ListEditor label={t(tr('الخطوات', 'Steps'))} items={s.steps} onChange={steps => set({ steps })} make={() => ({ t: emptyL(), d: emptyL() })}
        render={(v, setV) => (
          <div className="space-y-2">
            <LInput label={t(tr('العنوان', 'Title'))} value={v.t} onChange={x => setV({ ...v, t: x })} />
            <LInput label={t(tr('التفاصيل', 'Detail'))} value={v.d} onChange={x => setV({ ...v, d: x })} />
          </div>
        )} />
      <QAEditor items={s.faqs} onChange={faqs => set({ faqs })} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="!w-auto" checked={s.enabled} onChange={e => set({ enabled: e.target.checked })} />{t(tr('ظاهرة على الموقع', 'Shown on the website'))}</label>
      {err && <p className="text-sm text-rose-700">{err}</p>}
      <div className="sticky bottom-0 -mx-6 -mb-6 flex justify-end gap-2 border-t border-[#e1e7ec] bg-white px-6 py-4">
        <Btn type="button" variant="ghost" onClick={onClose}>{t(tr('إلغاء', 'Cancel'))}</Btn>
        <Btn type="button" onClick={save}>{t(isNew ? tr('إضافة العملية', 'Add procedure') : tr('حفظ', 'Save'))}</Btn>
      </div>
    </div>
  )
}

export default function ContentProcedures() {
  const { t } = useI18n()
  const list = useContent(d => d.surgeries)
  const [edit, setEdit] = useState<CmsSurgery | null>(null)
  return (
    <>
      <PageTitle title={t(tr('العمليات', 'Procedures'))} sub={t(tr(`${list.length} عملية · ${list.filter(s => s.enabled).length} ظاهرة على الموقع`, `${list.length} procedures · ${list.filter(s => s.enabled).length} live`))}
        action={<Btn onClick={() => setEdit(blank())}><Plus className="size-4" />{t(tr('عملية جديدة', 'New procedure'))}</Btn>} />
      <DemoNote />
      <Card>
        <ul className="divide-y divide-[#eef2f5]">
          {list.map(s => (
            <li key={s.id} className="flex flex-wrap items-center gap-4 py-3">
              <span className="w-8 font-latin text-sm text-[#98a2ac]">{s.index}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><span className="truncate font-medium">{t(s.name)}</span><StatusPill on={s.enabled} /></div>
                <p className="truncate text-xs text-[#5e6a7a]">{t(s.short)}</p>
              </div>
              <Link to={`/procedures/${s.slug}`} target="_blank" className="text-[#98a2ac] hover:text-[#2f6fd1]" title="Open"><ExternalLink className="size-4" /></Link>
              <RowActions enabled={s.enabled} onToggle={() => cms.toggle('surgeries', s.id)} onUp={() => cms.move('surgeries', s.id, -1)} onDown={() => cms.move('surgeries', s.id, 1)}
                onEdit={() => setEdit(s)} onDelete={() => cms.remove('surgeries', s.id)} />
            </li>
          ))}
        </ul>
      </Card>
      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit && list.some(x => x.id === edit.id) ? t(edit.name) : t(tr('عملية جديدة', 'New procedure'))} wide>
        {edit && <Editor key={edit.id} value={edit} onClose={() => setEdit(null)} />}
      </Modal>
    </>
  )
}
