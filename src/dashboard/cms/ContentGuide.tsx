import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useI18n } from '../../lib/i18n'
import { cms, uid, useContent, type Article, type GuideSection } from '../../lib/content'
import { Btn, Card, Field, Modal, PageTitle } from '../ui'
import { tr } from '../labels'
import { DemoNote, emptyL, ImagePicker, LInput, RowActions, StatusPill } from './kit'

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 60)

/** "Before your visit" guide sections. */
export function ContentGuide() {
  const { t } = useI18n()
  const list = useContent(d => d.guide)
  const [edit, setEdit] = useState<GuideSection | null>(null)
  return (
    <>
      <PageTitle title={t(tr('دليل قبل الزيارة', 'Before your visit'))}
        sub={t(tr('الأقسام دي بتظهر في صفحة "قبل زيارتك" وفي الورقة اللي الأهل بيطبعوها أو بيحفظوها PDF. كل سطر = نقطة.', 'These sections appear on the "Before your visit" page and on the sheet parents print or save as PDF. One line = one point.'))}
        action={<Btn onClick={() => setEdit({ id: uid(), title: emptyL(), items: emptyL(), enabled: true })}><Plus className="size-4" />{t(tr('قسم جديد', 'New section'))}</Btn>} />
      <DemoNote />
      <Card>
        <ul className="divide-y divide-[#eef2f5]">
          {list.map(g => (
            <li key={g.id} className="flex flex-wrap items-center gap-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><span className="font-medium">{t(g.title)}</span><StatusPill on={g.enabled} /></div>
                <p className="line-clamp-1 text-xs text-[#5e6a7a]">{t(g.items).split('\n').filter(Boolean).length} {t(tr('نقط', 'points'))} · {t(g.items).split('\n')[0]}</p>
              </div>
              <RowActions enabled={g.enabled} onToggle={() => cms.toggle('guide', g.id)} onUp={() => cms.move('guide', g.id, -1)} onDown={() => cms.move('guide', g.id, 1)}
                onEdit={() => setEdit(g)} onDelete={() => cms.remove('guide', g.id)} />
            </li>
          ))}
        </ul>
      </Card>
      <Modal open={!!edit} onClose={() => setEdit(null)} title={t(tr('قسم في الدليل', 'Guide section'))} wide>
        {edit && (
          <div className="space-y-4">
            <LInput label={t(tr('العنوان', 'Title'))} value={edit.title} onChange={title => setEdit({ ...edit, title })} />
            <LInput label={t(tr('النقط (كل سطر نقطة)', 'Points (one per line)'))} value={edit.items} onChange={items => setEdit({ ...edit, items })} area rows={7} />
            <div className="flex justify-end gap-2">
              <Btn variant="ghost" onClick={() => setEdit(null)}>{t(tr('إلغاء', 'Cancel'))}</Btn>
              <Btn onClick={() => { cms.upsert('guide', edit); setEdit(null) }}>{t(tr('حفظ', 'Save'))}</Btn>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

/** Short articles for parents. */
export function ContentArticles() {
  const { t } = useI18n()
  const list = useContent(d => d.articles)
  const surgeries = useContent(d => d.surgeries)
  const [edit, setEdit] = useState<Article | null>(null)
  const taken = (a: Article) => list.some(x => x.id !== a.id && x.slug === a.slug)
  return (
    <>
      <PageTitle title={t(tr('المقالات', 'Articles'))}
        sub={t(tr('مقالات قصيرة بتجاوب على أسئلة الأهالي، وبتساعد الموقع يظهر في جوجل. المقال المربوط بعملية بيظهر في صفحتها.', 'Short articles answering parents\' questions, which help the site show up on Google. An article linked to a procedure also appears on its page.'))}
        action={<Btn onClick={() => setEdit({ id: uid(), slug: '', title: emptyL(), excerpt: emptyL(), body: emptyL(), image: null, procedure: '', date: new Date().toISOString().slice(0, 10), enabled: false })}><Plus className="size-4" />{t(tr('مقال جديد', 'New article'))}</Btn>} />
      <DemoNote />
      <Card>
        <ul className="divide-y divide-[#eef2f5]">
          {list.map(a => (
            <li key={a.id} className="flex flex-wrap items-center gap-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><span className="font-medium">{t(a.title)}</span><StatusPill on={a.enabled} />
                  {a.procedure && <span className="rounded-full bg-[#e3f2fb] px-2 py-0.5 text-[.7rem] text-[#163e7a]">{t(surgeries.find(s => s.slug === a.procedure)?.name ?? emptyL())}</span>}</div>
                <p className="line-clamp-1 text-xs text-[#5e6a7a]">{a.date} · /articles/{a.slug}</p>
              </div>
              <RowActions enabled={a.enabled} onToggle={() => cms.toggle('articles', a.id)} onUp={() => cms.move('articles', a.id, -1)} onDown={() => cms.move('articles', a.id, 1)}
                onEdit={() => setEdit(a)} onDelete={() => cms.remove('articles', a.id)} />
            </li>
          ))}
        </ul>
      </Card>
      <Modal open={!!edit} onClose={() => setEdit(null)} title={t(tr('المقال', 'Article'))} wide>
        {edit && (
          <div className="space-y-4">
            <LInput label={t(tr('العنوان', 'Title'))} value={edit.title} onChange={title => setEdit({ ...edit, title, slug: edit.slug || slugify(title.en) })} />
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label={t(tr('الرابط (إنجليزي)', 'Link (English)'))}>
                <input dir="ltr" value={edit.slug} onChange={e => setEdit({ ...edit, slug: slugify(e.target.value) })} placeholder="circumcision-timing" />
              </Field>
              <Field label={t(tr('العملية المرتبطة', 'Linked procedure'))}>
                <select value={edit.procedure} onChange={e => setEdit({ ...edit, procedure: e.target.value })}>
                  <option value="">{t(tr('بدون', 'None'))}</option>
                  {surgeries.map(s => <option key={s.slug} value={s.slug}>{t(s.name)}</option>)}
                </select>
              </Field>
              <Field label={t(tr('التاريخ', 'Date'))}><input type="date" value={edit.date} onChange={e => setEdit({ ...edit, date: e.target.value })} /></Field>
            </div>
            {taken(edit) && <p className="text-xs text-rose-600">{t(tr('الرابط ده مستخدم في مقال تاني.', 'This link is used by another article.'))}</p>}
            <LInput label={t(tr('ملخص قصير', 'Short summary'))} value={edit.excerpt} onChange={excerpt => setEdit({ ...edit, excerpt })} area rows={2} />
            <LInput label={t(tr('النص (سطر يبدأ بـ ## = عنوان فرعي، وسطر فاضي بين الفقرات)', 'Text (a line starting with ## is a heading; blank line between paragraphs)'))} value={edit.body} onChange={body => setEdit({ ...edit, body })} area rows={12} />
            <ImagePicker label={t(tr('صورة المقال (اختياري)', 'Article image (optional)'))} value={edit.image} onChange={image => setEdit({ ...edit, image })} />
            <div className="flex justify-end gap-2">
              <Btn variant="ghost" onClick={() => setEdit(null)}>{t(tr('إلغاء', 'Cancel'))}</Btn>
              <Btn disabled={!edit.slug || taken(edit)} onClick={() => { cms.upsert('articles', edit); setEdit(null) }}>{t(tr('حفظ', 'Save'))}</Btn>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
