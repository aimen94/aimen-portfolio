# Bilingual keyword and content strategy

Research date: 15 October 2026. Sources: live web search samples and repository evidence. Search is directional, not a Libya geolocated Google rank tracker. No Keyword Planner, Ahrefs, Semrush, Search Console or paid search-volume data was available. **All volume, keyword difficulty, and traffic forecasts are unavailable/unverified.** Priorities below reflect relevance and observed intent, not numerical competition scores.

## Search-intent observations

- English Libya/Tripoli + Flutter searches returned individual developers, GitHub profiles, resumes and portfolios: relevant hiring intent with competition from other local specialists. Examples: [Abdurahman Ibrahim](https://abdurahman-ibrahem.ly/), [Mohanned Binmiskeen](https://www.mohanned.ly/), [Hamza Aboshhiwa](https://shewa.tech/). Inference: practical project evidence and specific engineering skills provide a useful way to differentiate; this does not establish low competition or guaranteed demand.
- Arabic app-development + Libya/Tripoli results included software companies and mobile-service pages. Examples: [Dimensions mobile development](https://dits.ly/ar/services/mobile-app-development), [ATC Soft](https://atcsoft.ly/), [Al Basera](https://www.al-basera.com/). Inference: generic commercial terms face agency competition; specific Flutter implementation and backend-integration needs are a better initial fit for an individual portfolio.
- Arabic exact Flutter + Libya searches produced mixed technology/training and developer results. Do not interpret sparse or broad matches as proven low difficulty or measurable search volume. Validate actual queries after launch.
- Pure Flutter, backend, and UI/UX keywords have mixed educational, job-seeking and buyer intent. A personal portfolio should qualify its scope with Libya, implementation, integration, and relevant project examples rather than imitate a general tutorial or agency site.

## Keyword-to-page mapping

Both `/en` and `/ar` versions exist for every URL below. Paths are deliberately consistent across languages for stable alternates and switching.

| Priority / distinct purpose | English intent / terms | Arabic intent / terms | Destination and evidence |
| --- | --- | --- | --- |
| P1 professional identity / hiring | Aimen Elwahab; Software Engineer Libya; Flutter Developer Libya; Mobile App Developer Libya | أيمن الوهاب؛ مهندس برمجيات في ليبيا؛ مطور Flutter؛ مطور تطبيقات في ليبيا | `/en`, `/ar`: name, role, location, projects, skills, contact |
| P1 mobile development / project inquiry | Hire Flutter Developer; Flutter Android and iOS app development; cross-platform app developer Libya | برمجة تطبيقات Android وiOS؛ تطوير تطبيقات الجوال باستخدام Flutter؛ مبرمج Flutter في ليبيا؛ إنشاء تطبيقات الهاتف | `/{locale}/expertise/flutter-mobile-development`: architecture, workflows, integrations, delivery inputs; Salahly, Mekdam, Ostad |
| P1 integration / engineering support | Supabase backend developer Libya; Flutter REST API integration; PostgreSQL mobile backend | تكامل واجهات برمجة التطبيقات؛ ربط تطبيق Flutter مع API؛ تطوير الأنظمة الخلفية باستخدام Supabase؛ PostgreSQL | `/{locale}/expertise/supabase-api-integration`: authentication, RLS, database access and Dio; Salahly and Ostad |
| P1 design implementation | Figma to Flutter; Flutter UI developer; Arabic RTL Flutter UI implementation; mobile UI development | تحويل تصاميم Figma إلى Flutter؛ تطوير واجهات المستخدم؛ تصميم واجهات التطبيقات وتنفيذها؛ واجهات Flutter عربية | `/{locale}/expertise/flutter-ui-implementation`: reusable widgets, responsive layouts, RTL and state; Mekdam and Ostad. Interface design is supported by the owner-supplied Figma education-app canvas; no UX-research outcomes are claimed |
| P1 project evidence | Salahly Flutter vehicle maintenance app; booking and Supabase integration case study | صلّحلي تطبيق صيانة المركبات؛ تطبيق Flutter لحجز خدمات السيارات | `/{locale}/projects/salahly`: bookings, vehicle data, maps, notifications, invoices/payment workflows |
| P1 project evidence | Mekdam B2B pharmacy Flutter app; Arabic pharmacy purchasing interface | Mekdam مشتريات الصيدليات؛ تطبيق صيدليات بواجهة عربية؛ إدارة طلبات الموردين | `/{locale}/projects/mekdam`: BLoC, GoRouter, dependency injection, RTL; in development |
| P1 project evidence | Ostad Flutter learning app; Arabic e-learning mobile interface | Ostad تطبيق تعليمي؛ واجهات دورات ودروس فيديو؛ بنك أسئلة | `/{locale}/projects/ostad`: feature-first Flutter, Cubit, REST, learning screens; in development |
| P2 recruiter background | software engineer profile; Flutter architecture and mobile computing background | خبرات مهندس برمجيات؛ تخصص تطوير تطبيقات الجوال | `/{locale}#about` and `#approach`: degree and demonstrated capabilities; no invented employers or years |
| P2 contact / hire | contact Aimen Elwahab; discuss Flutter project | التواصل مع أيمن الوهاب؛ مناقشة تطوير تطبيق | `/{locale}#contact`: email, phone, scheduling and email-preparation form |
| P1 verified local intent | Flutter Developer Tripoli; Mobile App Developer Tripoli | مبرمج تطبيقات في طرابلس؛ مطور Flutter طرابلس | Owner confirmed a Tripoli base and Libya-wide/worldwide availability. Home metadata, visible home/about/contact copy, mobile expertise copy and Person schema now reflect this. No city doorway pages |
| Deferred until evidence | Web Developer Libya; full stack web application development; website developer | مطور ويب في ليبيا؛ برمجة مواقع إلكترونية؛ تصميم وتطوير المواقع | No dedicated page: this checkout is a Next.js portfolio, not verified proof of client web-development expertise. Add a real case study and responsibilities first |
| Deferred or narrowed | UX strategist; UX research; full-service UI/UX design; standalone custom API platform development; DBA consulting | بحث تجربة المستخدم؛ استراتيجية UX؛ إدارة قواعد البيانات المتخصصة؛ تطوير منظومات API مستقلة | Avoid claiming these from interface screenshots or integration work alone. Existing backend page covers verified mobile backend work |

A fragment is a navigation target within its homepage, **not an independently indexed page**. No separate thin about/contact/project-index pages were created. Flutter/mobile synonyms share one destination to avoid duplicated service pages. Keyword metadata is retained for compatibility with the editor but is not treated as a Google ranking mechanism; visible content, internal links and relevance do the work.

## Editorial and identity rules

Use first-person, concrete descriptions aligned with the existing portfolio. Do not invent growth statistics, download counts, client names, store releases, business outcomes or supported platforms for an individual project. Android/iOS are verified general capabilities; the CreativeWork project schema intentionally avoids making unsupported per-project release claims. GitHub identity is corroborated by [aimen94](https://github.com/aimen94); LinkedIn is the supplied official profile and is retained without claiming independent access verification.

Existing project IDs remain stable; `salahly`, `mekdam`, and `ostad` are descriptive brand URLs already used on the site. There is no SEO benefit established here that justifies changing them and introducing another redirect migration.

## Owner-confirmed follow-up

The owner confirmed being based in Tripoli and accepting work across Libya and worldwide. Both shared Figma links resolve to the same file/canvas (`mXRJRiYIfXrL04XpF2Mu1r`, `2027:55`). Figma metadata and the home frame (`2027:58`) were inspected: the canvas is labeled Meras and includes Arabic educational interfaces and reusable components. The UI expertise page now covers interface design in Figma as well as Flutter implementation, links to the original design, and references it as a CreativeWork. This evidence does not establish UX research, usability-test results or shipping status. The design was not silently renamed or attributed to the Ostad app case study.
