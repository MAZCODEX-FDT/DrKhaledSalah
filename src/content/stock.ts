import type { L } from '../lib/i18n'

/**
 * Brand-matched sample illustrations (generated, soft 3D clay style in the v2 palette, no people)
 * so the demo shows what the finished site looks like. Replace them with the clinic's own photos
 * from Dashboard → Website content → Image library ("Remove sample photos" clears them in one go).
 * Bump STOCK_VERSION when this list changes so browsers swap out older samples.
 */
export const STOCK_VERSION = 9
const hf = (f: string) => `https://d8j0ntlcm91z4.cloudfront.net/user_3KeFpLBceWPNV4EuryTfU1bfeBn/hf_${f}.png`
/** Illustrations made in Canva (brand v2 style), hosted on the same CDN. */
const cv = (f: string) => `https://d2ol7oe51mr4n9.cloudfront.net/user_3KeFpLBceWPNV4EuryTfU1bfeBn/${f}`
const illo = (slug: string, file: string, ar: string, en: string) =>
  ({ key: `canva-${slug}`, target: `procedure:${slug}`, src: cv(file), alt: { ar: `رسم توضيحي هادي عن ${ar}`, en: `A calm illustration about ${en}` } })

/** The doctor's own photos: kept when the sample photos are removed. */
export const realPhotoKeys = new Set(['doctor-cutout'])

/** target: 'hero' | 'about' | 'branch:<index>' | 'procedure:<slug>' */
export const stockPhotos: { key: string; target: string; src: string; alt: L }[] = [
  { key: 'doctor-cutout', target: 'hero', src: `${import.meta.env.BASE_URL}brand/doctor-cutout.webp`, alt: { ar: 'د. خالد صلاح', en: 'Dr. Khaled Salah' } },
  { key: 'proc-steth', target: 'procedure:undescended-testis', src: hf('20261122_212732_948eb1c1-9903-4b62-ba60-f072eeb7eaac'), alt: { ar: 'سماعة طبية وعدسة مكبرة', en: 'A stethoscope and a magnifying glass' } },
  { key: 'proc-teddy-bed', target: 'procedure:inguinal-hernia', src: hf('20261122_212732_9e17fe91-3078-4090-b62e-90784ff3df17'), alt: { ar: 'دبدوب مرتاح على سرير صغير', en: 'A teddy bear resting on a little bed' } },
  illo('circumcision', 'e80de22f-ff09-400c-b694-3fd8a03d5613.png', 'طهارة الأطفال', 'circumcision'),
  illo('hypospadias', 'c5d75537-a454-402e-a047-9ab6f8ab738c.jpg', 'الإحليل السفلي', 'hypospadias'),
  illo('umbilical-hernia', 'd2c1c433-8c64-47be-bdb6-29411610db8b.jpg', 'فتق السرة', 'umbilical hernia'),
  illo('hydrocele', '7cd314cc-615e-4490-afe7-9318a7b31a73.jpg', 'القيلة المائية', 'hydrocele'),
  illo('tongue-tie', '018ea8ea-c4f8-4087-95ce-660a6680ea29.jpg', 'لجام اللسان', 'tongue-tie'),
  illo('pyloric-stenosis', '5cdaf0ee-134b-40ac-807b-0deb53688e64.jpg', 'ضيق فتحة المعدة', 'pyloric stenosis'),
  illo('appendicitis', '86686717-8c68-4ac5-ae8e-0fdc5a1fcab8.jpg', 'الزائدة الدودية', 'appendicitis'),
  illo('intussusception', 'e48e1817-2900-4556-b43a-37852860ef88.jpg', 'انغلاف الأمعاء', 'intussusception'),
  illo('varicocele', '2e708dca-ff7d-47fb-8cf5-24acb01c7485.jpg', 'دوالي الخصية للمراهقين', 'adolescent varicocele'),
  illo('neck-swellings', '5c35546b-a11f-4a50-b37e-7832e1a2a2a0.jpg', 'أكياس وتورّمات الرقبة', 'neck cysts and swellings'),
  illo('anorectal-malformations', '35514eb1-ab44-4baf-9a0e-f82b94b85bd2.jpg', 'تشوهات فتحة الشرج الخلقية', 'anorectal malformations'),
  illo('hirschsprung', '9f7cfd2a-19c4-432c-983e-fa4bab5e9439.jpg', 'مرض هيرشسبرونج', 'Hirschsprung disease'),
  illo('laparoscopic-surgery', '0b96fe14-c72c-415a-b17e-fe8cef17c572.jpg', 'جراحة المناظير للأطفال', 'pediatric laparoscopic surgery'),
  { key: 'proc-bottle', target: 'procedure:neonatal-surgery', src: hf('20261122_212733_6161e277-8a7d-46b5-b293-3d0999dfaf4e'), alt: { ar: 'رضّاعة وبزّازة', en: 'A baby bottle and pacifier' } },
  { key: 'canva-about', target: 'about', src: cv('4f0897fd-f23c-43ba-a641-243e7212a8c7.jpg'), alt: { ar: 'غرفة كشف هادية فيها مكتب وسماعة ودبدوب', en: 'A calm consultation room with a desk, stethoscope and teddy bear' } },
  { key: 'canva-branch-settlement', target: 'branch:0', src: cv('0dcc9aed-e233-4a90-baa5-14c0a90c5493.jpg'), alt: { ar: 'مبنى عيادة حديث بين النخيل في التجمع', en: 'A modern clinic building among palm trees in New Cairo' } },
  { key: 'canva-branch-giza', target: 'branch:1', src: cv('c591efc6-0aa9-412c-ab64-fd52bc9d9cce.jpg'), alt: { ar: 'مبنى عيادة بطراز قاهري كلاسيكي على النيل في المنيل', en: 'A clinic in a classic Cairo building by the Nile in Manial' } },
]
