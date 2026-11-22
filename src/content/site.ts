import type { L } from '../lib/i18n'

/**
 * Site content (Arabic first, English second).
 * Draft copy written from the strategy deck. Every medical statement must be
 * reviewed and approved by Dr. Khaled Salah before launch.
 *
 * Content rules from the strategy (do not break):
 * - No prices, no discounts, no trends.
 * - No promise of results, no "best surgeon", no "without errors".
 * - Never assume the child's condition ("does your son have...?").
 * - No identifiable child photos; sensitive topics use illustrations only.
 * - Title stays "Consultant of Pediatric & Neonatal Surgery" until confirmed.
 * - Never mention other doctors.
 */

export const doctor = {
  name: { ar: 'د. خالد صلاح', en: 'Dr. Khaled Salah' } as L,
  title: { ar: 'استشاري جراحة الأطفال وحديثي الولادة', en: 'Consultant of Pediatric & Neonatal Surgery' } as L,
  promise: {
    ar: 'جرّاح أطفال في التجمع بيشرح لحضرتك كل خطوة قبل ما تقرر: من الطهارة لحد أدق العمليات، بهدوء ومن غير استعجال.',
    en: 'A pediatric surgeon in New Cairo who walks you through every step before you decide: from circumcision to the most delicate procedures, calmly and without rush.',
  } as L,
}

/** TODO before launch: confirm the approved number and exact address for each branch. */
export const branches = [
  {
    id: 'tagamoa',
    primary: true,
    name: { ar: 'فرع التجمع الخامس', en: 'Fifth Settlement Branch' } as L,
    area: { ar: 'التجمع الخامس · القاهرة الجديدة', en: 'Fifth Settlement · New Cairo' } as L,
    address: { ar: 'شارع التسعين الشمالي، التجمع الخامس (العنوان النهائي يتأكد)', en: 'North 90th Street, Fifth Settlement (final address to confirm)' } as L,
    hours: { ar: 'السبت إلى الخميس · بالحجز المسبق', en: 'Saturday to Thursday · by appointment' } as L,
    whatsapp: '201000000000',
    phone: '+20 100 000 0000',
    map: 'https://maps.google.com/?q=Fifth+Settlement+North+90th',
    lat: 30.0074, lng: 31.4913, // approximate, used to suggest the nearest branch
    serves: { ar: 'التجمع · الرحاب · مدينتي · الشروق', en: 'Settlement · Rehab · Madinaty · Shorouk' } as L,
  },
  {
    id: 'giza',
    primary: false,
    name: { ar: 'فرع الجيزة · المنيل', en: 'Giza Branch · Manial' } as L,
    area: { ar: 'المنيل · الجيزة', en: 'Manial · Giza' } as L,
    address: { ar: 'المنيل، الجيزة (العنوان النهائي يتأكد)', en: 'Manial, Giza (final address to confirm)' } as L,
    hours: { ar: 'بالحجز المسبق', en: 'By appointment' } as L,
    whatsapp: '201000000001',
    phone: '+20 100 000 0001',
    map: 'https://maps.google.com/?q=Manial+Giza',
    lat: 30.0219, lng: 31.2289,
    serves: { ar: 'الجيزة · المنيل · وسط البلد', en: 'Giza · Manial · Downtown' } as L,
  },
]

export const waLink = (number: string, text: string) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`

export const stats = [
  { value: 15, suffix: '+', label: { ar: 'سنة في جراحة الأطفال وحديثي الولادة', en: 'years in pediatric & neonatal surgery' } as L },
  { value: 220, suffix: '', label: { ar: 'تقييم على Google بمتوسط 5.0', en: 'Google reviews, averaging 5.0' } as L },
  { value: 98, suffix: '%', label: { ar: 'من الأهالي بيرشّحوا على Facebook', en: 'of parents recommend on Facebook' } as L },
  { value: 104, suffix: 'K', label: { ar: 'متابع بيتعلّموا من شرح الدكتور', en: 'followers learning from his explanations' } as L },
]

export type Surgery = {
  slug: string
  index: string
  name: L
  short: L
  hero: L
  what: L
  signs: L[]
  approach: L[]
  steps: { t: L; d: L }[]
  faqs: { q: L; a: L }[]
  tone: string
}

export const surgeries: Surgery[] = [
  {
    slug: 'circumcision',
    index: '01',
    tone: '#2f6fd1',
    name: { ar: 'طهارة الأطفال', en: 'Pediatric Circumcision' },
    short: { ar: 'طهارة آمنة لحديثي الولادة والأطفال، والطريقة والتخدير بيتشرحوا قبل أي قرار.', en: 'Safe circumcision for newborns and children, with method and anesthesia explained before anything is decided.' },
    hero: { ar: 'الطهارة، بهدوء وبطريقة واضحة', en: 'Circumcision, calmly and clearly' },
    what: {
      ar: 'الطهارة من أكتر الإجراءات اللي الأهل بيسألوا عنها في أول أيام المولود. بنقعد مع حضرتك الأول، نشرح الطرق المتاحة، ونختار مع بعض الأنسب لسن الطفل وحالته، في العيادة أو في المستشفى.',
      en: 'Circumcision is one of the first things parents ask about in a newborn\'s early days. We sit with you first, explain the available methods, and choose together what suits the child\'s age and condition, in the clinic or in hospital.',
    },
    signs: [
      { ar: 'السن المناسب للطهارة', en: 'The right age for circumcision' },
      { ar: 'الفرق بين الطرق المختلفة', en: 'How the methods differ' },
      { ar: 'نوع التخدير ومدته', en: 'Type and length of anesthesia' },
      { ar: 'العناية في البيت بعدها', en: 'Care at home afterwards' },
    ],
    approach: [
      { ar: 'كشف بيتشرح فيه كل شيء قبل الاتفاق', en: 'A consultation where everything is explained first' },
      { ar: 'ورقة مكتوبة بالخطوات والميعاد', en: 'A written sheet with steps and date' },
      { ar: 'متابعة تاني يوم بعد الإجراء', en: 'A follow-up call the next day' },
    ],
    steps: [
      { t: { ar: 'الكشف', en: 'Consultation' }, d: { ar: 'نفحص الطفل ونسمع أسئلة حضرتك.', en: 'We examine the child and hear your questions.' } },
      { t: { ar: 'الشرح', en: 'Explanation' }, d: { ar: 'الطريقة والتخدير والعناية بعدها.', en: 'Method, anesthesia and aftercare.' } },
      { t: { ar: 'الإجراء', en: 'Procedure' }, d: { ar: 'في العيادة أو المستشفى حسب الحالة.', en: 'In clinic or hospital, as suits the case.' } },
      { t: { ar: 'المتابعة', en: 'Follow-up' }, d: { ar: 'رسالة تاني يوم وزيارة متابعة.', en: 'A next-day message and a check-up visit.' } },
    ],
    faqs: [
      { q: { ar: 'ليزر ولا جومكو؟ إيه الفرق؟', en: 'Laser or Gomco: what is the difference?' }, a: { ar: 'كل طريقة ليها استخدامها حسب سن الطفل وحالته. الدكتور بيشرح الفرق بالتفصيل في الكشف وبيختار مع حضرتك الأنسب.', en: 'Each method has its place depending on the child\'s age and condition. The doctor explains the difference in detail at the consultation and chooses with you.' } },
      { q: { ar: 'هل الطفل هيحتاج بنج كلي؟', en: 'Will the child need general anesthesia?' }, a: { ar: 'ده بيتحدد حسب السن والطريقة. بيتشرحلك نوع التخدير ومدته قبل أي قرار.', en: 'It depends on age and method. The type and duration of anesthesia are explained before any decision.' } },
      { q: { ar: 'الطهارة بكام؟', en: 'How much does it cost?' }, a: { ar: 'التكلفة بتتقال في الكشف أو في رسالة خاصة، لأنها بتختلف حسب الطريقة ومكان الإجراء.', en: 'Cost is shared at the consultation or in a private message, as it depends on the method and location.' } },
    ],
  },
  {
    slug: 'inguinal-hernia',
    index: '02',
    tone: '#ffc83d',
    name: { ar: 'الفتق الإربي', en: 'Inguinal Hernia' },
    short: { ar: 'بنفهّم حضرتك العملية خطوة بخطوة قبل أي قرار، من الشكل والأعراض لحد التعافي.', en: 'We walk you through the operation step by step before any decision, from signs to recovery.' },
    hero: { ar: 'الفتق الإربي، مفهوم قبل ما يتقرر', en: 'Inguinal hernia, understood before decided' },
    what: {
      ar: 'الفتق الإربي من أشهر العمليات في جراحة الأطفال، وأكتر سؤال بيوصلنا: هل العملية خطيرة؟ دور الكشف إن حضرتك تفهم الحالة وتعرف كل خطوة، وتاخد القرار وانت مطمّن.',
      en: 'Inguinal hernia repair is among the most common operations in pediatric surgery, and the question we hear most is: is it dangerous? The consultation is there so you understand the condition and every step, and decide with peace of mind.',
    },
    signs: [
      { ar: 'شكل الفتق عند الرضّع', en: 'What a hernia looks like in infants' },
      { ar: 'إمتى نقلق ونتصرف بسرعة', en: 'When to worry and act quickly' },
      { ar: 'توقيت العملية المناسب', en: 'The right timing for surgery' },
      { ar: 'الرجوع للحياة الطبيعية', en: 'Getting back to normal life' },
    ],
    approach: [
      { ar: 'فيديو شرح من الدكتور قبل الكشف', en: 'An explainer video from the doctor before you visit' },
      { ar: 'خطة مكتوبة لحالة طفلك', en: 'A written plan for your child' },
      { ar: 'متابعة بعد 24 و72 ساعة', en: 'Follow-up at 24 and 72 hours' },
    ],
    steps: [
      { t: { ar: 'الكشف والفحص', en: 'Examination' }, d: { ar: 'تشخيص واضح وإجابة كل أسئلة حضرتك.', en: 'A clear diagnosis and every question answered.' } },
      { t: { ar: 'خطة العملية', en: 'Surgical plan' }, d: { ar: 'التوقيت والتخدير والمستشفى مكتوبين.', en: 'Timing, anesthesia and hospital in writing.' } },
      { t: { ar: 'يوم العملية', en: 'Surgery day' }, d: { ar: 'فريق متخصص في تخدير الأطفال.', en: 'A team specialized in pediatric anesthesia.' } },
      { t: { ar: 'التعافي', en: 'Recovery' }, d: { ar: 'تعليمات واضحة ومتابعة لحد ما يرجع لطبيعته.', en: 'Clear instructions and follow-up until fully back to normal.' } },
    ],
    faqs: [
      { q: { ar: 'هل عملية الفتق الإربي للأطفال خطيرة؟', en: 'Is pediatric inguinal hernia surgery dangerous?' }, a: { ar: 'الدكتور بيشرح في الكشف تفاصيل العملية والتخدير وكل احتمالاتها بصراحة، عشان حضرتك تاخد القرار وانت فاهم.', en: 'At the consultation the doctor explains the operation, the anesthesia and all considerations openly, so you decide fully informed.' } },
      { q: { ar: 'شكل الفتق الإربي عند الأطفال الرضّع إيه؟', en: 'What does an inguinal hernia look like in infants?' }, a: { ar: 'عند الدكتور فيديو بيشرح الشكل والأعراض بالرسم. وفي كل الأحوال الفحص في العيادة هو اللي بيأكد.', en: 'The doctor has a video explaining the signs with illustrations. Either way, an examination at the clinic is what confirms it.' } },
      { q: { ar: 'الطفل هيرجع البيت إمتى؟', en: 'When does the child go home?' }, a: { ar: 'ده بيتحدد حسب الحالة، وبيتقال لحضرتك في خطة العملية قبلها.', en: 'It depends on the case and is shared with you in the surgical plan beforehand.' } },
    ],
  },
  {
    slug: 'undescended-testis',
    index: '03',
    tone: '#7cc4ee',
    name: { ar: 'الخصية المعلقة', en: 'Undescended Testis' },
    short: { ar: 'خطة لكل حالة، وإجابة واضحة على أسئلة المستقبل اللي بتشغل الأهل.', en: 'A plan for each case, and clear answers to the questions about the future that worry parents.' },
    hero: { ar: 'الخصية المعلقة، ومستقبل مطمّن', en: 'Undescended testis, and a reassured future' },
    what: {
      ar: 'غالبًا دكتور الأطفال هو اللي بيوجّه الأهل لجرّاح أطفال. بنشرح لحضرتك الحالة وتوقيت التدخل وكل خيار متاح، وبنجاوب على الأسئلة اللي بتشغلك عن المستقبل.',
      en: 'Often it is the pediatrician who refers parents to a pediatric surgeon. We explain the condition, the timing of intervention and every option, and answer the questions about the future that are on your mind.',
    },
    signs: [
      { ar: 'التوقيت المناسب للتدخل', en: 'The right timing to intervene' },
      { ar: 'الخصية المعلقة والإنجاب', en: 'Undescended testis and fertility' },
      { ar: 'أنواع العمليات المتاحة', en: 'Types of procedures available' },
      { ar: 'المتابعة على المدى الطويل', en: 'Long-term follow-up' },
    ],
    approach: [
      { ar: 'شرح بالرسم التوضيحي، من غير صور', en: 'Explained with illustrations, never photos' },
      { ar: 'خطة مخصصة لكل حالة', en: 'A tailored plan for every case' },
      { ar: 'متابعة دورية بعد العملية', en: 'Regular follow-up after surgery' },
    ],
    steps: [
      { t: { ar: 'التقييم', en: 'Assessment' }, d: { ar: 'فحص دقيق وأشعة لو محتاجين.', en: 'Careful examination, imaging if needed.' } },
      { t: { ar: 'القرار', en: 'Decision' }, d: { ar: 'الأب والأم مع الدكتور، بالراحة.', en: 'Both parents with the doctor, unhurried.' } },
      { t: { ar: 'العملية', en: 'Surgery' }, d: { ar: 'حسب الخطة المتفق عليها.', en: 'According to the agreed plan.' } },
      { t: { ar: 'المتابعة', en: 'Follow-up' }, d: { ar: 'زيارات منتظمة للاطمئنان.', en: 'Regular visits for reassurance.' } },
    ],
    faqs: [
      { q: { ar: 'هل الخصية المعلقة بتأثر على الإنجاب؟', en: 'Does an undescended testis affect fertility?' }, a: { ar: 'ده من أهم الأسئلة، والدكتور بيشرحه بالتفصيل في الكشف وفي فيديو على القناة، حسب حالة كل طفل.', en: 'One of the most important questions. The doctor explains it in detail at the consultation and in a channel video, according to each child\'s case.' } },
      { q: { ar: 'إمتى المفروض نعمل العملية؟', en: 'When should the operation be done?' }, a: { ar: 'التوقيت بيتحدد بعد الفحص، وبيتشرحلك سببه بوضوح.', en: 'Timing is set after examination, and the reasoning is explained clearly.' } },
    ],
  },
  {
    slug: 'hypospadias',
    index: '04',
    tone: '#7cc4ee',
    name: { ar: 'الإحليل السفلي', en: 'Hypospadias' },
    short: { ar: 'خبرة في العمليات الدقيقة، وخطة مخصصة لكل حالة، ونوريك حالات شبهها بموافقة أصحابها.', en: 'Experience in delicate repairs, a tailored plan for every case, and similar cases shown with consent.' },
    hero: { ar: 'الإحليل السفلي، بدقة وخطة لكل حالة', en: 'Hypospadias, with precision and a plan per case' },
    what: {
      ar: 'أهل الطفل اللي عنده إحليل سفلي بيدوّروا على الخبرة، مش الأقرب. كل حالة ليها خطتها، وبنشرح لحضرتك كل مرحلة، وإيه اللي متوقع في كل خطوة.',
      en: 'Parents facing hypospadias look for experience, not proximity. Every case has its own plan, and we explain each stage and what to expect at every step.',
    },
    signs: [
      { ar: 'هل الإحليل البسيط محتاج عملية؟', en: 'Does mild hypospadias need surgery?' },
      { ar: 'عدد المراحل المتوقعة', en: 'How many stages to expect' },
      { ar: 'الإحليل والزواج في المستقبل', en: 'Hypospadias and adult life' },
      { ar: 'العناية بعد العملية', en: 'Post-operative care' },
    ],
    approach: [
      { ar: 'كشف مطوّل للحالات الدقيقة', en: 'An extended consultation for delicate cases' },
      { ar: 'خطة مكتوبة بالمراحل', en: 'A written, staged plan' },
      { ar: 'تواصل مباشر طول فترة التعافي', en: 'Direct contact throughout recovery' },
    ],
    steps: [
      { t: { ar: 'التقييم الدقيق', en: 'Detailed assessment' }, d: { ar: 'تحديد نوع الحالة ودرجتها.', en: 'Identifying type and degree.' } },
      { t: { ar: 'الخطة', en: 'The plan' }, d: { ar: 'مراحل واضحة وتوقيت مكتوب.', en: 'Clear stages and written timing.' } },
      { t: { ar: 'الجراحة', en: 'Surgery' }, d: { ar: 'تقنيات جراحة الأطفال الدقيقة.', en: 'Fine pediatric surgical techniques.' } },
      { t: { ar: 'المتابعة', en: 'Follow-up' }, d: { ar: 'متابعة قريبة لحد اكتمال التعافي.', en: 'Close follow-up until recovery is complete.' } },
    ],
    faqs: [
      { q: { ar: 'هل الإحليل السفلي البسيط محتاج عملية؟', en: 'Does mild hypospadias need surgery?' }, a: { ar: 'مش كل الحالات زي بعض. الفحص هو اللي بيحدد، والدكتور بيشرح السبب في كل الأحوال.', en: 'Not every case is the same. Examination decides, and the doctor explains the reasoning either way.' } },
      { q: { ar: 'هل الإحليل بيأثر على الزواج؟', en: 'Does hypospadias affect married life?' }, a: { ar: 'سؤال مهم بيتجاوب عليه بصراحة في الكشف، حسب نوع الحالة ودرجتها.', en: 'An important question, answered openly at the consultation, depending on type and degree.' } },
    ],
  },
]

export const journey = [
  { k: '01', t: { ar: 'أول رسالة', en: 'First message' }, d: { ar: 'رد خلال 15 دقيقة، وسؤال واحد: أنهي فرع أقرب لحضرتك؟', en: 'A reply within 15 minutes, and one question: which branch is closer to you?' } },
  { k: '02', t: { ar: 'قبل الكشف', en: 'Before the visit' }, d: { ar: 'تأكيد الميعاد وتذكير، ومعاه فيديو شرح من الدكتور لو حابب.', en: 'Confirmation and a reminder, with an explainer video from the doctor if you like.' } },
  { k: '03', t: { ar: 'في الكشف', en: 'At the consultation' }, d: { ar: 'شرح هادي، وتخرج بورقة: الخطوات والتخدير والتكلفة والميعاد.', en: 'A calm explanation, and you leave with a sheet: steps, anesthesia, cost and date.' } },
  { k: '04', t: { ar: 'بعد العملية', en: 'After surgery' }, d: { ar: 'رسالة متابعة تاني يوم، وخط مفتوح لأي سؤال.', en: 'A follow-up message the next day, and an open line for any question.' } },
  { k: '05', t: { ar: 'بعد أسبوع', en: 'One week later' }, d: { ar: 'زيارة اطمئنان، ورأي حضرتك بيساعد عيلة تانية تلاقينا.', en: 'A check-up visit, and your feedback helps another family find us.' } },
]

export const generalFaqs = [
  { q: { ar: 'إزاي أحجز كشف؟', en: 'How do I book a consultation?' }, a: { ar: 'من زرار الحجز لأي فرع، أو واتساب مباشرة. بنرد خلال 15 دقيقة في مواعيد العمل.', en: 'Use the booking button for either branch, or WhatsApp us directly. We reply within 15 minutes during working hours.' } },
  { q: { ar: 'ليه الأسعار مش مكتوبة على الموقع؟', en: 'Why aren\'t prices listed on the site?' }, a: { ar: 'لأن كل حالة ليها خطتها. التكلفة بتتقال بوضوح في الكشف أو في رسالة خاصة، قبل أي اتفاق.', en: 'Because every case has its own plan. Costs are shared clearly at the consultation or in a private message, before anything is agreed.' } },
  { q: { ar: 'إيه الفرق بين فرع التجمع وفرع الجيزة؟', en: 'What is the difference between the branches?' }, a: { ar: 'نفس الدكتور ونفس طريقة الشرح والمتابعة. اختار الأقرب لحضرتك.', en: 'Same doctor, same way of explaining and following up. Choose whichever is closer to you.' } },
  { q: { ar: 'بتستقبلوا حالات من محافظات تانية أو من بره مصر؟', en: 'Do you see families from other governorates or abroad?' }, a: { ar: 'أيوه. ممكن نبدأ باستشارة أونلاين ونرتّب الزيارة والعملية على مواعيد سفر حضرتك.', en: 'Yes. We can begin with an online consultation and arrange the visit and surgery around your travel.' } },
  { q: { ar: 'هل الدكتور بنفسه اللي بيعمل الكشف والعملية؟', en: 'Does the doctor personally do the consultation and surgery?' }, a: { ar: 'أيوه، الدكتور بنفسه من أول كشف لحد آخر متابعة.', en: 'Yes, the doctor personally, from the first consultation to the last follow-up.' } },
]

export const ui = {
  nav: {
    home: { ar: 'الرئيسية', en: 'Home' },
    about: { ar: 'عن الدكتور', en: 'The Doctor' },
    surgeries: { ar: 'العمليات', en: 'Procedures' },
    branches: { ar: 'الفروع', en: 'Branches' },
    faq: { ar: 'أسئلة الأهالي', en: 'Parents\' Questions' },
    videos: { ar: 'الفيديوهات', en: 'Videos' },
    guide: { ar: 'قبل زيارتك', en: 'Before your visit' },
    articles: { ar: 'مقالات للأهالي', en: 'Articles for parents' },
    contact: { ar: 'تواصل معنا', en: 'Contact' },
    book: { ar: 'احجز كشف', en: 'Book a Visit' },
    dashboard: { ar: 'لوحة التحكم', en: 'Dashboard' },
  },
  heroEyebrow: { ar: 'جراحة الأطفال وحديثي الولادة · التجمع الخامس والجيزة', en: 'Pediatric & Neonatal Surgery · New Cairo & Giza' },
  heroTitle: { ar: 'بنشرح قبل ما نبدأ', en: 'We explain before we begin' },
  heroSub: {
    ar: 'كل خطوة بتتشرح لحضرتك بهدوء، من الطهارة لحد أدق العمليات، عشان تقرر وانت مطمّن.',
    en: 'Every step explained to you calmly, from circumcision to the most delicate operations, so you decide with confidence.',
  },
  bookTagamoa: { ar: 'احجز في التجمع', en: 'Book in New Cairo' },
  bookGiza: { ar: 'احجز في الجيزة', en: 'Book in Giza' },
  explore: { ar: 'اكتشف العمليات', en: 'Explore procedures' },
  scroll: { ar: 'انزل', en: 'Scroll' },
  waMsg: { ar: 'السلام عليكم، حابب أحجز كشف عند د. خالد صلاح', en: 'Hello, I would like to book a consultation with Dr. Khaled Salah' },
}
