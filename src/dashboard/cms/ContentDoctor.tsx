import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useI18n } from '../../lib/i18n'
import { cms, uid, useContent, type CmsDoctor, type CmsStat } from '../../lib/content'
import { Btn, Card, Field, Modal, PageTitle } from '../ui'
import { tr } from '../labels'
import { DemoNote, emptyL, ImagePicker, LInput, ListEditor, RowActions, StatusPill } from './kit'

export default function ContentDoctor() {
  const { t } = useI18n()
  const saved = useContent(d => d.doctor)
  const stats = useContent(d => d.stats)
  const [doc, setDoc] = useState<CmsDoctor>({ ...saved, highlights: saved.highlights ?? [], values: saved.values ?? [], timeline: saved.timeline ?? [] })
  const [done, setDone] = useState(false)
  const [stat, setStat] = useState<CmsStat | null>(null)
  const set = (p: Partial<CmsDoctor>) => { setDoc(d => ({ ...d, ...p })); setDone(false) }
  return (
    <>
      <PageTitle title={t(tr('عن الدكتور', 'About the doctor'))} sub={t(tr('الاسم والنبذة والصور اللي بتظهر في الصفحة الرئيسية وصفحة عن الدكتور.', 'Name, bio and photos shown on the home page and the About page.'))} />
      <DemoNote />
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card title={t(tr('البيانات', 'Details'))}>
          <div className="space-y-4">
            <LInput label={t(tr('الاسم', 'Name'))} value={doc.name} onChange={name => set({ name })} />
            <LInput label={t(tr('اللقب', 'Title'))} value={doc.title} onChange={title => set({ title })} />
            <p className="-mt-2 text-xs text-[#98a2ac]">{t(tr('اللقب المعتمد حاليًا: استشاري جراحة الأطفال وحديثي الولادة.', 'Approved title for now: Consultant of Pediatric & Neonatal Surgery.'))}</p>
            <LInput label={t(tr('الوعد', 'Promise'))} value={doc.promise} onChange={promise => set({ promise })} area rows={3} />
            <LInput label={t(tr('نبذة', 'Bio'))} value={doc.bio} onChange={bio => set({ bio })} area rows={4} />
            <LInput label={t(tr('اقتباس (صفحة عن الدكتور)', 'Quote (About page)'))} value={doc.quote} onChange={quote => set({ quote })} area rows={2} />
            <LInput label={t(tr('الحكاية (سطر فاضي بين كل فقرة)', 'Story (blank line between paragraphs)'))} value={doc.story} onChange={story => set({ story })} area rows={8} />
            <ListEditor label={t(tr('طريقة الشغل', 'How we work'))} items={doc.values} onChange={values => set({ values })} make={() => ({ t: emptyL(), d: emptyL() })}
              render={(v, setV) => (
                <div className="space-y-2">
                  <LInput label={t(tr('العنوان', 'Title'))} value={v.t} onChange={x => setV({ ...v, t: x })} />
                  <LInput label={t(tr('الوصف', 'Text'))} value={v.d} onChange={x => setV({ ...v, d: x })} />
                </div>
              )} />
            <ListEditor label={t(tr('المسيرة (المؤهلات والخبرة)', 'Career (qualifications and experience)'))} items={doc.timeline} onChange={timeline => set({ timeline })} make={() => ({ year: '', t: emptyL(), d: emptyL() })}
              render={(v, setV) => (
                <div className="space-y-2">
                  <Field label={t(tr('السنة', 'Year'))}><input dir="ltr" value={v.year} placeholder="2012" onChange={e => setV({ ...v, year: e.target.value })} /></Field>
                  <LInput label={t(tr('العنوان', 'Title'))} value={v.t} onChange={x => setV({ ...v, t: x })} />
                  <LInput label={t(tr('التفاصيل', 'Detail'))} value={v.d} onChange={x => setV({ ...v, d: x })} />
                </div>
              )} />
            <ListEditor label={t(tr('نقاط مميزة (قسم تعرّف على الدكتور)', 'Highlights (Meet the doctor section)'))} items={doc.highlights} onChange={highlights => set({ highlights })} make={emptyL}
              render={(v, setV) => <LInput label="" value={v} onChange={setV} />} />
            <div className="flex items-center justify-end gap-3">
              {done && <span className="text-sm text-[#2f6fd1]">{t(tr('اتحفظ', 'Saved'))}</span>}
              <Btn onClick={() => { cms.setDoctor(doc); setDone(true) }}>{t(tr('حفظ', 'Save'))}</Btn>
            </div>
          </div>
        </Card>
        <div className="space-y-6">
          <Card title={t(tr('الصور', 'Photos'))}>
            <div className="space-y-5">
              <ImagePicker label={t(tr('صورة الدكتور (دائرية)', 'Doctor portrait (circle)'))} value={saved.portrait} onChange={portrait => { cms.setDoctor({ portrait }); setDoc(d => ({ ...d, portrait })) }}
                hint={t(tr('صورة مربعة للدكتور بس، من غير أطفال.', 'A square photo of the doctor only, no children.'))} />
              <ImagePicker label={t(tr('صورة البانر الرئيسي', 'Home banner image'))} value={saved.heroImage} onChange={heroImage => { cms.setDoctor({ heroImage }); setDoc(d => ({ ...d, heroImage })) }}
                hint={t(tr('لو فاضية، البانر بيعرض نقشة KS Play.', 'If empty, the banner shows the KS Play pattern.'))} />
              <ImagePicker label={t(tr('صورة عريضة لصفحة عن الدكتور', 'Wide photo for the About page'))} value={saved.aboutImage ?? null} onChange={aboutImage => { cms.setDoctor({ aboutImage }); setDoc(d => ({ ...d, aboutImage })) }}
                hint={t(tr('مثلًا العيادة أو الدكتور في الكشف، من غير وشوش أطفال.', 'For example the clinic or the doctor at work, with no children\'s faces.'))} />
            </div>
          </Card>
          <Card title={t(tr('الأرقام', 'Numbers'))} action={<button onClick={() => setStat({ id: uid(), value: 0, suffix: '', label: emptyL(), enabled: true })} className="flex items-center gap-1 text-xs font-medium text-[#2f6fd1]"><Plus className="size-3.5" />{t(tr('إضافة', 'Add'))}</button>}>
            <ul className="divide-y divide-[#eef2f5]">
              {stats.map(s => (
                <li key={s.id} className="flex items-center gap-3 py-2.5">
                  <span className="w-16 font-latin font-semibold" dir="ltr">{s.value}{s.suffix}</span>
                  <span className="min-w-0 flex-1 truncate text-sm">{t(s.label)}</span>
                  <StatusPill on={s.enabled} />
                  <RowActions enabled={s.enabled} onToggle={() => cms.toggle('stats', s.id)} onUp={() => cms.move('stats', s.id, -1)} onDown={() => cms.move('stats', s.id, 1)}
                    onEdit={() => setStat(s)} onDelete={() => cms.remove('stats', s.id)} />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
      <Modal open={!!stat} onClose={() => setStat(null)} title={t(tr('رقم', 'Number'))}>
        {stat && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label={t(tr('الرقم', 'Value'))}><input type="number" dir="ltr" value={stat.value} onChange={e => setStat({ ...stat, value: Number(e.target.value) })} /></Field>
              <Field label={t(tr('بعد الرقم', 'Suffix'))}><input dir="ltr" value={stat.suffix} placeholder="+ % K" onChange={e => setStat({ ...stat, suffix: e.target.value })} /></Field>
            </div>
            <LInput label={t(tr('الوصف', 'Label'))} value={stat.label} onChange={label => setStat({ ...stat, label })} />
            <div className="flex justify-end gap-2">
              <Btn variant="ghost" onClick={() => setStat(null)}>{t(tr('إلغاء', 'Cancel'))}</Btn>
              <Btn onClick={() => { cms.upsert('stats', stat); setStat(null) }}>{t(tr('حفظ', 'Save'))}</Btn>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
