const KNOWN = ['circumcision', 'inguinal-hernia', 'undescended-testis', 'hypospadias']

/** Fallback for procedures added later: soft arcs whose rhythm comes from the slug. */
function Generic({ seed, ...p }: { seed: string } & React.SVGProps<SVGGElement>) {
  const h = [...seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)
  const n = 5 + (h % 5), rot = h % 360
  return (
    <g {...p} transform={`rotate(${rot} 200 200)`}>
      {Array.from({ length: n }).map((_, i) => (
        <path key={i} d={`M ${200 - (40 + i * 24)} 200 A ${40 + i * 24} ${40 + i * 24} 0 0 1 ${200 + (40 + i * 24)} 200`} opacity={1 - i * 0.08} />
      ))}
      <circle cx="200" cy="200" r={12 + (h % 14)} strokeWidth="1.6" />
      {Array.from({ length: 3 }).map((_, i) => <circle key={`d${i}`} cx={200 + (i - 1) * 40} cy={260} r="3" fill={String(p.stroke)} />)}
    </g>
  )
}

/** Abstract, non-anatomical line art per procedure (the strategy forbids real photos for sensitive cases). */
export default function ProcedureArt({ slug, tone = '#ffc83d', className = '' }: { slug: string; tone?: string; className?: string }) {
  const common = { fill: 'none', stroke: tone, strokeWidth: 1.2, strokeLinecap: 'round' as const }
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden>
      <defs>
        <radialGradient id={`glow-${slug}`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={tone} stopOpacity=".35" />
          <stop offset="1" stopColor={tone} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="190" fill={`url(#glow-${slug})`} />
      {!KNOWN.includes(slug) && <Generic seed={slug} {...common} />}
      {slug === 'circumcision' && (
        <g {...common}>
          {Array.from({ length: 9 }).map((_, i) => <circle key={i} cx="200" cy="200" r={30 + i * 18} opacity={1 - i * 0.09} />)}
          <path d="M200 40 V360" strokeDasharray="2 8" opacity=".6" />
        </g>
      )}
      {slug === 'inguinal-hernia' && (
        <g {...common}>
          {Array.from({ length: 12 }).map((_, i) => (
            <path key={i} d={`M40 ${120 + i * 14} C 140 ${60 + i * 14}, 260 ${220 + i * 10}, 360 ${130 + i * 14}`} opacity={0.25 + i * 0.06} />
          ))}
          <circle cx="232" cy="214" r="26" strokeWidth="1.6" />
        </g>
      )}
      {slug === 'undescended-testis' && (
        <g {...common}>
          <path d="M200 60 C 120 120, 280 180, 200 250 S 200 330, 200 340" strokeWidth="1.6" />
          {Array.from({ length: 6 }).map((_, i) => <circle key={i} cx="200" cy={80 + i * 50} r={8 + i * 3} opacity={0.3 + i * 0.12} />)}
          <circle cx="200" cy="340" r="18" fill={tone} fillOpacity=".25" />
        </g>
      )}
      {slug === 'hypospadias' && (
        <g {...common}>
          {Array.from({ length: 14 }).map((_, i) => {
            const a = (i / 14) * Math.PI * 2
            return <line key={i} x1={200 + Math.cos(a) * 40} y1={200 + Math.sin(a) * 40} x2={200 + Math.cos(a) * 160} y2={200 + Math.sin(a) * 160} opacity=".5" />
          })}
          <circle cx="200" cy="200" r="40" strokeWidth="1.6" />
          <circle cx="200" cy="200" r="100" strokeDasharray="1 6" />
          <circle cx="200" cy="200" r="160" opacity=".5" />
        </g>
      )}
    </svg>
  )
}
