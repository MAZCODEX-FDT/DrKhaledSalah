import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

export function Card({ children, className = '', title, action }: { children: ReactNode; className?: string; title?: string; action?: ReactNode }) {
  return (
    <section className={`dash-card p-5 sm:p-6 ${className}`}>
      {(title || action) && (
        <header className="mb-5 flex items-center justify-between gap-3">
          {title && <h3 className="text-[.95rem] font-semibold text-[#1a2433]">{title}</h3>}
          {action}
        </header>
      )}
      {children}
    </section>
  )
}

export function PageTitle({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-light text-[#1a2433] sm:text-4xl">{title}</h1>
        {sub && <p className="mt-1.5 text-sm text-[#5e6a7a]">{sub}</p>}
      </div>
      {action}
    </div>
  )
}

export function Btn({ children, variant = 'primary', className = '', ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'gold' }) {
  const v = {
    primary: 'bg-[#163e7a] text-[#fff4d6] hover:bg-[#2f6fd1]',
    gold: 'bg-[#2f6fd1] text-white hover:bg-[#2559ad]',
    ghost: 'border border-[#dbe2e8] bg-white text-[#1a2433] hover:bg-[#f3f6f9]',
  }[variant]
  return <button className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:opacity-40 disabled:pointer-events-none ${v} ${className}`} {...rest}>{children}</button>
}

export function Modal({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#0f2d5c]/40 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div className={`dash-card max-h-[92vh] w-full ${wide ? 'max-w-4xl' : 'max-w-xl'} overflow-y-auto !rounded-b-none p-6 sm:!rounded-[1.25rem]`} onClick={e => e.stopPropagation()} role="dialog" aria-modal>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-[#e3f2fb]" aria-label="Close"><X className="size-5" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block space-y-1.5"><span className="text-xs font-medium text-[#5e6a7a]">{label}</span>{children}</label>
}

export function Pill({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>{children}</span>
}

export function Dot({ color }: { color: string }) {
  return <span className="inline-block size-2.5 shrink-0 rounded-full" style={{ background: color }} />
}
