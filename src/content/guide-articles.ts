import type { L } from '../lib/i18n'

/**
 * Seed copy for the "Before your visit" guide and the articles section (Nov 2026).
 * DRAFT medical wording: the doctor must review every line before launch (Dashboard → Website content).
 * Rules: no promises of results, never assume the child's condition, no exclamation marks.
 */

export const guideSeed: { title: L; items: L }[] = [
  {
    title: { ar: 'تجيب معاك إيه في الكشف', en: 'What to bring to the consultation' },
    items: {
      ar: 'أي تحاليل أو أشعة أو تقارير قديمة\nشهادة الميلاد أو أي إثبات لسن الطفل\nقائمة بالأدوية اللي الطفل بياخدها لو فيه\nأسئلتك مكتوبة عشان منسيبش حاجة\nلعبة أو حاجة بيحبها تطمّنه وقت الانتظار',
      en: 'Any previous tests, scans or reports\nThe birth certificate or proof of the child\'s age\nA list of any medicines the child takes\nYour questions written down, so nothing is missed\nA favourite toy to keep them calm while waiting',
    },
  },
  {
    title: { ar: 'الصيام قبل التخدير', en: 'Fasting before anesthesia' },
    items: {
      ar: 'الدكتور هيكتبلك مواعيد الصيام بالظبط في ورقة الكشف، والمواعيد دي هي اللي تمشي عليها\nبشكل عام: الأكل والألبان الصناعية بتقف قبل العملية بكام ساعة\nالرضاعة الطبيعية ليها وقت أقصر من الأكل\nالمية والسوايل الشفافة بتقف قبل العملية بوقت قصير\nلو الطفل أكل أو شرب بالغلط، قول للفريق على طول، ده عشان سلامته',
      en: 'The doctor writes the exact fasting times on your consultation sheet; follow those times\nIn general, food and formula stop a few hours before surgery\nBreast milk has a shorter cut-off than food\nWater and clear fluids stop a short time before surgery\nIf the child eats or drinks by mistake, tell the team straight away, for their safety',
    },
  },
  {
    title: { ar: 'يوم العملية', en: 'On the day' },
    items: {
      ar: 'تعالى قبل الميعاد بنص ساعة\nلبس الطفل هدوم واسعة ومريحة\nواحد من الأهل بيفضل مع الطفل لحد ما ينام بالبنج لو ده متاح\nالدكتور بيطمّنك بنفسه بعد ما العملية تخلص\nبتروّح بورقة مكتوبة فيها الرعاية في البيت والأدوية وميعاد المتابعة',
      en: 'Arrive half an hour before your time\nDress the child in loose, comfortable clothes\nOne parent can stay with the child until they fall asleep, where possible\nThe doctor updates you personally once the operation is over\nYou go home with a written sheet: home care, medicines and the follow-up date',
    },
  },
  {
    title: { ar: 'بعد ما تروّح', en: 'After you go home' },
    items: {
      ar: 'اتبع ورقة الرعاية والأدوية زي ما هي مكتوبة\nرسالة متابعة من العيادة تاني يوم\nالخط مفتوح لأي سؤال، ابعت على واتساب الفرع',
      en: 'Follow the care sheet and medicines as written\nA follow-up message from the clinic the next day\nThe line is open for any question: message the branch on WhatsApp',
    },
  },
  {
    title: { ar: 'كلّمنا على طول لو', en: 'Call us straight away if' },
    items: {
      ar: 'فيه سخونية عالية مش بتنزل\nفيه نزيف أو تورم بيزيد\nالطفل مش قادر يشرب أو بيرجّع كتير\nأي حاجة مقلقاك، حتى لو صغيرة',
      en: 'There is a high fever that does not come down\nThere is bleeding or swelling that keeps increasing\nThe child cannot drink or keeps vomiting\nAnything worries you, however small',
    },
  },
]

export const articleSeed: { slug: string; procedure?: string; title: L; excerpt: L; body: L }[] = [
  {
    slug: 'anesthesia-questions',
    title: { ar: 'البنج عند الأطفال: أكتر 5 أسئلة بيسألها الأهل', en: 'Anesthesia in children: the 5 questions parents ask most' },
    excerpt: { ar: 'إزاي بيتحدد نوع البنج، وليه الصيام مهم، ومين بيفضل مع الطفل.', en: 'How the type of anesthesia is chosen, why fasting matters, and who stays with the child.' },
    body: {
      ar: '## مين بيختار نوع البنج؟\nطبيب التخدير بيقرر مع الدكتور حسب سن الطفل ونوع العملية وحالته الصحية، وبيشرحلك القرار قبل اليوم.\n\n## ليه الصيام مهم؟\nالصيام بيقلل احتمال إن الأكل يرجع وقت البنج. مواعيده بتتكتب في ورقة الكشف، والمواعيد دي هي اللي تمشي عليها.\n\n## الطفل هيحس بحاجة؟\nالفريق بيستخدم طرق تقلل الخوف والألم، والدكتور بيشرحلك إيه اللي هيحصل خطوة بخطوة.\n\n## ممكن أفضل معاه؟\nفي أغلب الحالات واحد من الأهل بيقدر يفضل مع الطفل لحد ما ينام.\n\n## إمتى يفوق؟\nبيختلف حسب العملية، والفريق بيطمّنك أول ما يبدأ يفوق.',
      en: '## Who chooses the type of anesthesia?\nThe anesthetist decides with the doctor based on the child\'s age, the operation and their health, and explains the decision before the day.\n\n## Why does fasting matter?\nFasting lowers the chance of food coming back up under anesthesia. The times are written on your consultation sheet; follow those.\n\n## Will the child feel anything?\nThe team uses methods that reduce fear and pain, and the doctor explains what will happen step by step.\n\n## Can I stay with them?\nIn most cases one parent can stay until the child falls asleep.\n\n## When will they wake up?\nIt depends on the operation, and the team updates you as soon as they start to wake.',
    },
  },
  {
    slug: 'circumcision-timing',
    procedure: 'circumcision',
    title: { ar: 'الطهارة: إمتى، وإزاي نختار الطريقة؟', en: 'Circumcision: when, and how to choose the method' },
    excerpt: { ar: 'السن المناسب، والفرق بين الطرق، والأسئلة اللي تسألها في الكشف.', en: 'The right age, the difference between methods, and what to ask at the consultation.' },
    body: {
      ar: '## السن\nالسن المناسب بيتحدد في الكشف حسب وزن الطفل وصحته العامة.\n\n## الطرق\nفيه أكتر من طريقة، والدكتور بيشرح الفرق بينها ومين تناسبه، وانت اللي بتختار وانت فاهم.\n\n## اسأل في الكشف\nنوع التخدير، ومدة العملية، والرعاية في البيت، وميعاد المتابعة.',
      en: '## Age\nThe right age is decided at the consultation, based on the child\'s weight and general health.\n\n## Methods\nThere is more than one method; the doctor explains the differences and who each suits, so you choose with understanding.\n\n## Ask at the consultation\nThe type of anesthesia, how long it takes, home care and the follow-up date.',
    },
  },
  {
    slug: 'inguinal-hernia-wait',
    procedure: 'inguinal-hernia',
    title: { ar: 'الفتق الإربي عند الأطفال: نستنى ولا لأ؟', en: 'Inguinal hernia in children: wait or not?' },
    excerpt: { ar: 'إيه اللي بيحدد التوقيت، وإمتى تروح الطوارئ على طول.', en: 'What decides the timing, and when to go to emergency straight away.' },
    body: {
      ar: '## التوقيت\nالدكتور بيحدد التوقيت بعد الكشف، وبيشرحلك ليه.\n\n## علامات تستدعي الطوارئ\nلو الانتفاخ بقى جامد ومؤلم ومش بيرجع، أو الطفل بيرجّع ومش مرتاح، روح الطوارئ على طول.\n\n## قبل القرار\nاسأل عن نوع العملية، والتخدير، والرجوع للحياة العادية.',
      en: '## Timing\nThe doctor sets the timing after the examination and explains why.\n\n## Signs that need emergency care\nIf the swelling becomes hard and painful and does not go back, or the child is vomiting and unsettled, go to emergency straight away.\n\n## Before you decide\nAsk about the type of operation, the anesthesia and getting back to normal life.',
    },
  },
  {
    slug: 'undescended-testis-questions',
    procedure: 'undescended-testis',
    title: { ar: 'الخصية المعلقة: الأسئلة اللي بتقلق الأهل', en: 'Undescended testis: the questions that worry parents' },
    excerpt: { ar: 'إمتى بيتعمل الكشف، وليه التوقيت مهم، وإيه اللي تسأله.', en: 'When it is checked, why timing matters, and what to ask.' },
    body: {
      ar: '## إمتى تكشف؟\nلو لاحظت حاجة في الكشف الدوري للطفل، الدكتور بيفحص ويشرحلك اللي لقاه.\n\n## ليه التوقيت مهم؟\nالدكتور بيوضح التوقيت المناسب لحالة طفلك وأسبابه.\n\n## اسأل عن\nالفحوصات المطلوبة، ونوع العملية لو محتاجة، والمتابعة بعدها.',
      en: '## When to get it checked\nIf something is noticed at a routine check, the doctor examines and explains what they find.\n\n## Why timing matters\nThe doctor explains the right timing for your child and the reasons.\n\n## Ask about\nThe tests needed, the type of operation if one is needed, and follow-up afterwards.',
    },
  },
]
