import type { ReactNode } from 'react'
import BlurText from '../components/reactbits/BlurText'
import { useI18n } from '../lib/i18n'
import PlayTiles from '../components/site/PlayTiles'

export default function PageHero({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  const { lang } = useI18n()
  return (
    <section className="calm-night brand-pattern relative overflow-hidden pb-20 pt-44 sm:pb-28 sm:pt-52">
      <PlayTiles cols={3} rows={3} offset={8} className="absolute bottom-0 end-0 hidden w-[19rem] overflow-hidden rounded-ss-[2rem] lg:grid" />
      <div className="relative mx-auto max-w-7xl px-6">
        <p className="eyebrow mb-6 text-mist">{eyebrow}</p>
        <h1 className="max-w-5xl font-display text-[clamp(2.6rem,6.4vw,5.8rem)] font-light lg:pe-80 leading-[1.05]">
          <BlurText key={lang + title} text={title} animateBy="words" delay={110} trigger="load" className="!justify-start" />
        </h1>
        {children && <div className="mt-8 max-w-2xl text-lg leading-relaxed text-cloud/70">{children}</div>}
      </div>
    </section>
  )
}
