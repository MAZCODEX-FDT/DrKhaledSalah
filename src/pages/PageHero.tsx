import type { ReactNode } from 'react'
import BlurText from '../components/reactbits/BlurText'
import { useI18n } from '../lib/i18n'

export default function PageHero({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  const { lang } = useI18n()
  return (
    <section className="grain relative overflow-hidden bg-[radial-gradient(100%_90%_at_80%_0%,#24494b_0%,#10262a_50%,#0b1a1d_100%)] pb-20 pt-44 sm:pb-28 sm:pt-52">
      <svg viewBox="0 0 600 600" className="absolute -end-40 -top-40 size-[44rem] opacity-20" aria-hidden>
        {Array.from({ length: 12 }).map((_, k) => <circle key={k} cx="300" cy="300" r={30 + k * 24} fill="none" stroke="#c9a96a" strokeWidth=".7" />)}
      </svg>
      <div className="relative mx-auto max-w-7xl px-6">
        <p className="eyebrow mb-6 text-gold-2">{eyebrow}</p>
        <h1 className="max-w-5xl font-display text-[clamp(2.6rem,7vw,6.5rem)] font-light leading-[1.05]">
          <BlurText key={lang + title} text={title} animateBy="words" delay={110} trigger="load" className="!justify-start" />
        </h1>
        {children && <div className="mt-8 max-w-2xl text-lg leading-relaxed text-ivory/70">{children}</div>}
      </div>
    </section>
  )
}
