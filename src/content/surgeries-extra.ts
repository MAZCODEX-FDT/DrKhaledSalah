import type { L } from '../lib/i18n'
import type { Surgery } from './site'

/**
 * Additional procedures (draft copy, Nov 2026).
 * Every medical statement here is a DRAFT for Dr. Khaled Salah to review and approve before launch.
 * Rules: no promises of results, no prices, never assume the child's condition.
 */

const approach: L[] = [
  { ar: 'كشف بيتشرح فيه كل شيء قبل أي قرار', en: 'A consultation where everything is explained before any decision' },
  { ar: 'خطة مكتوبة بالخطوات والتخدير والميعاد', en: 'A written plan with steps, anesthesia and date' },
  { ar: 'متابعة بعد الإجراء وخط مفتوح لأي سؤال', en: 'Follow-up after the procedure and an open line for questions' },
]

const steps = (procedure: L): Surgery['steps'] => [
  { t: { ar: 'الكشف', en: 'Consultation' }, d: { ar: 'نفحص الطفل ونسمع أسئلة حضرتك.', en: 'We examine the child and hear your questions.' } },
  { t: { ar: 'الشرح', en: 'Explanation' }, d: { ar: 'الخيارات والتخدير والتعافي، بالتفصيل.', en: 'Options, anesthesia and recovery, in detail.' } },
  { t: procedure, d: { ar: 'في المستشفى، بفريق جراحة الأطفال.', en: 'In hospital, with a pediatric surgical team.' } },
  { t: { ar: 'المتابعة', en: 'Follow-up' }, d: { ar: 'رسالة بعدها وزيارة اطمئنان.', en: 'A message afterwards and a check-up visit.' } },
]

const urgent: L = {
  ar: 'لو الطفل عنده ألم شديد أو ترجيع مستمر أو تعب مفاجئ، توجّه لأقرب طوارئ فورًا.',
  en: 'If a child has severe pain, persistent vomiting or sudden illness, go to the nearest emergency department straight away.',
}

type Draft = Omit<Surgery, 'index' | 'approach' | 'steps' | 'tone'> & { op: L; tone?: string; approach?: L[] }

const drafts: Draft[] = [
  {
    slug: 'umbilical-hernia',
    op: { ar: 'العملية', en: 'Surgery' },
    name: { ar: 'فتق السرة', en: 'Umbilical Hernia' },
    short: { ar: 'إمتى بنستنى وإمتى العملية بتكون الأنسب، بنشرحها لحضرتك بوضوح.', en: 'When to wait and when surgery is the better choice, explained clearly.' },
    hero: { ar: 'فتق السرة، من غير قلق زيادة', en: 'Umbilical hernia, without needless worry' },
    what: {
      ar: 'بروز السرة من أكتر الحاجات اللي بتقلق الأهل في السنين الأولى. الكشف بيحدد حجم الفتحة وسن الطفل، وبناءً عليه بنشرح هل الأنسب المتابعة ولا العملية، وليه.',
      en: 'A bulging belly button is one of the most common worries in the early years. Examination looks at the size of the opening and the child\'s age, and we explain whether watching or surgery is more suitable, and why.',
    },
    signs: [
      { ar: 'هل فتق السرة بيقفل لوحده؟', en: 'Can an umbilical hernia close on its own?' },
      { ar: 'السن المناسب للعملية لو احتاجها', en: 'The right age for surgery, if needed' },
      { ar: 'علامات لازم تاخد بالك منها', en: 'Signs to watch for' },
      { ar: 'الرباط والعملات المعدنية: صح ولا غلط؟', en: 'Belly binders and coins: helpful or not?' },
    ],
    faqs: [
      { q: { ar: 'هل لازم عملية لفتق السرة؟', en: 'Does every umbilical hernia need surgery?' }, a: { ar: 'مش دايمًا. ده بيتحدد بالكشف حسب حجم الفتحة وسن الطفل، والدكتور بيشرح السبب في الحالتين.', en: 'Not always. Examination decides based on the opening and the child\'s age, and the doctor explains the reasoning either way.' } },
      { q: { ar: 'إيه العلامات اللي تستدعي طوارئ؟', en: 'Which signs need emergency care?' }, a: urgent },
    ],
  },
  {
    slug: 'hydrocele',
    op: { ar: 'العملية', en: 'Surgery' },
    name: { ar: 'القيلة المائية', en: 'Hydrocele' },
    short: { ar: 'تورّم كيس الخصية عند الأطفال: الفرق بين المتابعة والعملية بيتشرح قبل أي قرار.', en: 'Scrotal swelling in children: the difference between watching and surgery, explained first.' },
    hero: { ar: 'القيلة المائية، مفهومة خطوة بخطوة', en: 'Hydrocele, understood step by step' },
    what: {
      ar: 'القيلة المائية تجمّع سوائل حوالين الخصية، وبتظهر كتير عند المواليد. بعضها بيختفي مع الوقت، وبعضها بيحتاج تدخل. الكشف بيوضّح نوعها، وبنتفق مع حضرتك على الخطوة الجاية.',
      en: 'A hydrocele is fluid around the testis and is common in newborns. Some resolve with time and some need treatment. Examination clarifies the type, and we agree the next step with you.',
    },
    signs: [
      { ar: 'الفرق بين القيلة المائية والفتق', en: 'Hydrocele versus hernia' },
      { ar: 'إمتى بتختفي لوحدها', en: 'When it may resolve on its own' },
      { ar: 'السن المناسب للعملية', en: 'The right age for surgery' },
      { ar: 'العناية بعد العملية', en: 'Care after surgery' },
    ],
    faqs: [
      { q: { ar: 'هل القيلة المائية خطيرة؟', en: 'Is a hydrocele dangerous?' }, a: { ar: 'ده بيتحدد بالكشف حسب نوعها. الدكتور بيشرح لحضرتك الفرق بينها وبين الفتق وإمتى بنستنى.', en: 'That depends on the type, which examination shows. The doctor explains how it differs from a hernia and when waiting is reasonable.' } },
      { q: { ar: 'العملية بتاخد قد إيه؟', en: 'How long does the operation take?' }, a: { ar: 'المدة والتخدير بيتشرحوا بالتفصيل في الكشف، وبتاخدهم مكتوبين.', en: 'Duration and anesthesia are explained in detail at the consultation, and you get them in writing.' } },
    ],
  },
  {
    slug: 'tongue-tie',
    op: { ar: 'الإجراء', en: 'Procedure' },
    name: { ar: 'لجام اللسان', en: 'Tongue-tie' },
    short: { ar: 'تقييم لجام اللسان عند المواليد والأطفال، ومتى يكون فكّه مفيد.', en: 'Assessing tongue-tie in babies and children, and when releasing it helps.' },
    hero: { ar: 'لجام اللسان، بتقييم هادي', en: 'Tongue-tie, assessed calmly' },
    what: {
      ar: 'أسئلة كتير بتوصلنا عن الرضاعة والكلام ولجام اللسان. مش كل لجام محتاج تدخل. التقييم بيشوف حركة اللسان وتأثيرها، وبنشرح لحضرتك إمتى الإجراء ممكن يفيد.',
      en: 'We hear many questions about feeding, speech and tongue-tie. Not every tongue-tie needs treatment. The assessment looks at tongue movement and its effect, and we explain when a release may help.',
    },
    signs: [
      { ar: 'لجام اللسان والرضاعة', en: 'Tongue-tie and feeding' },
      { ar: 'لجام اللسان والكلام', en: 'Tongue-tie and speech' },
      { ar: 'السن المناسب للإجراء', en: 'The right age for release' },
      { ar: 'تمارين بعد الإجراء', en: 'Exercises afterwards' },
    ],
    faqs: [
      { q: { ar: 'هل كل لجام لسان محتاج قص؟', en: 'Does every tongue-tie need cutting?' }, a: { ar: 'لأ. القرار بيتاخد بعد تقييم حركة اللسان وتأثيرها على الرضاعة أو الكلام.', en: 'No. The decision follows an assessment of tongue movement and its effect on feeding or speech.' } },
      { q: { ar: 'هل الطفل هيحتاج بنج؟', en: 'Will the child need anesthesia?' }, a: { ar: 'ده بيختلف حسب السن ونوع اللجام، وبيتشرحلك قبل أي قرار.', en: 'It depends on age and type, and it is explained before anything is decided.' } },
    ],
  },
  {
    slug: 'pyloric-stenosis',
    op: { ar: 'العملية', en: 'Surgery' },
    name: { ar: 'ضيق فتحة المعدة', en: 'Pyloric Stenosis' },
    short: { ar: 'حالة بتظهر في الأسابيع الأولى للمولود، وبنشرح للأهل كل خطوة بوضوح.', en: 'A condition of the first weeks of life, with every step explained clearly to parents.' },
    hero: { ar: 'ضيق فتحة المعدة عند المواليد', en: 'Pyloric stenosis in newborns' },
    what: {
      ar: 'ضيق فتحة المعدة بيظهر غالبًا في الأسابيع الأولى. التشخيص بيتأكد بالفحص والأشعة، وبعدها بنشرح لحضرتك العملية والتحضير والتغذية بعدها خطوة بخطوة.',
      en: 'Pyloric stenosis usually appears in the first weeks. Diagnosis is confirmed by examination and ultrasound, and then we explain the operation, preparation and feeding afterwards, step by step.',
    },
    signs: [
      { ar: 'إزاي بيتأكد التشخيص', en: 'How the diagnosis is confirmed' },
      { ar: 'التحضير قبل العملية', en: 'Preparation before surgery' },
      { ar: 'الرضاعة بعد العملية', en: 'Feeding after surgery' },
      { ar: 'مدة البقاء في المستشفى', en: 'Length of hospital stay' },
    ],
    faqs: [
      { q: { ar: 'إمتى أروح الطوارئ؟', en: 'When should I go to the emergency department?' }, a: urgent },
      { q: { ar: 'الرضاعة بترجع إمتى بعد العملية؟', en: 'When does feeding restart after surgery?' }, a: { ar: 'خطة الرضاعة بتتشرح وبتتكتب لحضرتك قبل الخروج من المستشفى.', en: 'The feeding plan is explained and written down for you before discharge.' } },
    ],
  },
  {
    slug: 'appendicitis',
    op: { ar: 'العملية', en: 'Surgery' },
    name: { ar: 'الزائدة الدودية', en: 'Appendicitis' },
    short: { ar: 'تقييم سريع وشرح واضح للأهل، بالمنظار أو الجراحة المفتوحة حسب الحالة.', en: 'Prompt assessment and a clear explanation, by laparoscopy or open surgery as suits the case.' },
    hero: { ar: 'الزائدة عند الأطفال، بوضوح وسرعة', en: 'Appendicitis in children, clearly and promptly' },
    what: {
      ar: 'ألم البطن عند الأطفال ليه أسباب كتير، والزائدة واحدة منها. التقييم بيعتمد على الكشف والتحاليل والأشعة، ولو العملية لازمة بنشرح لحضرتك الطريقة والتعافي قبل ما نبدأ.',
      en: 'Abdominal pain in children has many causes, and appendicitis is one. Assessment relies on examination, tests and imaging, and if surgery is needed we explain the method and recovery before we begin.',
    },
    signs: [
      { ar: 'إزاي بيتشخص التهاب الزائدة', en: 'How appendicitis is diagnosed' },
      { ar: 'المنظار ولا الجراحة المفتوحة', en: 'Laparoscopy or open surgery' },
      { ar: 'مدة البقاء في المستشفى', en: 'Length of hospital stay' },
      { ar: 'الرجوع للمدرسة والرياضة', en: 'Returning to school and sport' },
    ],
    faqs: [
      { q: { ar: 'إمتى ألم البطن يستدعي طوارئ؟', en: 'When does tummy pain need emergency care?' }, a: urgent },
      { q: { ar: 'هل العملية بالمنظار؟', en: 'Is it done by laparoscopy?' }, a: { ar: 'الطريقة بتتحدد حسب الحالة، والدكتور بيشرح لحضرتك الفرق قبل العملية.', en: 'The method depends on the case, and the doctor explains the difference before surgery.' } },
    ],
  },
  {
    slug: 'intussusception',
    op: { ar: 'العلاج', en: 'Treatment' },
    name: { ar: 'انغلاف الأمعاء', en: 'Intussusception' },
    short: { ar: 'حالة طارئة عند الرضّع والأطفال الصغيرين، وبنشرح للأهل الخيارات بهدوء.', en: 'An urgent condition in infants and toddlers, with the options explained calmly to parents.' },
    hero: { ar: 'انغلاف الأمعاء، خطوة بخطوة', en: 'Intussusception, step by step' },
    what: {
      ar: 'انغلاف الأمعاء حالة طارئة بتحتاج تقييم سريع. أحيانًا بتتعالج من غير جراحة، وأحيانًا العملية بتكون لازمة. بنشرح لحضرتك كل خيار وليه.',
      en: 'Intussusception is urgent and needs prompt assessment. Sometimes it is treated without surgery and sometimes an operation is needed. We explain each option and why.',
    },
    signs: [
      { ar: 'العلامات اللي تستدعي طوارئ', en: 'Signs that need emergency care' },
      { ar: 'العلاج من غير جراحة', en: 'Treatment without surgery' },
      { ar: 'إمتى العملية بتكون لازمة', en: 'When surgery is needed' },
      { ar: 'المتابعة بعد الخروج', en: 'Follow-up after discharge' },
    ],
    faqs: [
      { q: { ar: 'أعمل إيه لو قلقان؟', en: 'What should I do if I am worried?' }, a: urgent },
      { q: { ar: 'هل الحالة ممكن ترجع تاني؟', en: 'Can it happen again?' }, a: { ar: 'ده سؤال بيتجاوب عليه بصراحة في المتابعة حسب الحالة، ومعاه العلامات اللي تاخد بالك منها.', en: 'This is answered openly at follow-up for the individual case, together with the signs to watch for.' } },
    ],
  },
  {
    slug: 'varicocele',
    op: { ar: 'العملية', en: 'Surgery' },
    name: { ar: 'دوالي الخصية للمراهقين', en: 'Adolescent Varicocele' },
    short: { ar: 'تقييم دوالي الخصية في سن المراهقة، ومتى تكون المتابعة كافية.', en: 'Assessing varicocele in adolescents, and when monitoring is enough.' },
    hero: { ar: 'دوالي الخصية في سن المراهقة', en: 'Varicocele in adolescence' },
    what: {
      ar: 'دوالي الخصية بتظهر غالبًا في سن المراهقة. مش كل الحالات محتاجة عملية. الكشف والأشعة بيحددوا الدرجة، وبنشرح للأهل وللشاب نفسه الخيارات بهدوء.',
      en: 'Varicocele usually appears in adolescence. Not every case needs surgery. Examination and ultrasound define the grade, and we explain the options calmly to parents and to the young person.',
    },
    signs: [
      { ar: 'درجات الدوالي', en: 'Grades of varicocele' },
      { ar: 'المتابعة ولا العملية', en: 'Monitoring or surgery' },
      { ar: 'طرق العملية المختلفة', en: 'Surgical approaches' },
      { ar: 'الرياضة بعد العملية', en: 'Sport after surgery' },
    ],
    faqs: [
      { q: { ar: 'هل كل دوالي محتاجة عملية؟', en: 'Does every varicocele need surgery?' }, a: { ar: 'لأ. القرار بيتاخد حسب الدرجة ونتيجة الأشعة، والدكتور بيشرح السبب في الحالتين.', en: 'No. It depends on the grade and the ultrasound, and the doctor explains the reasoning either way.' } },
      { q: { ar: 'العملية بالمنظار؟', en: 'Is it done by laparoscopy?' }, a: { ar: 'فيه أكتر من طريقة، وبتتشرح مميزات كل واحدة في الكشف.', en: 'There is more than one approach, and the pros of each are explained at the consultation.' } },
    ],
  },
  {
    slug: 'neck-swellings',
    op: { ar: 'العملية', en: 'Surgery' },
    name: { ar: 'أكياس وتورّمات الرقبة', en: 'Neck Cysts & Swellings' },
    short: { ar: 'تقييم أكياس وتورّمات الرقبة عند الأطفال، بشرح واضح لكل خطوة.', en: 'Assessing neck cysts and swellings in children, with every step explained.' },
    hero: { ar: 'تورّمات الرقبة، مفهومة قبل أي قرار', en: 'Neck swellings, understood before any decision' },
    what: {
      ar: 'تورّمات الرقبة عند الأطفال ليها أسباب مختلفة، منها الغدد الليمفاوية والأكياس الخلقية. التقييم بالكشف والأشعة بيحدد النوع، وبنشرح لحضرتك هل محتاج متابعة ولا تدخل.',
      en: 'Neck swellings in children have different causes, including lymph nodes and congenital cysts. Examination and ultrasound define the type, and we explain whether it needs monitoring or treatment.',
    },
    signs: [
      { ar: 'أنواع تورّمات الرقبة', en: 'Types of neck swelling' },
      { ar: 'الأشعة المطلوبة', en: 'Which scans are needed' },
      { ar: 'إمتى بيحتاج استئصال', en: 'When removal is advised' },
      { ar: 'شكل الجرح بعد العملية', en: 'The scar after surgery' },
    ],
    faqs: [
      { q: { ar: 'هل كل تورّم في الرقبة محتاج عملية؟', en: 'Does every neck swelling need surgery?' }, a: { ar: 'لأ. كتير منها بيتابع بس. الكشف والأشعة بيحددوا، والدكتور بيشرح السبب.', en: 'No. Many only need monitoring. Examination and imaging decide, and the doctor explains why.' } },
      { q: { ar: 'شكل الجرح هيبان؟', en: 'Will the scar show?' }, a: { ar: 'مكان وطريقة الجرح بيتشرحوا قبل العملية بالتفصيل.', en: 'The position and technique of the incision are explained in detail beforehand.' } },
    ],
  },
  {
    slug: 'neonatal-surgery',
    op: { ar: 'الجراحة', en: 'Surgery' },
    name: { ar: 'جراحات حديثي الولادة', en: 'Neonatal Surgery' },
    short: { ar: 'عيوب خلقية بتحتاج جراحة في الأيام الأولى، بخطة واضحة ومتابعة قريبة للأهل.', en: 'Congenital conditions needing surgery in the first days, with a clear plan and close contact with parents.' },
    hero: { ar: 'جراحات حديثي الولادة، بخطة واضحة', en: 'Newborn surgery, with a clear plan' },
    what: {
      ar: 'بعض المواليد بيحتاجوا جراحة في أيامهم الأولى، زي انسداد الأمعاء وعيوب جدار البطن وارتجاع المريء الخلقي. بنشتغل مع فريق الحضانات، وبنشرح للأهل كل مرحلة وإيه اللي متوقع.',
      en: 'Some newborns need surgery in their first days, for example for intestinal obstruction, abdominal wall defects or oesophageal atresia. We work with the neonatal unit team and explain every stage and what to expect.',
    },
    signs: [
      { ar: 'التشخيص قبل الولادة', en: 'Diagnosis before birth' },
      { ar: 'التنسيق مع الحضانة', en: 'Working with the neonatal unit' },
      { ar: 'مراحل العلاج', en: 'Stages of treatment' },
      { ar: 'التغذية والمتابعة بعد الخروج', en: 'Feeding and follow-up after discharge' },
    ],
    faqs: [
      { q: { ar: 'اتعرف إن المولود هيحتاج جراحة قبل الولادة. نعمل إيه؟', en: 'We were told before birth that our baby will need surgery. What now?' }, a: { ar: 'ممكن نبدأ باستشارة قبل الولادة نشرح فيها الخطة والتنسيق مع مكان الولادة.', en: 'We can begin with a consultation before birth to explain the plan and coordinate with the place of delivery.' } },
      { q: { ar: 'هل الأهل يقدروا يتابعوا مع الدكتور مباشرة؟', en: 'Can parents keep in direct touch with the doctor?' }, a: { ar: 'أيوه، فيه تواصل مباشر طول فترة الحضانة والمتابعة.', en: 'Yes, there is direct contact throughout the neonatal stay and follow-up.' } },
    ],
  },
  {
    slug: 'anorectal-malformations',
    op: { ar: 'الجراحة', en: 'Surgery' },
    name: { ar: 'تشوهات فتحة الشرج الخلقية', en: 'Anorectal Malformations' },
    short: { ar: 'خطة علاج على مراحل، بشرح واضح لكل مرحلة ومتابعة طويلة مع الأهل.', en: 'A staged treatment plan, with every stage explained and long-term follow-up with parents.' },
    hero: { ar: 'تشوهات الشرج الخلقية، خطة لكل حالة', en: 'Anorectal malformations, a plan for every case' },
    what: {
      ar: 'تشوهات فتحة الشرج الخلقية بتتشخص غالبًا بعد الولادة مباشرة. كل حالة ليها خطتها، وأحيانًا العلاج بيكون على أكتر من مرحلة. بنشرح لحضرتك كل خطوة والمتابعة على المدى الطويل.',
      en: 'Anorectal malformations are usually diagnosed right after birth. Each case has its own plan, sometimes in more than one stage. We explain each step and the long-term follow-up.',
    },
    signs: [
      { ar: 'نوع الحالة ودرجتها', en: 'Type and degree' },
      { ar: 'عدد المراحل المتوقعة', en: 'How many stages to expect' },
      { ar: 'العناية في البيت بين المراحل', en: 'Care at home between stages' },
      { ar: 'المتابعة على المدى الطويل', en: 'Long-term follow-up' },
    ],
    faqs: [
      { q: { ar: 'العلاج بياخد قد إيه؟', en: 'How long does treatment take?' }, a: { ar: 'بيختلف حسب نوع الحالة، وبتاخد خطة مكتوبة بالمراحل والتوقيت.', en: 'It depends on the type, and you receive a written plan with stages and timing.' } },
      { q: { ar: 'هل فيه متابعة بعد آخر عملية؟', en: 'Is there follow-up after the last operation?' }, a: { ar: 'أيوه، المتابعة بتستمر وبيتشرحلك جدولها.', en: 'Yes, follow-up continues, and its schedule is explained to you.' } },
    ],
  },
  {
    slug: 'hirschsprung',
    op: { ar: 'الجراحة', en: 'Surgery' },
    name: { ar: 'مرض هيرشسبرونج', en: 'Hirschsprung Disease' },
    short: { ar: 'تشخيص دقيق وخطة جراحية مشروحة للأهل خطوة بخطوة.', en: 'Careful diagnosis and a surgical plan explained to parents step by step.' },
    hero: { ar: 'هيرشسبرونج، بتشخيص دقيق وخطة واضحة', en: 'Hirschsprung disease, careful diagnosis and a clear plan' },
    what: {
      ar: 'الإمساك عند الأطفال ليه أسباب كتير، ونادرًا بيكون السبب مرض هيرشسبرونج. التشخيص بيحتاج فحوصات وعينة، ولو اتأكد بنشرح لحضرتك العملية والمتابعة بعدها.',
      en: 'Constipation in children has many causes, and rarely the cause is Hirschsprung disease. Diagnosis needs tests and a biopsy, and if confirmed we explain the operation and the follow-up afterwards.',
    },
    signs: [
      { ar: 'إزاي بيتأكد التشخيص', en: 'How the diagnosis is confirmed' },
      { ar: 'أنواع العمليات', en: 'Types of operation' },
      { ar: 'التغذية والإخراج بعد العملية', en: 'Feeding and bowel habits after surgery' },
      { ar: 'المتابعة على المدى الطويل', en: 'Long-term follow-up' },
    ],
    faqs: [
      { q: { ar: 'هل كل إمساك عند الأطفال معناه هيرشسبرونج؟', en: 'Does constipation mean Hirschsprung disease?' }, a: { ar: 'لأ، أغلب حالات الإمساك ليها أسباب تانية. الكشف بيحدد هل محتاجين فحوصات زيادة.', en: 'No, most constipation has other causes. Examination decides whether further tests are needed.' } },
      { q: { ar: 'العملية بتتعمل على كام مرحلة؟', en: 'How many stages does surgery take?' }, a: { ar: 'ده بيختلف من حالة للتانية، وبيتشرح بالتفصيل بعد التشخيص.', en: 'It varies between cases and is explained in detail after diagnosis.' } },
    ],
  },
  {
    slug: 'laparoscopic-surgery',
    op: { ar: 'المنظار', en: 'Laparoscopy' },
    name: { ar: 'جراحة المناظير للأطفال', en: 'Pediatric Laparoscopic Surgery' },
    short: { ar: 'إمتى المنظار بيكون مناسب للطفل، وإيه الفرق في التعافي، بشرح بسيط.', en: 'When laparoscopy suits a child and how recovery differs, explained simply.' },
    hero: { ar: 'المنظار للأطفال، مشروح ببساطة', en: 'Laparoscopy for children, simply explained' },
    what: {
      ar: 'جراحة المناظير بتستخدم فتحات صغيرة وكاميرا، وبتتعمل في عمليات زي الزائدة والخصية المعلّقة وبعض حالات الفتق. مش كل حالة مناسبة للمنظار، والكشف هو اللي بيحدد.',
      en: 'Laparoscopic surgery uses small openings and a camera, and is used for operations such as appendicitis, undescended testis and some hernias. Not every case suits laparoscopy, and examination decides.',
    },
    signs: [
      { ar: 'العمليات اللي ممكن تتعمل بالمنظار', en: 'Operations that can be done by laparoscopy' },
      { ar: 'الفرق في التعافي', en: 'How recovery differs' },
      { ar: 'التخدير في عمليات المنظار', en: 'Anesthesia for laparoscopy' },
      { ar: 'شكل الجروح بعد العملية', en: 'The scars afterwards' },
    ],
    faqs: [
      { q: { ar: 'هل المنظار دايمًا أحسن؟', en: 'Is laparoscopy always better?' }, a: { ar: 'مش دايمًا. كل طريقة ليها مكانها، والدكتور بيشرح ليه اختار الطريقة دي لحالة طفلك.', en: 'Not always. Each approach has its place, and the doctor explains why a method was chosen for your child.' } },
      { q: { ar: 'الطفل بيرجع البيت إمتى؟', en: 'When does the child go home?' }, a: { ar: 'ده بيختلف حسب العملية نفسها، وبيتقالك قبلها.', en: 'It depends on the operation, and you are told beforehand.' } },
    ],
  },
]

const tones = ['#2f6fd1', '#ffc83d', '#7cc4ee']

export const extraSurgeries: Surgery[] = drafts.map((d, i) => {
  const { op, ...rest } = d
  return {
    ...rest,
    index: String(i + 5).padStart(2, '0'),
    tone: d.tone ?? tones[i % tones.length],
    approach: d.approach ?? approach,
    steps: steps(op),
  }
})
