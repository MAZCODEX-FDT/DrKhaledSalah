import { viewsOf, type Video } from './content'

/**
 * Words that identify each procedure in video titles (Arabic spellings vary, so several forms are listed).
 * Videos whose title contains any of them are shown on that procedure's page automatically.
 */
export const procedureKeywords: Record<string, string[]> = {
  circumcision: ['طهارة', 'طهاره', 'الطهارة', 'ختان', 'الختان', 'circumcision'],
  'inguinal-hernia': ['فتق اربي', 'فتق إربي', 'الفتق الإربي', 'الفتق الاربي', 'فتق أربي', 'inguinal hernia', 'inguinal'],
  'undescended-testis': ['خصية معلقة', 'الخصية المعلقة', 'خصيه معلقه', 'الخصيه المعلقه', 'خصية', 'undescended', 'testis', 'testicular', 'orchidopexy'],
  hypospadias: ['الإحليل', 'الاحليل', 'إحليل', 'احليل', 'مبال', 'hypospadias'],
  'umbilical-hernia': ['فتق سري', 'الفتق السري', 'فتق السرة', 'السرة', 'umbilical'],
  hydrocele: ['قيلة مائية', 'القيلة المائية', 'مياه على الخصية', 'مية على الخصية', 'hydrocele'],
  'tongue-tie': ['لجام اللسان', 'ربط اللسان', 'tongue tie', 'tongue-tie'],
  'pyloric-stenosis': ['ضيق البواب', 'البواب', 'ترجيع', 'pyloric'],
  appendicitis: ['الزايدة', 'الزائدة', 'زايدة', 'زائدة', 'appendicitis', 'appendix'],
  intussusception: ['انغلاف', 'الانغلاف', 'intussusception'],
  varicocele: ['دوالي الخصية', 'دوالي', 'varicocele'],
  'neck-swellings': ['ورم في الرقبة', 'الرقبة', 'رقبة', 'neck'],
  'neonatal-surgery': ['حديثي الولادة', 'حديث الولادة', 'المولود', 'newborn', 'neonatal'],
  'anorectal-malformations': ['فتحة الشرج', 'الشرج', 'anorectal', 'imperforate anus'],
  hirschsprung: ['هيرشبرونج', 'هيرشسبرونج', 'hirschsprung'],
  'laparoscopic-surgery': ['منظار', 'بالمنظار', 'المنظار', 'laparoscopic', 'laparoscopy'],
}

const norm = (s: string) => s.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')

/** Videos for a procedure: the one pinned in the dashboard first, then title matches by views. */
export function videosForProcedure(slug: string, videos: Video[], pinned?: string): Video[] {
  const words = (procedureKeywords[slug] ?? []).map(norm)
  const hits = words.length ? videos.filter(v => { const t = norm(`${v.title.ar} ${v.title.en}`); return words.some(w => t.includes(w)) }) : []
  const sorted = [...hits].sort((a, b) => viewsOf(b) - viewsOf(a))
  if (!pinned) return sorted
  const pin = videos.find(v => v.url.includes(pinned)) ?? { id: 'pinned', url: `https://www.youtube.com/watch?v=${pinned}`, title: { ar: '', en: '' }, views: '', featured: false, enabled: true }
  return [pin, ...sorted.filter(v => v.id !== pin.id)]
}
