import type { L } from '../lib/i18n'

/**
 * Brand-matched sample illustrations (generated, soft 3D clay style in the v2 palette, no people)
 * so the demo shows what the finished site looks like. Replace them with the clinic's own photos
 * from Dashboard → Website content → Image library ("Remove sample photos" clears them in one go).
 * Bump STOCK_VERSION when this list changes so browsers swap out older samples.
 */
export const STOCK_VERSION = 13
const hf = (f: string) => `https://d8j0ntlcm91z4.cloudfront.net/user_3KeFpLBceWPNV4EuryTfU1bfeBn/hf_${f}.png`
/** Illustrations made in Canva (brand v2 style), hosted on the same CDN. */
const cv = (f: string) => `https://d2ol7oe51mr4n9.cloudfront.net/user_3KeFpLBceWPNV4EuryTfU1bfeBn/${f}`
const illo = (slug: string, file: string, ar: string, en: string) =>
  ({ key: `canva-${slug}`, target: `procedure:${slug}`, src: cv(file), alt: { ar: `رسم توضيحي عن ${ar}`, en: `A calm illustration about ${en}` } })

/** The doctor's own photos: kept when the sample photos are removed. */
export const realPhotoKeys = new Set(['doctor-cutout', 'doctor-scrubs', 'doctor-seated'])

/** Unsplash stock photos for the parent articles (objects and rooms only, no people). */
const un = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=70`
const art = (slug: string, id: string, ar: string, en: string) => ({ key: `article-${slug}`, target: `article:${slug}`, src: un(id), alt: { ar, en } })

/** target: 'hero' | 'about' | 'portrait' | 'branch:<index>' | 'procedure:<slug>' | 'article:<slug>' */
export const stockPhotos: { key: string; target: string; src: string; alt: L }[] = [
  { key: 'doctor-scrubs', target: 'portrait', src: `${import.meta.env.BASE_URL}brand/doctor-scrubs.webp`, alt: { ar: 'د. خالد صلاح بلبس العمليات', en: 'Dr. Khaled Salah in surgical scrubs' } },
  { key: 'doctor-seated', target: 'about', src: `${import.meta.env.BASE_URL}brand/doctor-seated.webp`, alt: { ar: 'د. خالد صلاح', en: 'Dr. Khaled Salah' } },
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
  art('fasting-before-surgery', '1623707430616-d9f956bcac2b', 'رضّاعة أطفال', 'A baby feeding bottle'),
  art('preparing-child-for-surgery', '1602734846297-9299fc2d4703', 'دبدوب', 'A teddy bear'),
  art('hospital-bag', '1726726192148-af52008ff663', 'شنطة ضهر صفرا', 'A yellow backpack'),
  art('pain-at-home', '1607619056574-7b8d3ee536b2', 'أدوية', 'Medicines'),
  art('wound-care', '1782835430497-19223e7432cc', 'شنطة إسعافات أولية', 'A first aid kit'),
  art('warning-signs-after-surgery', '1740560516658-5a94b0b715ed', 'ترمومتر', 'A thermometer'),
  art('circumcision-aftercare', '1766465182486-1d558f382494', 'دبدوب على سرير', 'A teddy bear on a bed'),
  art('hydrocele-vs-hernia', '1655313719493-16ebe4906441', 'سماعة طبية', 'A stethoscope'),
  art('umbilical-hernia-myths', '1594150878496-a921e5af8907', 'جزمة أطفال صغيرة', 'Little baby shoes'),
  art('retractile-vs-undescended', '1655913197692-012897652d13', 'سماعة طبية', 'A stethoscope'),
  art('tongue-tie-feeding', '1543346242-2b8e41fb91ca', 'لعبة معلقة فوق سرير طفل', 'A baby mobile'),
  art('appendicitis-signs', '1778151270902-cb0ca572f2ee', 'غرفة في مستشفى', 'A hospital room'),
  art('newborn-vomiting-pyloric', '1648311203209-da34f7d0d800', 'دبدوب', 'A teddy bear'),
  art('laparoscopy-children', '1727830968495-ea2798aaee35', 'سرير مستشفى وأجهزة طبية', 'A hospital bed and equipment'),
  art('back-to-school-sports', '1543351611-58f69d7c1781', 'كورة', 'A football'),
  art('questions-to-ask', '1612367980327-7454a7276aa7', 'نوتة وقلم', 'A notebook'),
  art('anesthesia-questions', '1628372095387-017d1099fc19', 'ممر مستشفى', 'A hospital corridor'),
  art('circumcision-timing', '1639751907353-3629fc00d2b2', 'غرفة طفل فيها سرير أبيض', 'A nursery with a white crib'),
  art('inguinal-hernia-wait', '1618842676088-c4d48a6a7c9d', 'لعبة حلقات ملونة', 'A colourful stacking toy'),
  art('undescended-testis-questions', '1687708522434-6197bb47c933', 'ألعاب قطيفة', 'Soft toys'),
  { key: 'canva-branch-settlement', target: 'branch:0', src: cv('0dcc9aed-e233-4a90-baa5-14c0a90c5493.jpg'), alt: { ar: 'مبنى عيادة حديث بين النخيل في التجمع', en: 'A modern clinic building among palm trees in New Cairo' } },
  { key: 'canva-branch-giza-square', target: 'branch:1', src: cv('92a881fc-9d00-418c-80f6-3373efcc22a1.jpg'), alt: { ar: 'مبنى عيادة بطراز قاهري كلاسيكي في ميدان الجيزة', en: 'A clinic in a classic Cairo building on Giza Square' } },
]
