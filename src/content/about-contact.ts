import type { L } from '../lib/i18n'

/**
 * Seed copy for the About page, Contact page and FAQ categories (Nov 2026).
 * Items marked "to confirm" are placeholders: replace them from Dashboard → Website content.
 */

export const doctorExtra = {
  quote: {
    ar: 'بنشرح قبل ما نبدأ، لأن الأهل اللي بيفهموا بيقرروا وهم مطمّنين.',
    en: 'We explain before we begin, because parents who understand decide with peace of mind.',
  } as L,
  story: {
    ar: 'د. خالد صلاح استشاري جراحة الأطفال وحديثي الولادة، بيستقبل الأهالي في التجمع الخامس والجيزة. من أول كشف لحد آخر متابعة، الدكتور بنفسه اللي بيشرح الحالة ويجاوب على كل سؤال. قناته على يوتيوب بقت مرجع لآلاف الأهالي اللي بيدوّروا على شرح هادي وواضح قبل أي عملية.\n\nالفكرة بسيطة: كل أب وأم من حقهم يفهموا إيه اللي هيحصل لطفلهم، وليه، وإزاي. عشان كده كل كشف بيخلص بورقة مكتوبة فيها الخطوات والتخدير والميعاد، وخط مفتوح لأي سؤال بعد العملية.',
    en: 'Dr. Khaled Salah is a consultant of pediatric and neonatal surgery, seeing families in New Cairo and Giza. From the first consultation to the last follow-up, the doctor personally explains the case and answers every question. His YouTube channel has become a reference for thousands of parents looking for a calm, clear explanation before any operation.\n\nThe idea is simple: every parent has the right to understand what will happen to their child, why, and how. That is why every consultation ends with a written sheet of steps, anesthesia and date, and an open line for questions after surgery.',
  } as L,
  values: [
    { t: { ar: 'بنشرح قبل ما نبدأ', en: 'We explain before we begin' }, d: { ar: 'كل كشف بيخرج بورقة مكتوبة: الخطوات والتخدير والتكلفة والميعاد.', en: 'Every consultation ends with a written sheet: steps, anesthesia, cost and date.' } },
    { t: { ar: 'كل حالة ليها خطتها', en: 'Every case has its own plan' }, d: { ar: 'مفيش حلول جاهزة. الخطة بتتبني على حالة طفلك وأسئلتك.', en: 'No off-the-shelf answers. The plan is built around your child and your questions.' } },
    { t: { ar: 'الدكتور بنفسه', en: 'The doctor, personally' }, d: { ar: 'من أول كشف لحد آخر متابعة، نفس الدكتور.', en: 'From the first consultation to the last follow-up, the same doctor.' } },
    { t: { ar: 'قريبين منك', en: 'Close to you' }, d: { ar: 'فرع في التجمع الخامس وفرع في الجيزة، ونفس الدكتور في الاتنين.', en: 'A branch in the Fifth Settlement and one in Giza, with the same doctor at both.' } },
  ] as { t: L; d: L }[],
  timeline: [
    { year: '—', t: { ar: 'بكالوريوس الطب والجراحة', en: 'Bachelor of Medicine and Surgery' }, d: { ar: 'الجامعة والسنة (يتأكد من الدكتور)', en: 'University and year (to confirm with the doctor)' } },
    { year: '—', t: { ar: 'ماجستير الجراحة العامة', en: 'Master\'s in General Surgery' }, d: { ar: 'الجامعة والسنة (يتأكد من الدكتور)', en: 'University and year (to confirm with the doctor)' } },
    { year: '—', t: { ar: 'التخصص في جراحة الأطفال وحديثي الولادة', en: 'Specialisation in pediatric and neonatal surgery' }, d: { ar: 'جهة التدريب (يتأكد من الدكتور)', en: 'Training centre (to confirm with the doctor)' } },
    { year: '—', t: { ar: 'استشاري جراحة الأطفال وحديثي الولادة', en: 'Consultant of Pediatric & Neonatal Surgery' }, d: { ar: 'العيادات في التجمع الخامس والجيزة', en: 'Clinics in New Cairo and Giza' } },
  ] as { year: string; t: L; d: L }[],
}

export type SocialPlatform = 'facebook' | 'instagram' | 'youtube' | 'tiktok' | 'whatsapp' | 'google' | 'x' | 'linkedin' | 'other'

export const contactSeed = {
  email: 'info@drkhaledsalah.com', // to confirm: domain not chosen yet
  website: 'drkhaledsalah.com',    // to confirm
  whatsapp: '201000000000',        // placeholder
  socials: [
    { platform: 'facebook' as SocialPlatform, label: 'Facebook', url: 'https://www.facebook.com/' },
    { platform: 'instagram' as SocialPlatform, label: 'Instagram', url: 'https://www.instagram.com/' },
    { platform: 'youtube' as SocialPlatform, label: 'YouTube', url: 'https://www.youtube.com/@dr.khaledsalah3930' },
    { platform: 'tiktok' as SocialPlatform, label: 'TikTok', url: 'https://www.tiktok.com/' },
    { platform: 'google' as SocialPlatform, label: 'Google', url: 'https://maps.google.com/' },
  ],
}

/** FAQ categories, with the index of each seed general FAQ's category. */
export const faqCategorySeed = [
  { key: 'booking', name: { ar: 'الحجز والمواعيد', en: 'Booking & appointments' } as L },
  { key: 'cost', name: { ar: 'التكلفة', en: 'Costs' } as L },
  { key: 'visit', name: { ar: 'الفروع والزيارة', en: 'Branches & visits' } as L },
  { key: 'travel', name: { ar: 'من خارج القاهرة أو مصر', en: 'Travelling families' } as L },
  { key: 'doctor', name: { ar: 'عن الدكتور', en: 'About the doctor' } as L },
]
/** Category key for each entry of generalFaqs, in order. */
export const generalFaqCategory = ['booking', 'cost', 'visit', 'travel', 'doctor']

export const moreGeneralFaqs: { cat: string; q: L; a: L }[] = [
  { cat: 'booking', q: { ar: 'ممكن أغيّر أو ألغي الميعاد؟', en: 'Can I change or cancel my appointment?' }, a: { ar: 'أيوه، ابعتلنا على واتساب الفرع وهنرتب ميعاد تاني يناسب حضرتك.', en: 'Yes. Message the branch on WhatsApp and we will arrange another time that suits you.' } },
  { cat: 'booking', q: { ar: 'فيه كشف أونلاين؟', en: 'Is there an online consultation?' }, a: { ar: 'ممكن نبدأ باستشارة أونلاين لو حضرتك بعيد، وبعدها نرتّب الكشف في العيادة لو محتاج.', en: 'We can start with an online consultation if you are far away, then arrange a clinic visit if needed.' } },
  { cat: 'visit', q: { ar: 'أجهّز إيه قبل الكشف؟', en: 'What should I bring to the consultation?' }, a: { ar: 'أي تحاليل أو أشعة أو تقارير قديمة، وأسئلتك مكتوبة لو حابب، عشان منسيبش حاجة.', en: 'Any previous tests, scans or reports, and your questions written down if you like, so nothing is missed.' } },
  { cat: 'doctor', q: { ar: 'الدكتور بيرد على الأسئلة بعد العملية؟', en: 'Does the doctor answer questions after surgery?' }, a: { ar: 'أيوه، فيه خط مفتوح بعد العملية لأي سؤال، ورسالة متابعة تاني يوم.', en: 'Yes. There is an open line after surgery for any question, and a follow-up message the next day.' } },
]
