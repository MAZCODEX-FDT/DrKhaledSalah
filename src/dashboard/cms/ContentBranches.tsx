import { useState } from 'react'
import { Plus, Star } from 'lucide-react'
import { useI18n } from '../../lib/i18n'
import { cms, uid, useContent, type CmsBranch } from '../../lib/content'
import { Btn, Card, Field, Modal, PageTitle } from '../ui'
import { tr } from '../labels'
import { DemoNote, emptyL, ImagePicker, LInput, RowActions, StatusPill } from './kit'

const blank = (): CmsBranch => ({
  id: uid(), primary: false, enabled: true, image: null, whatsapp: '', phone: '', map: '', lat: 0, lng: 0,
  name: emptyL(), area: emptyL(), address: emptyL(), hours: emptyL(), serves: emptyL(),
})

export default function ContentBranches() {
  const { t } = useI18n()
  const list = useContent(d => d.branches)
  const [edit, setEdit] = useState<CmsBranch | null>(null)
  const set = (p: Partial<CmsBranch>) => setEdit(e => (e ? { ...e, ...p } : e))
  return (
    <>
      <PageTitle title={t(tr('الفروع', 'Branches'))} sub={t(tr('الفرع الرئيسي بيظهر الأول وزرار الحجز بتاعه أصفر.', 'The main branch is listed first with the yellow booking button.'))}
        action={<Btn onClick={() => setEdit(blank())}><Plus className="size-4" />{t(tr('فرع جديد', 'New branch'))}</Btn>} />
      <DemoNote />
      <Card>
        <ul className="divide-y divide-[#eef2f5]">
          {list.map(b => (
            <li key={b.id} className="flex flex-wrap items-center gap-4 py-3">
              <button title={t(tr('اجعله الفرع الرئيسي', 'Make main branch'))} onClick={() => cms.setPrimaryBranch(b.id)}
                className={`flex size-8 items-center justify-center rounded-lg ${b.primary ? 'bg-[#ffc83d] text-[#163e7a]' : 'text-[#cfd8e1] hover:text-[#ffc83d]'}`}><Star className="size-4 fill-current" /></button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><span className="font-medium">{t(b.name)}</span><StatusPill on={b.enabled} /></div>
                <p className="truncate text-xs text-[#5e6a7a]">{t(b.address)} · <span dir="ltr">{b.phone}</span></p>
              </div>
              <RowActions enabled={b.enabled} onToggle={() => cms.toggle('branches', b.id)} onUp={() => cms.move('branches', b.id, -1)} onDown={() => cms.move('branches', b.id, 1)}
                onEdit={() => setEdit(b)} onDelete={() => cms.remove('branches', b.id)} />
            </li>
          ))}
        </ul>
      </Card>
      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit ? t(edit.name) || t(tr('فرع جديد', 'New branch')) : ''} wide>
        {edit && (
          <div className="space-y-4">
            <LInput label={t(tr('اسم الفرع', 'Branch name'))} value={edit.name} onChange={name => set({ name })} />
            <LInput label={t(tr('المنطقة', 'Area'))} value={edit.area} onChange={area => set({ area })} />
            <LInput label={t(tr('العنوان', 'Address'))} value={edit.address} onChange={address => set({ address })} />
            <LInput label={t(tr('المواعيد', 'Hours'))} value={edit.hours} onChange={hours => set({ hours })} />
            <LInput label={t(tr('المناطق القريبة', 'Nearby areas'))} value={edit.serves} onChange={serves => set({ serves })} />
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label={t(tr('رقم واتساب (بالكود الدولي)', 'WhatsApp (international, digits)'))}><input dir="ltr" value={edit.whatsapp} placeholder="2010…" onChange={e => set({ whatsapp: e.target.value.replace(/\D/g, '') })} /></Field>
              <Field label={t(tr('رقم التليفون', 'Phone'))}><input dir="ltr" value={edit.phone} onChange={e => set({ phone: e.target.value })} /></Field>
              <Field label={t(tr('رابط الخريطة', 'Map link'))}><input dir="ltr" value={edit.map} onChange={e => set({ map: e.target.value })} /></Field>
            </div>
            <Field label={t(tr('الإحداثيات (لاختيار أقرب فرع للزائر) · خط العرض، خط الطول', 'Coordinates (to suggest the nearest branch) · latitude, longitude'))}>
              <input dir="ltr" value={edit.lat || edit.lng ? `${edit.lat}, ${edit.lng}` : ''} placeholder="30.0074, 31.4913" onChange={e => { const [a, b] = e.target.value.split(',').map(x => parseFloat(x)); set({ lat: isNaN(a) ? 0 : a, lng: isNaN(b) ? 0 : b }) }} />
            </Field>
            <ImagePicker label={t(tr('صورة الفرع', 'Branch photo'))} value={edit.image} onChange={image => set({ image })} />
            <div className="flex justify-end gap-2">
              <Btn variant="ghost" onClick={() => setEdit(null)}>{t(tr('إلغاء', 'Cancel'))}</Btn>
              <Btn onClick={() => { cms.upsert('branches', edit); setEdit(null) }}>{t(tr('حفظ', 'Save'))}</Btn>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
