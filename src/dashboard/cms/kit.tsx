import { useRef, useState, type ReactNode } from 'react'
import { BACKEND } from '../../lib/api'
import { ArrowDown, ArrowUp, ImagePlus, Pencil, Plus, Trash2, Upload, X, Eye, EyeOff } from 'lucide-react'
import type { L } from '../../lib/i18n'
import { useI18n } from '../../lib/i18n'
import { cms, compressImage, StorageFullError, useContent, type MediaItem } from '../../lib/content'
import { Btn, Modal } from '../ui'
import { tr } from '../labels'

export const emptyL = (): L => ({ ar: '', en: '' })

/** Arabic + English inputs side by side. */
export function LInput({ label, value, onChange, area = false, rows = 3 }: { label: string; value: L; onChange: (v: L) => void; area?: boolean; rows?: number }) {
  const Tag = area ? 'textarea' : 'input'
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-[#5e6a7a]">{label}</span>
      <div className="grid gap-2 sm:grid-cols-2">
        <Tag dir="rtl" lang="ar" rows={area ? rows : undefined} placeholder="عربي" value={value.ar} onChange={e => onChange({ ...value, ar: e.target.value })} />
        <Tag dir="ltr" lang="en" rows={area ? rows : undefined} placeholder="English" value={value.en} onChange={e => onChange({ ...value, en: e.target.value })} />
      </div>
    </div>
  )
}

/** Editable list of items (add, remove, reorder). */
export function ListEditor<T>({ label, items, onChange, make, render }: {
  label: string; items: T[]; onChange: (v: T[]) => void; make: () => T; render: (item: T, set: (v: T) => void) => ReactNode
}) {
  const { t } = useI18n()
  const set = (i: number, v: T) => onChange(items.map((x, j) => (j === i ? v : x)))
  const mv = (i: number, d: -1 | 1) => { const j = i + d; if (j < 0 || j >= items.length) return; const n = [...items]; [n[i], n[j]] = [n[j], n[i]]; onChange(n) }
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#5e6a7a]">{label}</span>
        <button type="button" onClick={() => onChange([...items, make()])} className="flex items-center gap-1 text-xs font-medium text-[#2f6fd1] hover:underline"><Plus className="size-3.5" />{t(tr('إضافة', 'Add'))}</button>
      </div>
      {items.map((it, i) => (
        <div key={i} className="flex gap-2 rounded-xl border border-[#e1e7ec] bg-[#f5f8fc] p-2.5">
          <div className="min-w-0 flex-1">{render(it, v => set(i, v))}</div>
          <div className="flex flex-col gap-1">
            <IconBtn label="Up" onClick={() => mv(i, -1)}><ArrowUp className="size-3.5" /></IconBtn>
            <IconBtn label="Down" onClick={() => mv(i, 1)}><ArrowDown className="size-3.5" /></IconBtn>
            <IconBtn label="Remove" onClick={() => onChange(items.filter((_, j) => j !== i))}><X className="size-3.5" /></IconBtn>
          </div>
        </div>
      ))}
    </div>
  )
}

export function IconBtn({ children, label, onClick, className = '' }: { children: ReactNode; label: string; onClick: () => void; className?: string }) {
  return <button type="button" aria-label={label} title={label} onClick={onClick} className={`flex size-8 items-center justify-center rounded-lg text-[#5e6a7a] transition hover:bg-[#e3f2fb] hover:text-[#163e7a] ${className}`}>{children}</button>
}

/** Enabled / disabled switch. */
export function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  const { t } = useI18n()
  return (
    <button type="button" role="switch" aria-checked={on} onClick={onClick} title={t(on ? tr('ظاهر على الموقع', 'Shown on site') : tr('مخفي', 'Hidden'))}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? 'bg-[#2f6fd1]' : 'bg-[#cfd8e1]'}`}>
      <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${on ? 'start-[1.375rem]' : 'start-0.5'}`} />
    </button>
  )
}

/** Up/down, edit, show/hide and delete (with a second click to confirm). */
export function RowActions({ enabled, onToggle, onUp, onDown, onEdit, onDelete }: { enabled: boolean; onToggle: () => void; onUp: () => void; onDown: () => void; onEdit: () => void; onDelete: () => void }) {
  const { t } = useI18n()
  const [confirm, setConfirm] = useState(false)
  return (
    <div className="flex items-center gap-1">
      <Toggle on={enabled} onClick={onToggle} />
      <IconBtn label="Up" onClick={onUp}><ArrowUp className="size-4" /></IconBtn>
      <IconBtn label="Down" onClick={onDown}><ArrowDown className="size-4" /></IconBtn>
      <IconBtn label="Edit" onClick={onEdit}><Pencil className="size-4" /></IconBtn>
      {confirm ? (
        <button type="button" onClick={() => { setConfirm(false); onDelete() }} onBlur={() => setConfirm(false)} autoFocus
          className="rounded-lg bg-rose-600 px-2.5 py-1.5 text-xs font-medium text-white">{t(tr('تأكيد الحذف', 'Confirm delete'))}</button>
      ) : (
        <IconBtn label="Delete" onClick={() => setConfirm(true)} className="hover:!bg-rose-50 hover:!text-rose-700"><Trash2 className="size-4" /></IconBtn>
      )}
    </div>
  )
}

/** Upload files into the media library; returns the new items. */
export function useUpload() {
  const { t } = useI18n()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const upload = async (files: FileList | null): Promise<MediaItem[]> => {
    if (!files?.length) return []
    setBusy(true); setError('')
    const out: MediaItem[] = []
    try {
      for (const f of Array.from(files)) {
        const src = await compressImage(f)
        const name = f.name.replace(/\.[^.]+$/, '')
        out.push(cms.addMedia({ name, src, alt: { ar: name, en: name } }))
      }
    } catch (e) {
      setError(t(e instanceof StorageFullError
        ? tr('مساحة المتصفح امتلت. امسح صور قديمة من مكتبة الصور وجرّب تاني.', 'Browser storage is full. Delete old images from the library and try again.')
        : tr('الملف ده مش صورة.', 'That file is not an image.')))
    } finally { setBusy(false) }
    return out
  }
  return { upload, busy, error }
}

/** Pick an image for a slot: upload a new one or choose from the library. */
export function ImagePicker({ label, value, onChange, hint }: { label: string; value: string | null; onChange: (id: string | null) => void; hint?: string }) {
  const { t } = useI18n()
  const media = useContent(d => d.media)
  const current = media.find(m => m.id === value)
  const file = useRef<HTMLInputElement>(null)
  const [lib, setLib] = useState(false)
  const { upload, busy, error } = useUpload()
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-[#5e6a7a]">{label}</span>
      <div className="flex items-center gap-4 rounded-xl border border-dashed border-[#cfd8e1] bg-[#f5f8fc] p-3">
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
          {current ? <img src={current.src} alt="" className={`size-full object-cover ${current.enabled ? '' : 'opacity-40'}`} /> : <ImagePlus className="size-6 text-[#98a2ac]" />}
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn type="button" variant="ghost" onClick={() => file.current?.click()} disabled={busy}><Upload className="size-4" />{t(busy ? tr('جاري الرفع…', 'Uploading…') : tr('رفع صورة', 'Upload'))}</Btn>
          <Btn type="button" variant="ghost" onClick={() => setLib(true)}>{t(tr('من المكتبة', 'From library'))}</Btn>
          {value && <Btn type="button" variant="ghost" onClick={() => onChange(null)}><X className="size-4" />{t(tr('إزالة', 'Remove'))}</Btn>}
        </div>
        <input ref={file} type="file" accept="image/*" hidden onChange={async e => { const [m] = await upload(e.target.files); if (m) onChange(m.id); e.target.value = '' }} />
      </div>
      {current && !current.enabled && <p className="text-xs text-amber-700">{t(tr('الصورة دي متوقفة في المكتبة، فمش هتظهر على الموقع.', 'This image is disabled in the library, so it will not show on the site.'))}</p>}
      {hint && <p className="text-xs text-[#98a2ac]">{hint}</p>}
      {error && <p className="text-xs text-rose-700">{error}</p>}
      <Modal open={lib} onClose={() => setLib(false)} title={t(tr('اختار صورة', 'Choose an image'))} wide>
        {media.length === 0 ? <p className="text-sm text-[#5e6a7a]">{t(tr('المكتبة فاضية. ارفع صورة الأول.', 'The library is empty. Upload an image first.'))}</p> : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {media.map(m => (
              <button key={m.id} type="button" onClick={() => { onChange(m.id); setLib(false) }}
                className={`group relative aspect-square overflow-hidden rounded-xl ring-2 ${m.id === value ? 'ring-[#2f6fd1]' : 'ring-transparent hover:ring-[#7cc4ee]'}`}>
                <img src={m.src} alt="" className={`size-full object-cover ${m.enabled ? '' : 'opacity-40'}`} />
                {!m.enabled && <EyeOff className="absolute end-1.5 top-1.5 size-4 text-white drop-shadow" />}
              </button>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}

export function StatusPill({ on }: { on: boolean }) {
  const { t } = useI18n()
  return on
    ? <span className="inline-flex items-center gap-1 rounded-full bg-[#e3f2fb] px-2 py-0.5 text-[.7rem] font-medium text-[#163e7a]"><Eye className="size-3" />{t(tr('ظاهر', 'Live'))}</span>
    : <span className="inline-flex items-center gap-1 rounded-full bg-[#eef2f5] px-2 py-0.5 text-[.7rem] font-medium text-[#5e6a7a]"><EyeOff className="size-3" />{t(tr('مخفي', 'Hidden'))}</span>
}

export function DemoNote() {
  const { t } = useI18n()
  if (BACKEND) return null // live site: edits publish to every visitor
  return (
    <p className="mb-6 rounded-xl bg-[#fff4d6] px-4 py-3 text-xs leading-relaxed text-[#5e4a12]">
      {t(tr('نسخة عرض: التعديلات بتتحفظ في المتصفح ده بس. بعد ربط قاعدة البيانات قبل الإطلاق، أي تعديل هنا هيظهر لكل زوار الموقع.',
        'Demo build: edits are saved in this browser only. Once the database is connected before launch, every edit here will publish for all visitors.'))}
    </p>
  )
}
