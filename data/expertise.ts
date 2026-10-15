import type { LocalizedText } from "@/types/site";

export type Expertise = {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  intro: LocalizedText;
  sections: { title: LocalizedText; body: LocalizedText }[];
  projectIds: string[];
  designReference?: { url: string; label: LocalizedText };
};

// Editorial content is versioned here, independently of existing CMS documents.
export const expertise: Expertise[] = [
  {
    slug: "flutter-mobile-development",
    title: { en: "Flutter & Mobile App Development in Libya", ar: "تطوير تطبيقات الجوال باستخدام Flutter في ليبيا" },
    description: { en: "Hire Aimen Elwahab, a Flutter developer in Tripoli, Libya, for Android/iOS apps, architecture and API integration. Available across Libya and remotely worldwide.", ar: "أيمن الوهاب، مطور تطبيقات Flutter في طرابلس، ليبيا. تطوير Android وiOS وبنية التطبيق وتكامل API. متاح لمشاريع ليبيا والعمل عن بُعد حول العالم." },
    intro: { en: "I’m Aimen Elwahab, a software engineer based in Tripoli, Libya, specializing in Flutter and Dart. I’m available for work across Libya and remote projects worldwide. I develop mobile applications for Android and iOS, including the interfaces, state management, navigation, and service integration that connect a screen to a working product. My portfolio includes vehicle-service, pharmacy-purchasing, and learning applications.", ar: "أنا أيمن الوهاب، مهندس برمجيات مقيم في طرابلس، ليبيا، متخصص في Flutter وDart. أستقبل فرص العمل والمشاريع من مختلف المدن الليبية، وأعمل عن بُعد مع فرق وعملاء حول العالم. أعمل على برمجة تطبيقات Android وiOS، من بناء الواجهات وإدارة الحالة والتنقل إلى ربط التطبيق بالخدمات والبيانات. تشمل مشاريعي تطبيقات لخدمات السيارات ومشتريات الصيدليات والتعليم." },
    sections: [
      {
        title: { en: "From requirements to application workflows", ar: "من المتطلبات إلى مسارات الاستخدام" },
        body: { en: "An application starts with the work people need to complete. For a booking app, that means choosing a service, supplying the necessary details, submitting a request, and following its status. For a learning app, it means finding a course and reaching the right lesson. I use these workflows to organize features and screens before connecting the interface to APIs. Loading, empty, and error states are part of that implementation, alongside the successful path.", ar: "أبدأ بفهم ما يحتاج المستخدم إلى إنجازه. في تطبيق الحجز، يشمل ذلك اختيار الخدمة وإدخال البيانات وإرسال الطلب ومتابعة حالته. وفي التطبيق التعليمي، يحتاج الطالب إلى العثور على الدورة والوصول إلى الدرس. تساعد هذه المسارات في تنظيم الميزات والشاشات، ثم ربطها بواجهات API، مع الاهتمام بحالات التحميل وعدم وجود بيانات والأخطاء، إلى جانب المسار الأساسي." },
      },
      {
        title: { en: "Flutter architecture and maintainable code", ar: "بنية تطبيق Flutter وقابلية الصيانة" },
        body: { en: "My stack includes Cubit/BLoC for state management, GoRouter for navigation, and feature-first organization. Depending on the application, I use Clean Architecture and repository boundaries to separate presentation from data access. Mekdam also uses GetIt and Injectable for dependency injection. These choices give each feature a defined place in the codebase and make it easier to change a screen or integration without spreading the change across the application.", ar: "أستخدم Cubit/BLoC لإدارة الحالة وGoRouter للتنقل، مع تنظيم الكود حسب الميزات. وبحسب احتياجات المشروع، أستفيد من Clean Architecture وفصل طبقة العرض عن الوصول إلى البيانات. أستخدم في Mekdam أيضًا GetIt وInjectable لحقن الاعتماديات. يساعد هذا التنظيم على تحديد مسؤولية كل جزء وتعديل الواجهة أو التكامل دون توزيع التغيير على أجزاء متفرقة من التطبيق." },
      },
      {
        title: { en: "Integrations demonstrated in my projects", ar: "تكامل الخدمات في مشاريعي" },
        body: { en: "Salahly brings together service booking, vehicle records, maps, notifications, invoices, and payment workflows using Flutter, Supabase, Dio, Google Maps, and FCM. Ostad demonstrates course discovery, video lessons, and question practice with REST API integration. Mekdam focuses on Arabic pharmacy purchasing and order flows. Each case study shows its current status and screenshots so you can assess the work relevant to your application.", ar: "يجمع صلّحلي بين حجز الخدمات وبيانات المركبات والخرائط والإشعارات والفواتير ومسارات الدفع باستخدام Flutter وSupabase وDio وGoogle Maps وFCM. ويعرض Ostad مسارات الدورات ودروس الفيديو والتدريب على الأسئلة مع تكامل REST APIs. أما Mekdam فيركز على مشتريات الصيدليات والطلبات بواجهة عربية. توضح تفاصيل كل مشروع حالته الحالية وشاشاته لتقييم مدى ارتباطه باحتياجات تطبيقك." },
      },
      {
        title: { en: "Discuss a new app or an existing codebase", ar: "تطوير تطبيق جديد أو استكمال تطبيق قائم" },
        body: { en: "I can contribute to a new mobile product or an existing Flutter application. To scope the work, share the target users, Android/iOS requirements, current designs, available APIs, and the main workflow you need to deliver. For an existing app, include the state of the codebase and the integration or release issues you want addressed. Scope and release preparation depend on the actual application and platform requirements.", ar: "يمكنني المساهمة في بناء تطبيق جديد أو استكمال تطبيق Flutter قائم. لتحديد نطاق العمل، أرسل الفئة المستهدفة والمنصات المطلوبة والتصاميم المتاحة وواجهات API وأهم مسار تريد تنفيذه. وإذا كان التطبيق قائمًا، وضّح حالة الكود ومشكلات التكامل أو تجهيز الإصدار التي تحتاج إلى معالجتها. يتحدد نطاق التنفيذ وتجهيز النشر وفق متطلبات التطبيق والمنصة." },
      },
    ],
    projectIds: ["salahly", "ostad", "mekdam"],
  },
  {
    slug: "supabase-api-integration",
    title: { en: "Supabase Backend & API Integration", ar: "تطوير الأنظمة الخلفية باستخدام Supabase وتكامل API" },
    description: { en: "Supabase, PostgreSQL, and REST API integration for Flutter apps by Aimen Elwahab in Libya. Explore authentication, data access, and Salahly project evidence.", ar: "تطوير الأنظمة الخلفية وتكامل REST APIs لتطبيقات Flutter مع أيمن الوهاب في ليبيا. Supabase وPostgreSQL وتسجيل الدخول والوصول للبيانات، مع مثال صلّحلي." },
    intro: { en: "My backend work supports mobile application workflows: authenticating users, reading and updating application data, storing files, and connecting external services. I use Supabase and PostgreSQL alongside Flutter, with Dio for REST API integration. The focus is on making the application and its backend work together with clear data and access boundaries.", ar: "يركز عملي في الأنظمة الخلفية على احتياجات تطبيق الجوال: تسجيل دخول المستخدمين وقراءة البيانات وتحديثها وحفظ الملفات وربط الخدمات الخارجية. أستخدم Supabase وPostgreSQL مع Flutter، وأعتمد على Dio لتكامل REST APIs، مع تنظيم البيانات وصلاحيات الوصول بين التطبيق والخادم." },
    sections: [
      {
        title: { en: "Authentication and database access", ar: "تسجيل الدخول والوصول إلى قاعدة البيانات" },
        body: { en: "Supabase provides authentication, PostgreSQL, storage, and Edge Functions for application workflows. My existing services include connecting those capabilities to the mobile interface and working with Row Level Security. Access rules belong on the backend; hiding a button in the app is not an authorization rule. A useful starting point is defining which users can view or change each record, and how the app handles a session that expires during a workflow.", ar: "يوفر Supabase تسجيل الدخول وقاعدة PostgreSQL والتخزين وEdge Functions. يشمل عملي ربط هذه الإمكانات بواجهة التطبيق والتعامل مع Row Level Security. تُطبّق صلاحيات الوصول في النظام الخلفي؛ فإخفاء زر في الواجهة لا يمنع الوصول إلى البيانات. لذلك يبدأ تنظيم الصلاحيات بتحديد من يستطيع قراءة كل سجل أو تعديله، وكيف يتعامل التطبيق مع انتهاء الجلسة أثناء الاستخدام." },
      },
      {
        title: { en: "REST APIs and application state", ar: "تكامل REST APIs وحالة التطبيق" },
        body: { en: "I integrate REST services using Dio and connect the responses to Cubit/BLoC state. The interface needs to distinguish loading, success, empty results, and request failure. Request models, response handling, and navigation should agree on what the user can do next. Ostad lists REST APIs in its current stack; Salahly combines Dio with Supabase and other mobile services. The case studies describe the application context rather than presenting an unsupported standalone API product.", ar: "أربط خدمات REST باستخدام Dio، وأوصل الاستجابات بحالة التطبيق عبر Cubit/BLoC. تحتاج الواجهة إلى التمييز بين التحميل والنجاح والنتائج الفارغة وفشل الطلب. ويجب أن تتوافق بيانات الطلب ومعالجة الاستجابة والتنقل مع الخطوة التالية للمستخدم. يستخدم Ostad واجهات REST APIs، بينما يجمع صلّحلي بين Dio وSupabase وخدمات الجوال الأخرى. تعرض دراسات المشاريع سياق هذا التكامل داخل التطبيق." },
      },
      {
        title: { en: "Salahly: connected vehicle-service workflows", ar: "صلّحلي: ربط مسارات خدمات المركبات" },
        body: { en: "Salahly is the relevant portfolio example for this area. Its existing description and stack cover service requests, appointment selection, booking status, vehicle records, notifications, invoices, payments, and maps. The listed tools include Supabase, Dio, Google Maps, and FCM. Those workflows illustrate the need to keep interface state aligned with service data. The project page includes the current screens and separates the product problem from my development contribution.", ar: "صلّحلي هو المثال الأوضح في أعمالي لهذا المجال. يشمل وصفه طلب الخدمات واختيار الموعد ومتابعة الحجز وبيانات المركبات والإشعارات والفواتير والمدفوعات والخرائط. ومن تقنياته Supabase وDio وGoogle Maps وFCM. تتطلب هذه المسارات توافق حالة الواجهة مع بيانات الخدمة، وتعرض صفحة المشروع الشاشات الحالية مع توضيح المشكلة التي يعالجها التطبيق ومساهمتي في تطويره." },
      },
      {
        title: { en: "What to share for an integration review", ar: "ما أحتاجه لمراجعة التكامل" },
        body: { en: "Share the API documentation, authentication method, data model, user roles, and the mobile screens involved. If a backend already exists, describe which requests fail and how the interface currently handles them. For a Supabase application, identify the tables, storage needs, and access rules relevant to the workflow. This establishes whether the work is API integration, a backend change, or both, before agreeing on the implementation scope.", ar: "أرسل توثيق API وطريقة تسجيل الدخول ونموذج البيانات وأدوار المستخدمين والشاشات المرتبطة بها. وإذا كان النظام الخلفي قائمًا، وضّح الطلبات التي تواجه مشكلة وطريقة تعامل الواجهة معها. وفي مشروع Supabase، نحدد الجداول واحتياجات التخزين وقواعد الوصول المتعلقة بمسار الاستخدام. يساعد ذلك على معرفة ما إذا كان المطلوب ربط API أو تعديل النظام الخلفي أو كليهما، قبل الاتفاق على نطاق التنفيذ." },
      },
    ],
    projectIds: ["salahly", "ostad"],
  },
  {
    slug: "flutter-ui-implementation",
    title: { en: "Mobile UI Design & Flutter Implementation", ar: "تصميم واجهات التطبيقات وتنفيذها باستخدام Flutter" },
    description: { en: "Mobile UI design in Figma and Flutter implementation by Aimen Elwahab in Tripoli, Libya. Arabic RTL interfaces, reusable components and education-app designs.", ar: "تصميم واجهات تطبيقات الجوال في Figma وتنفيذها باستخدام Flutter مع أيمن الوهاب في طرابلس، ليبيا. واجهات عربية ومكونات قابلة لإعادة الاستخدام وأمثلة تعليمية." },
    intro: { en: "I design mobile interfaces in Figma and turn interface designs into working Flutter screens. My work includes reusable widgets, responsive layouts, Arabic and English presentation, navigation, and connection to application state. The portfolio includes Arabic learning and pharmacy interfaces as well as vehicle-service screens, with screenshots that show the work in context.", ar: "أصمم واجهات تطبيقات الجوال في Figma، وأحوّل التصاميم إلى شاشات Flutter عملية. يشمل عملي مكونات قابلة لإعادة الاستخدام، وتخطيطات متجاوبة، وعرض المحتوى بالعربية والإنجليزية، والتنقل وربط الواجهة بحالة التطبيق. تعرض أعمالي واجهات عربية للتعليم والصيدليات وخدمات المركبات، مع صور توضح سياق استخدامها." },
    sections: [
      {
        title: { en: "Arabic education-app interface design in Figma", ar: "تصميم واجهات تطبيق تعليمي عربي في Figma" },
        body: { en: "My education-app design includes an Arabic learning home screen, subject cards for physics and chemistry, learning-progress indicators, course browsing, search, and bottom navigation. The linked canvas is labeled Meras and also contains reusable interface components. This example shows my interface-design work in Figma, alongside the Flutter implementation work shown in the application case studies.", ar: "يتضمن تصميمي للتطبيق التعليمي شاشة رئيسية عربية، وبطاقات لمادتي الفيزياء والكيمياء، ومؤشرات لتقدم التعلم، وتصفّح المقررات والبحث والتنقل السفلي. تحمل لوحة التصميم اسم مِراس، وتضم أيضًا مكونات واجهة قابلة لإعادة الاستخدام. يعرض هذا المثال عملي في تصميم الواجهات باستخدام Figma، إلى جانب أعمال تنفيذ تطبيقات Flutter المعروضة في صفحات المشاريع." },
      },
      {
        title: { en: "From Figma designs to reusable widgets", ar: "من تصاميم Figma إلى مكونات قابلة لإعادة الاستخدام" },
        body: { en: "A design needs consistent implementation across forms, cards, buttons, and repeated application patterns. I build reusable Flutter interfaces and preserve design-system consistency across phone and tablet layouts. To begin, share the design file, component states, typography, spacing, and assets. We can then identify shared widgets and the screens that need their own layout behavior, rather than treating every screenshot as an isolated page.", ar: "يحتاج تنفيذ التصميم إلى اتساق النماذج والبطاقات والأزرار والعناصر المتكررة. أبني واجهات Flutter قابلة لإعادة الاستخدام مع الحفاظ على اتساق نظام التصميم عبر الهاتف والجهاز اللوحي. نبدأ بملف التصميم وحالات المكونات والخطوط والمسافات والأصول البصرية، ثم نحدد المكونات المشتركة والشاشات التي تحتاج إلى تخطيط خاص، حتى يصبح التصميم جزءًا من تطبيق مترابط." },
      },
      {
        title: { en: "Arabic RTL and mixed-language content", ar: "دعم العربية واتجاه RTL والمحتوى المختلط" },
        body: { en: "An Arabic interface needs more than translated labels. Text direction, navigation, alignment, and mixed-language values need deliberate handling. Mekdam lists Arabic RTL, Changa, and Inter in its stack, and its screenshots show medicine search, carts, and order information. Technical names, quantities, and product data must remain readable within the Arabic layout. These are implementation concerns I can discuss against your actual screens and content.", ar: "لا يقتصر دعم العربية على ترجمة العناوين. يشمل العمل اتجاه النص والتنقل والمحاذاة وعرض القيم التي تجمع العربية والأرقام والأسماء الأجنبية. يتضمن Mekdam دعم Arabic RTL وخطّي Changa وInter، وتعرض شاشاته البحث عن الأدوية والسلة وبيانات الطلبات. تحتاج أسماء المنتجات والكميات والمعلومات التقنية إلى عرض واضح داخل الواجهة العربية، وهو ما نراجعه وفق المحتوى الفعلي للتطبيق." },
      },
      {
        title: { en: "Screens connected to real application states", ar: "واجهات مرتبطة بحالات التطبيق الفعلية" },
        body: { en: "A working screen has states beyond the design’s default view: a form may be incomplete, a course list may be empty, or an order request may still be loading. I connect interfaces to Cubit/BLoC and route flows using GoRouter. Ostad illustrates course discovery and learning screens; Mekdam illustrates purchasing and order review. Both are marked as in development, and their case studies show the current screens without implying a finished release.", ar: "للشاشة حالات تتجاوز الصورة الأساسية في التصميم؛ فقد يكون النموذج غير مكتمل أو قائمة الدورات فارغة أو طلب البيانات قيد التحميل. أربط الواجهات بـ Cubit/BLoC، وأنظم التنقل باستخدام GoRouter. يعرض Ostad شاشات تصفّح الدورات والتعلم، ويعرض Mekdam مسارات الشراء ومراجعة الطلبات. كلا المشروعين قيد التطوير، وتوضح صفحاتهما الشاشات الحالية دون اعتبارها إصدارًا نهائيًا." },
      },
      {
        title: { en: "Scope a UI implementation project", ar: "تحديد نطاق تنفيذ الواجهات" },
        body: { en: "Share the Figma file, target devices, required languages, existing Flutter architecture, and API readiness. It also helps to identify which screens already work and which need implementation or refactoring. My services include mobile interface design in Figma and Flutter UI development. If the project also needs user research, brand design, or a new UX strategy, define those deliverables separately so the engineering work starts from agreed designs and requirements.", ar: "أرسل ملف Figma والأجهزة المستهدفة واللغات المطلوبة وبنية تطبيق Flutter الحالية ومدى جاهزية API. ومن المفيد تحديد الشاشات التي تعمل بالفعل وما يحتاج إلى تنفيذ أو إعادة تنظيم. تشمل خدماتي تصميم واجهات الجوال في Figma وتطويرها باستخدام Flutter. وإذا كان المشروع يحتاج أيضًا إلى بحث المستخدمين أو تصميم الهوية أو استراتيجية تجربة المستخدم، نحدد هذه المخرجات بصورة مستقلة لتبدأ البرمجة من تصاميم ومتطلبات متفق عليها." },
      },
    ],
    designReference: {
      url: "https://www.figma.com/design/mXRJRiYIfXrL04XpF2Mu1r/Ousted-Education-App?node-id=2027-55",
      label: { en: "Explore my Arabic education-app interface design in Figma", ar: "تصفّح تصميمي لواجهات تطبيق تعليمي عربي في Figma" },
    },
    projectIds: ["mekdam", "ostad", "salahly"],
  },
];
