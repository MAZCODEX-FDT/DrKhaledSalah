import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useI18n } from '../../lib/i18n'
import { cms, uid, useContent, type CmsContact, type Social, type SocialPlatform } from '../../lib/content'
import SocialIcon from '../../components/site/SocialIcon'
import { Btn, Card, Field, Modal, PageTitle } from '../ui'
import { tr } from '../labels'
import { DemoNote, RowActions, StatusPill, Toggle } from './kit'

const platforms: SocialPlatform[] = ['facebook', 'instagram', 'youtube', 'tiktok', 'whatsapp', 'google', 'x', 'linkedin', 'other']
const names: Record<SocialPlatform, string> = { facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube', tiktok: 'TikTok', whatsapp: 'WhatsApp', google: 'Google', x: 'X', linkedin: 'LinkedIn', other: 'Link' }

export default function ContentContact() {
  const { t } = useI18n()
  const saved = useContent(d => d.contact)
  const socials = useContent(d => d.socials)
  const [c, setC] = useState<CmsContact>(saved)
  const [done, setDone] = useState(false)
  const [edit, setEdit] = useState<Social | null>(null)
  const set = (p: Partial<CmsContact>) => { setC(x => ({ ...x, ...p })); setDone(false) }
  const row = (label: string, key: 'email' | 'website' | 'whatsapp', show: 'showEmail' | 'showWebsite' | 'showWhatsapp', placeholder: string) => (
    <div className="flex items-end gap-3">
      <div className="flex-1"><Field label={label}><input dir="ltr" value={c[key]} placeholder={placeholder} onChange={e => set({ [key]: key === 'whatsapp' ? e.target.value.replace(/\D/g, '') : e.target.value })} /></Field></div>
      <div className="pb-2"><Toggle on={c[show]} onClick={() => set({ [show]: !c[show] })} /></div>
    </div>
  )
  return (
    <>
      <PageTitle title={t(tr('تواصل معنا', 'Contact'))} sub={t(tr('الكروت والروابط اللي بتظهر في صفحة تواصل معنا والفوتر.', 'Cards and links shown on the Contact page and in the footer.'))} />
      <DemoNote />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title={t(tr('كروت التواصل', 'Contact cards'))}>
          <div className="space-y-4">
            {row(t(tr('رقم واتساب (بالكود الدولي)', 'WhatsApp (international, digits)')), 'whatsapp', 'showWhatsapp', '2010…')}
            {row(t(tr('البريد الإلكتروني', 'Email')), 'email', 'showEmail', 'info@…')}
            {row(t(tr('الموقع', 'Website')), 'website', 'showWebsite', 'drkhaledsalah.com')}
            <div className="flex items-center justify-end gap-3">
              {done && <span className="text-sm text-[#2f6fd1]">{t(tr('اتحفظ', 'Saved'))}</span>}
              <Btn onClick={() => { cms.setContact(c); setDone(true) }}>{t(tr('حفظ', 'Save'))}</Btn>
            </div>
          </div>
        </Card>
        <Card title={t(tr('روابط السوشيال ميديا', 'Social links'))}
          action={<button onClick={() => setEdit({ id: uid(), platform: 'facebook', label: 'Facebook', url: '', enabled: true })} className="flex items-center gap-1 text-xs font-medium text-[#2f6fd1]"><Plus className="size-3.5" />{t(tr('إضافة', 'Add'))}</button>}>
          <ul className="divide-y divide-[#eef2f5]">
            {socials.map(s => (
              <li key={s.id} className="flex flex-wrap items-center gap-3 py-2.5">
                <span className="flex size-9 items-center justify-center rounded-full bg-[#e3f2fb] text-[#163e7a]"><SocialIcon platform={s.platform} /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2"><span className="font-medium">{s.label}</span><StatusPill on={s.enabled} /></div>
                  <p className="truncate text-xs text-[#5e6a7a]" dir="ltr">{s.url || '—'}</p>
                </div>
                <RowActions enabled={s.enabled} onToggle={() => cms.toggle('socials', s.id)} onUp={() => cms.move('socials', s.id, -1)} onDown={() => cms.move('socials', s.id, 1)}
                  onEdit={() => setEdit(s)} onDelete={() => cms.remove('socials', s.id)} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Modal open={!!edit} onClose={() => setEdit(null)} title={t(tr('رابط', 'Link'))}>
        {edit && (
          <div className="space-y-4">
            <Field label={t(tr('المنصة', 'Platform'))}>
              <select value={edit.platform} onChange={e => { const p = e.target.value as SocialPlatform; setEdit({ ...edit, platform: p, label: edit.label === names[edit.platform] ? names[p] : edit.label }) }}>
                {platforms.map(p => <option key={p} value={p}>{names[p]}</option>)}
              </select>
            </Field>
            <Field label={t(tr('الاسم الظاهر', 'Label'))}><input value={edit.label} onChange={e => setEdit({ ...edit, label: e.target.value })} /></Field>
            <Field label={t(tr('الرابط', 'URL'))}><input dir="ltr" value={edit.url} placeholder="https://" onChange={e => setEdit({ ...edit, url: e.target.value })} /></Field>
            <div className="flex justify-end gap-2">
              <Btn variant="ghost" onClick={() => setEdit(null)}>{t(tr('إلغاء', 'Cancel'))}</Btn>
              <Btn onClick={() => { cms.upsert('socials', edit); setEdit(null) }}>{t(tr('حفظ', 'Save'))}</Btn>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
