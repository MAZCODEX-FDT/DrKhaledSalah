import { brandAsset } from './Logo'

/**
 * KS Play pattern (brand book v2): square tiles built from the curves of the monogram:
 * quarter circles, half moons, dots, rings, arches and KS tiles. Use on edges and corners only,
 * never behind long text.
 */
const C = { deep: '#163E7A', kids: '#2F6FD1', sky: '#7CC4EE', sun: '#FFC83D', tint: '#E3F2FB', butter: '#FFF4D6', white: '#FAFBFD' }

type Tile = { bg: string; draw?: (k: number) => React.ReactNode; ks?: boolean }

const ring = (bg: string, fg: string, hole: string): Tile => ({ bg, draw: () => <><circle cx="50" cy="50" r="30" fill={fg} /><circle cx="50" cy="50" r="17" fill={hole} /></> })
const dot = (bg: string, fg: string): Tile => ({ bg, draw: () => <circle cx="50" cy="50" r="24" fill={fg} /> })
const dots = (bg: string, fg: string): Tile => ({ bg, draw: () => <>{[22, 50, 78].flatMap(y => [22, 50, 78].map(x => <circle key={`${x}-${y}`} cx={x} cy={y} r="6" fill={fg} />))}</> })
const quarter = (bg: string, fg: string, corner: 0 | 1 | 2 | 3): Tile => ({
  bg, draw: () => {
    const [cx, cy] = [[0, 0], [100, 0], [100, 100], [0, 100]][corner]
    return <circle cx={cx} cy={cy} r="100" fill={fg} />
  },
})
const moon = (bg: string, fg: string, up = true): Tile => ({ bg, draw: () => <circle cx="50" cy={up ? 100 : 0} r="50" fill={fg} /> })
const arch = (bg: string, fg: string): Tile => ({ bg, draw: () => <path d="M26 100 V46 a24 24 0 0 1 48 0 V100 Z" fill={fg} /> })
const ks = (bg: string): Tile => ({ bg, ks: true })

/** Fixed tile order: never random, so every page shows the same rhythm. */
export const PLAY: Tile[] = [
  ring(C.sky, C.white, C.sky), dot(C.white, C.sun), dots(C.white, C.kids), quarter(C.sky, C.white, 2),
  quarter(C.white, C.sun, 3), arch(C.kids, C.sky), ks(C.deep), dots(C.kids, C.white),
  dots(C.deep, C.sun), dot(C.sun, C.white), dot(C.kids, C.sky), quarter(C.white, C.sky, 0),
  moon(C.sky, C.deep, true), ks(C.deep), arch(C.white, C.sky), arch(C.butter, C.sun),
  ring(C.tint, C.deep, C.tint), quarter(C.sun, C.white, 1), dots(C.sky, C.deep), moon(C.kids, C.white, false),
]

function TileSvg({ tile, k }: { tile: Tile; k: number }) {
  if (tile.ks) {
    return (
      <div className="flex aspect-square items-center justify-center" style={{ background: tile.bg }}>
        <img src={brandAsset('mark-white.webp')} alt="" className="w-[62%]" loading="lazy" />
      </div>
    )
  }
  return (
    <svg viewBox="0 0 100 100" className="block aspect-square w-full" aria-hidden>
      <defs><clipPath id={`pt-${k}`}><rect width="100" height="100" /></clipPath></defs>
      <rect width="100" height="100" fill={tile.bg} />
      <g clipPath={`url(#pt-${k})`}>{tile.draw?.(k)}</g>
    </svg>
  )
}

/** A grid of KS Play tiles. `offset` shifts the start of the fixed sequence. */
export default function PlayTiles({ cols, rows, offset = 0, className = '' }: { cols: number; rows: number; offset?: number; className?: string }) {
  const n = cols * rows
  return (
    <div aria-hidden className={`grid ${className}`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {Array.from({ length: n }).map((_, i) => {
        const tile = PLAY[(i + offset) % PLAY.length]
        return <TileSvg key={i} tile={tile} k={i + offset * 100} />
      })}
    </div>
  )
}

/** Round icon badge with a short coloured ring arc (brand book v2). */
export function RingBadge({ children, tone = 'sun', className = 'size-14', bg = 'bg-mist' }: { children: React.ReactNode; tone?: 'sun' | 'blue'; className?: string; bg?: string }) {
  const stroke = tone === 'sun' ? C.sun : C.kids
  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center rounded-full text-navy ${bg} ${className}`}>
      <svg viewBox="0 0 100 100" className="pointer-events-none absolute -inset-[12%] size-[124%]" aria-hidden>
        <path d="M11.9 28 A44 44 0 0 1 88.1 28" fill="none" stroke={stroke} strokeWidth="7" strokeLinecap="round" />
      </svg>
      {children}
    </span>
  )
}
