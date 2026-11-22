import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useI18n, type L } from '../../lib/i18n'

export default function Faq({ items, light = false }: { items: { q: L; a: L }[]; light?: boolean }) {
  const { t } = useI18n()
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className={`border-t ${light ? 'hairline-dark' : 'hairline'}`}>
      {items.map((f, i) => {
        const on = open === i
        return (
          <div key={i} className={`border-b ${light ? 'hairline-dark' : 'hairline'}`}>
            <button onClick={() => setOpen(on ? null : i)} className="flex w-full items-center justify-between gap-6 py-7 text-start" aria-expanded={on}>
              <span className="font-display text-xl font-light sm:text-2xl">{t(f.q)}</span>
              <span className={`flex size-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${light ? 'hairline-dark' : 'hairline'} ${on ? 'rotate-45 bg-blue text-white border-transparent' : ''}`}>
                <Plus className="size-4" />
              </span>
            </button>
            <div className="grid transition-all duration-700 ease-lux" style={{ gridTemplateRows: on ? '1fr' : '0fr' }}>
              <div className="overflow-hidden">
                <p className={`max-w-3xl pb-8 leading-relaxed ${light ? 'text-ink/65' : 'text-cloud/65'}`}>{t(f.a)}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
