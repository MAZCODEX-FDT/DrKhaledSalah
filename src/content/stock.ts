import type { L } from '../lib/i18n'

/**
 * Brand-matched sample illustrations (generated, soft 3D clay style in the v2 palette, no people)
 * so the demo shows what the finished site looks like. Replace them with the clinic's own photos
 * from Dashboard → Website content → Image library ("Remove sample photos" clears them in one go).
 * Bump STOCK_VERSION when this list changes so browsers swap out older samples.
 */
export const STOCK_VERSION = 2
const hf = (f: string) => `https://d8j0ntlcm91z4.cloudfront.net/user_3KeFpLBceWPNV4EuryTfU1bfeBn/hf_${f}.png`

/** target: 'hero' | 'about' | 'branch:<index>' | 'procedure:<slug>' */
export const stockPhotos: { key: string; target: string; src: string; alt: L }[] = [
  { key: 'hero-teddy', target: 'hero', src: hf('20261122_212732_52fd7747-cf8c-4532-9b80-f671bfb90d34'), alt: { ar: 'دبدوب لابس سماعة دكتور', en: 'A teddy bear wearing a stethoscope' } },
  { key: 'proc-steth', target: 'procedure:undescended-testis', src: hf('20261122_212732_948eb1c1-9903-4b62-ba60-f072eeb7eaac'), alt: { ar: 'سماعة طبية وعدسة مكبرة', en: 'A stethoscope and a magnifying glass' } },
  { key: 'proc-teddy-bed', target: 'procedure:inguinal-hernia', src: hf('20261122_212732_9e17fe91-3078-4090-b62e-90784ff3df17'), alt: { ar: 'دبدوب مرتاح على سرير صغير', en: 'A teddy bear resting on a little bed' } },
  { key: 'proc-bottle', target: 'procedure:neonatal-surgery', src: hf('20261122_212733_6161e277-8a7d-46b5-b293-3d0999dfaf4e'), alt: { ar: 'رضّاعة وبزّازة', en: 'A baby bottle and pacifier' } },
]
