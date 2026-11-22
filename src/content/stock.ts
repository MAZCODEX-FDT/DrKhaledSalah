import type { L } from '../lib/i18n'

/**
 * Sample stock photos (Unsplash, free licence) so the demo shows what the finished site looks like.
 * No children's faces, per the content rules. Replace them with the clinic's own photos from
 * Dashboard → Website content → Image library ("Remove sample photos" clears them in one go).
 */
const u = (id: string, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`

export type StockSlot = 'hero' | 'about' | 'branch' | 'procedure'
export const stockPhotos: { key: string; slot: StockSlot; src: string; alt: L }[] = [
  { key: 'hero-teddy', slot: 'hero', src: u('1763294905876-2c1a41ddfd64'), alt: { ar: 'دبدوب لابس سماعة دكتور', en: 'A teddy bear wearing a stethoscope' } },
  { key: 'about-lobby', slot: 'about', src: u('1519494026892-80bbd2d6fd0d', 2000), alt: { ar: 'استقبال عيادة هادي ومنظم', en: 'A calm, tidy clinic reception' } },
  { key: 'branch-1', slot: 'branch', src: u('1764885517847-79d62138cc58'), alt: { ar: 'مبنى طبي حديث', en: 'A modern medical building' } },
  { key: 'branch-2', slot: 'branch', src: u('1586773860418-d37222d8fce3'), alt: { ar: 'مبنى العيادة', en: 'The clinic building' } },
  { key: 'proc-or-1', slot: 'procedure', src: u('1516549655169-df83a0774514'), alt: { ar: 'غرفة عمليات مجهزة', en: 'An equipped operating room' } },
  { key: 'proc-steth-blue', slot: 'procedure', src: u('1655313719493-16ebe4906441'), alt: { ar: 'سماعة طبية على خلفية زرقا', en: 'A stethoscope on a blue background' } },
  { key: 'proc-teddy-check', slot: 'procedure', src: u('1763294905874-504ea922bbc9'), alt: { ar: 'دبدوب بيتكشف عليه', en: 'A teddy bear having a check-up' } },
  { key: 'proc-clipboard', slot: 'procedure', src: u('1777805865927-a6ee4c4eacb1'), alt: { ar: 'ملف طبي وسماعة', en: 'A clipboard and stethoscope' } },
  { key: 'proc-or-2', slot: 'procedure', src: u('1551076805-e1869033e561'), alt: { ar: 'غرفة عمليات', en: 'An operating room' } },
  { key: 'proc-room', slot: 'procedure', src: u('1704455306925-1401c3012117'), alt: { ar: 'غرفة كشف بأجهزة طبية', en: 'An examination room with medical equipment' } },
  { key: 'proc-teddy-tool', slot: 'procedure', src: u('1763294905880-6caf7e585241'), alt: { ar: 'دبدوب وأداة طبية', en: 'A teddy bear and a medical tool' } },
  { key: 'proc-steth', slot: 'procedure', src: u('1505751172876-fa1923c5c528'), alt: { ar: 'سماعة طبية', en: 'A stethoscope' } },
  { key: 'proc-bed', slot: 'procedure', src: u('1538108149393-fbbd81895907'), alt: { ar: 'غرفة إقامة نضيفة', en: 'A clean recovery room' } },
  { key: 'proc-corridor', slot: 'procedure', src: u('1777269749032-d8d458ae594d'), alt: { ar: 'ممر المستشفى', en: 'A hospital corridor' } },
  { key: 'proc-equipment', slot: 'procedure', src: u('1727830968495-ea2798aaee35'), alt: { ar: 'سرير وأجهزة طبية', en: 'A bed and medical equipment' } },
  { key: 'proc-tools', slot: 'procedure', src: u('1668453598237-27098d2575ac'), alt: { ar: 'أدوات جراحية', en: 'Surgical instruments' } },
]
