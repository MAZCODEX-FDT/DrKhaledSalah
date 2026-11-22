import { useRef, useState } from 'react'
import { Upload, Trash2, ImagePlus } from 'lucide-react'
import { useI18n } from '../../lib/i18n'
import { cms, useContent, type MediaItem } from '../../lib/content'
import { Btn, Card, Modal, PageTitle } from '../ui'
import { tr } from '../labels'
import { DemoNote, LInput, Toggle, useUpload } from './kit'

export default function ContentMedia() {
  const { t } = useI18n()
  const db = useContent(d => d)
  const file = useRef<HTMLInputElement>(null)
  const { upload, busy, error } = useUpload()
  const [edit, setEdit] = useState<MediaItem | null>(null)
  const usedBy = (id: string) => [
    ...db.surgeries.filter(s => s.image === id).map(s => t(s.name)),
    ...db.branches.filter(b => b.image === id).map(b => t(b.name)),
    ...(db.doctor.portrait === id ? [t(tr('صورة الدكتور', 'Doctor portrait'))] : []),
    ...(db.doctor.heroImage === id ? [t(tr('البانر الرئيسي', 'Home banner'))] : []),
    ...(db.doctor.aboutImage === id ? [t(tr('صفحة الدكتور', 'About page'))] : []),
  ]
  const stockCount = db.media.filter(m => m.stock).length
  const kb = Math.round(new Blob([JSON.stringify(db.media)]).size / 1024)
  return (
    <>
      <PageTitle title={t(tr('مكتبة الصور', 'Image library'))} sub={t(tr(`${db.media.length} صورة · ${kb} ك.ب`, `${db.media.length} images · ${kb} KB`))}
        action={<Btn onClick={() => file.current?.click()} disabled={busy}><Upload className="size-4" />{t(busy ? tr('جاري الرفع…', 'Uploading…') : tr('رفع صور', 'Upload images'))}</Btn>} />
      <input ref={file} type="file" accept="image/*" multiple hidden onChange={async e => { await upload(e.target.files); e.target.value = '' }} />
      <DemoNote />
      {error && <p className="mb-4 text-sm text-rose-700">{error}</p>}
      <Card className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">{t(tr('صور تجريبية', 'Sample photos'))}</h3>
            <p className="mt-1 max-w-2xl text-sm text-[#5e6a7a]">{t(tr(`صور مجانية من Unsplash (من غير وشوش أطفال) عشان تتخيلوا شكل الموقع النهائي. بتتحط في البانر وصفحة الدكتور والفروع والعمليات اللي مالهاش صورة. ${stockCount ? `موجود دلوقتي ${stockCount} صورة.` : ''}`, `Free Unsplash photos (no children's faces) to preview the finished site. They fill the banner, About page, branches and any procedure without a photo. ${stockCount ? `${stockCount} in the library now.` : ''}`))}</p>
          </div>
          <div className="flex gap-2">
            <Btn variant="ghost" onClick={() => cms.addStock()}><ImagePlus className="size-4" />{t(tr('حط الصور التجريبية', 'Add sample photos'))}</Btn>
            {stockCount > 0 && <Btn variant="ghost" onClick={() => cms.removeStock()}><Trash2 className="size-4" />{t(tr('امسح الصور التجريبية', 'Remove sample photos'))}</Btn>}
          </div>
        </div>
      </Card>
      <p className="mb-4 text-xs text-[#5e6a7a]">{t(tr('ممنوع صور وشوش أطفال من غير موافقة مكتوبة من الأهل، والحالات الحساسة برسومات بس.', 'No children\'s faces without written parental consent, and sensitive cases as illustrations only.'))}</p>
      {db.media.length === 0 ? (
        <Card><button onClick={() => file.current?.click()} className="flex w-full flex-col items-center gap-3 py-14 text-[#5e6a7a]"><Upload className="size-8" />{t(tr('ارفع أول صورة', 'Upload your first image'))}</button></Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {db.media.map(m => {
            const used = usedBy(m.id)
            return (
              <div key={m.id} className="dash-card overflow-hidden !rounded-2xl">
                <button onClick={() => setEdit(m)} className="block aspect-[4/3] w-full overflow-hidden bg-[#eef2f5]"><img src={m.src} alt={t(m.alt)} className={`size-full object-cover ${m.enabled ? '' : 'opacity-40 grayscale'}`} /></button>
                <div className="space-y-2 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">{m.name}{m.stock && <span className="ms-1.5 rounded-full bg-[#fff4d6] px-1.5 py-0.5 text-[10px] text-[#163e7a]">Unsplash</span>}</span>
                    <Toggle on={m.enabled} onClick={() => cms.toggle('media', m.id)} />
                  </div>
                  <p className="truncate text-xs text-[#98a2ac]">{used.length ? used.join(' · ') : t(tr('مش مستخدمة', 'Not used yet'))}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.name ?? ''}>
        {edit && (
          <div className="space-y-4">
            <img src={edit.src} alt="" className="max-h-72 w-full rounded-xl object-contain bg-[#eef2f5]" />
            <label className="block space-y-1.5"><span className="text-xs font-medium text-[#5e6a7a]">{t(tr('الاسم', 'Name'))}</span><input value={edit.name} onChange={e => setEdit({ ...edit, name: e.target.value })} /></label>
            <LInput label={t(tr('وصف الصورة (للقارئ الصوتي وجوجل)', 'Alt text (screen readers and Google)'))} value={edit.alt} onChange={alt => setEdit({ ...edit, alt })} />
            {usedBy(edit.id).length > 0 && <p className="text-xs text-[#5e6a7a]">{t(tr('مستخدمة في: ', 'Used in: '))}{usedBy(edit.id).join(' · ')}</p>}
            <div className="flex items-center justify-between gap-2">
              <Btn variant="ghost" className="!text-rose-700" onClick={() => { cms.remove('media', edit.id); setEdit(null) }}><Trash2 className="size-4" />{t(tr('حذف الصورة', 'Delete image'))}</Btn>
              <div className="flex gap-2">
                <Btn variant="ghost" onClick={() => setEdit(null)}>{t(tr('إلغاء', 'Cancel'))}</Btn>
                <Btn onClick={() => { cms.upsert('media', edit); setEdit(null) }}>{t(tr('حفظ', 'Save'))}</Btn>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
