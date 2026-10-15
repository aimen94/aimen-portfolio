# Production SEO implementation report

15 October 2026 — Aimen Elwahab / أيمن الوهاب

Implementation is complete in this repository and verified locally against a production build. Deployment, live CMS publication and search-account actions remain external. Rankings and indexing are not guaranteed.

## A. Technical issues discovered and addressed

The application is Next.js 15.5.28 App Router with React 19 and TypeScript. Public pages use dynamic server rendering, React request caching, optional Supabase CMS reads and repository defaults. Middleware sets the document language before root rendering. There is no framework migration, static-export conversion or deployment-provider change.

The existing site already had language URLs, unique home/project metadata, canonical and reciprocal `en`/`ar`/`x-default` links, sitemap, robots and Person/WebSite/CreativeWork markup. These were preserved and expanded, not presented as newly discovered indexing failures.

Implemented:

- Resolve unknown locales, projects and expertise slugs with `notFound()` during metadata generation. Disable metadata streaming so missing routes produce HTTP 404 for ordinary browsers and crawlers. Add a localized recovery page and preserve noindex.
- Change stable root and legacy project aliases from temporary HTTP 307 to permanent HTTP 308. Preserve existing canonical project IDs.
- Extend sitemap discovery to all **14 public pages**, with matching bidirectional alternates and no fabricated modification dates. Keep `/admin` excluded and noindexed.
- Include the visible professional title within the homepage H1, preserving the existing name/role design. One H1 per page, H2 sections and H3 project evidence.
- Add three distinct bilingual expertise topics, contextual HTML links, visible/schema breadcrumbs, and project cross-links.
- Optimize local/CMS screenshots with responsive Next Image output, explicit dimensions, lazy galleries and a priority project hero. Preserve arbitrary existing external CMS media through direct-render fallback rather than enabling a broad image proxy.
- Remove the unused Inter font request while preserving the existing Manrope, Newsreader and Changa typography, including Arabic technical-term rendering.
- Bound CMS reads to four seconds and retain request deduplication/fallback. Validate canonical CMS hostnames rather than trusting arbitrary host values.
- Add Bing verification-token support alongside Google and preview noindex for Vercel preview environments.
- Add a contact-intent analytics hook without loading an analytics SDK or transmitting form data.
- Extend repeatable HTTP/content audits and add optional browser/performance scripts with no production dependency additions.

The prioritized pre-implementation findings and decisions are in [IMPLEMENTATION-AUDIT.md](IMPLEMENTATION-AUDIT.md).

## B. Arabic/English keyword-to-page mapping

| Destination (both languages) | English focus | Arabic focus |
| --- | --- | --- |
| `/en`, `/ar` | Software Engineer Libya; Flutter Developer Libya; professional name | مهندس برمجيات في ليبيا؛ مطور Flutter؛ أيمن الوهاب |
| `/{locale}/expertise/flutter-mobile-development` | Flutter/mobile development; hire Flutter developer; Android/iOS | تطوير تطبيقات الجوال؛ مبرمج Flutter؛ برمجة تطبيقات Android وiOS |
| `/{locale}/expertise/supabase-api-integration` | Supabase/PostgreSQL mobile backend; REST API integration | تطوير الأنظمة الخلفية؛ تكامل واجهات برمجة التطبيقات؛ Supabase |
| `/{locale}/expertise/flutter-ui-implementation` | Figma to Flutter; Arabic RTL; mobile UI development | تنفيذ تصاميم Figma؛ تطوير واجهات المستخدم؛ واجهات Flutter عربية |
| `/{locale}/projects/salahly` | Flutter vehicle-service/booking app | صلّحلي؛ تطبيق صيانة المركبات وحجز الخدمات |
| `/{locale}/projects/mekdam` | Arabic B2B pharmacy purchasing app | مشتريات الصيدليات؛ مقارنة الموردين ومتابعة الطلبات |
| `/{locale}/projects/ostad` | Flutter learning app; course/video interfaces | تطبيق تعليمي؛ الدورات ودروس الفيديو وبنك الأسئلة |
| `/{locale}#about`, `#contact` | Experience/background and contact intent | الخبرات والتواصل ومناقشة المشاريع |

Long-tail relevance was prioritized over generic developer terms. Live results sampled local individual portfolios for Flutter searches and software companies for broader app-development searches. Competition conclusions are qualitative inferences; no search-volume or numerical keyword-difficulty data was available. Full queries, source links, relevance decisions and deferred topics are in [KEYWORD-STRATEGY.md](KEYWORD-STRATEGY.md).

The owner subsequently confirmed being based in Tripoli and available for work across Libya and worldwide. Both editions now reflect that location and availability in homepage copy/metadata, mobile expertise content and Person schema. No unsupported web-service or UX-research landing pages were created. The supplied Figma canvas now supports interface-design positioning alongside Flutter implementation and mobile backend integration.

## C. Pages created or optimized

- **Created 6 pages:** English and Arabic versions of Flutter/mobile development, Supabase/API integration, and Flutter UI implementation. Each has original localized sections, technical scope, project evidence, and useful inquiry inputs.
- **Optimized 8 pages:** `/en`, `/ar`, and both editions of Salahly, Mekdam and Ostad. Case studies now separate the problem and development contribution, preserve technology/functionality evidence, show real screenshots, and link related expertise and other projects.
- **Improved 404 recovery:** document language follows the requested locale, with home/work/contact links.
- About/contact remain useful homepage sections rather than duplicate pages. Project URLs and existing booking, email, phone, themes, screenshot controls and CMS editor behavior are preserved.

## D. Metadata and structured data

The localized homepage titles remain:

- English: **Aimen Elwahab | Flutter Developer & Software Engineer, Tripoli**
- Arabic: **أيمن الوهاب | مهندس برمجيات ومطور Flutter في طرابلس، ليبيا**

The English description identifies Android/iOS apps, API integration and Supabase backends; the Arabic description independently conveys the same professional scope. Each project retains its unique localized title/description, editable in the CMS. New expertise pages have independent localized metadata, canonicals, alternates, Open Graph and Twitter cards. All 14 titles and descriptions were checked for uniqueness.

Connected JSON-LD types:

- Homepage: `Person`, `WebSite`, `ProfilePage`, with shared identity IDs, localized names, owner-confirmed Tripoli, Libya location, skills, supplied GitHub/LinkedIn profiles, and profile `mainEntity`.
- Projects: `CreativeWork` with author, screenshots, technologies, description, URL and language; `BreadcrumbList` matches visible navigation.
- Expertise: `WebPage` with author/topic/website reference; `BreadcrumbList` matches visible navigation.

No LocalBusiness, invented reviews/ratings, offers, business results, release dates or per-project platform claims. CreativeWork is appropriate for these portfolio case studies, including work in development; SoftwareApplication was not forced onto projects with unverified release details. Safe serialization continues to escape script-breaking characters. Local schema checks establish valid JSON and expected properties/relationships, not Google rich-result approval.

## E. Measured performance

Method: isolated local production baseline/final builds; Chromium at 390×844, 4× CPU slowdown, 40ms network latency, 2 MB/s download, fresh browser context/cache disabled, three runs per route. Medians below. No scrolling; observation ends 1.5 seconds after network idle. The final measurement was repeated without the browser audit running concurrently. This is **not Lighthouse or CrUX**, and local TTFB/network conditions do not represent Libya mobile delivery.

| Mobile route | LCP before → after | CLS before → after | Resource transfer before → after |
| --- | --- | --- | --- |
| `/en` | 228 → 212 ms | 0 → 0 | 301,937 → 260,777 bytes |
| `/ar` | 252 → 232 ms | 0 → 0 | 301,937 → 260,777 bytes |
| `/en/projects/salahly` | 244 → 216 ms | 0 → 0 | 1,062,204 → 301,844 bytes |
| `/ar/projects/salahly` | 224 → 204 ms | 0 → 0 | 1,062,205 → 301,845 bytes |

The initial Salahly screenshot response fell from **761,421 to 42,964 encoded bytes** (94.4% smaller in this viewport). Initial home screenshots were below the lazy-loading threshold and transferred zero image bytes in both no-scroll runs; this is not a claim about the entire page after scrolling. Galleries were separately decoded during browser checks.

Tradeoff: encoded first-load JavaScript increased from **112,023 to 118,803 bytes** on homepages and **110,138 to 116,175 bytes** on project pages, primarily with responsive Image support and the contact hook. Net measured resource transfer still fell by about **13.6%** on homepages and **71.6%** on the tested project route. Build-reported first-load JS: 111 → 117 kB homepage; 109 → 115 kB project; new expertise 110 kB. No dependency was added.

Small local LCP differences are not evidence of a real-user improvement. INP, deployed Lighthouse, cold optimizer/CDN behavior, and field p75 CWV remain unmeasured. Raw evidence: [before](performance-before.json), [after](performance-after.json), [browser checks](browser-results.json). The exact repeatable lab script is `scripts/measure-performance.cjs`.

## F. Indexing readiness

- [x] Public content and links are present in server HTML without JavaScript execution.
- [x] English and Arabic have stable, independent URLs with correct lang/direction.
- [x] Unique localized titles/descriptions, self-canonicals and reciprocal alternates.
- [x] Sitemap has all 14 public pages; admin excluded.
- [x] Robots advertises the production sitemap.
- [x] Tested missing routes return real 404s; aliases return 308.
- [x] Visible breadcrumbs, contextual links and parsed structured data.
- [x] Google/Bing verification token plumbing available.
- [ ] Production DNS, HTTPS, canonical-host redirects and preview indexing controls verified on the actual host.
- [ ] Live CMS content merge and final project/location review.
- [ ] Search Console/Bing ownership verified and sitemap submitted.
- [ ] URL Inspection and external structured-data validators run on deployed pages.
- [ ] Analytics connected and field CWV/organic performance established.

## G. External access and remaining actions

No connected deployment or search-account changes were made. `aimen.ly` could not be fetched through the web tool, so no live deployment/indexing claim is made. Exact DNS/URL-prefix verification, token variables, sitemap submission, inspection, analytics connection, and CMS rollout instructions are in [OPERATIONS.md](OPERATIONS.md).

Important: a saved live Supabase document overrides repository defaults. The new code and expertise pages deploy directly, but improved project text/SEO must be selectively merged into saved content. The admin editor exposes the new fields. Existing settings, media and newer facts should be retained. Live CMS authentication/publication was not tested because no credentials were supplied.

## H. 30/60/90-day roadmap and KPIs

- **30 days:** deploy, verify properties, submit sitemap, inspect page types, connect authorized analytics, confirm any additional project facts, capture an initial 28-day baseline.
- **60 days:** compare equivalent windows by query/page/language/country; refine exposed low-CTR pages, add confirmed case-study engineering detail, address observed indexing/CWV issues.
- **90 days:** evaluate qualified organic inquiries against intents, expand only evidence-backed topics with observed demand, develop relevant professional/project mentions, maintain monthly crawl reviews.

Track organic impressions, clicks, CTR, average position, indexed pages, branded/non-branded/project-brand queries, Arabic/English landing traffic, Libya/Arabic-market/international performance, contact intents and confirmed qualified inquiries separately. Use session source/medium for organic attribution; do not label missing-referrer traffic as organic. Full KPI definitions and action criteria are in [OPERATIONS.md](OPERATIONS.md). No fabricated growth targets or ranking promises.

## I. Verification and unresolved limits

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed |
| Production `npm run build` | Passed using isolated final source and the same installed dependencies |
| `npm run audit` | Passed: bilingual consistency, media, expertise content/references and safe JSON-LD |
| `npm run audit -- http://127.0.0.1:3103` | Passed: 14 SSR pages, metadata, schema, alternates, sitemap, robots, 404s, 308 redirects, admin noindex and **240 HTML links/fragments** |
| Browser audit | Passed on 14 pages at 390px/1440px; all image elements decoded; language switching on every page; no horizontal overflow or JavaScript exceptions |
| Interactions | Passed in EN/AR: mobile menu, screenshot selector/lightbox/Escape, dark theme, empty/invalid-email validation, contact-intent event and payload fields |
| Visual review | Arabic mobile expertise screenshot reviewed; EN/AR desktop/mobile artifacts saved |
| Existing local development server | HTTP 200 verified for homepage and new expertise route; production checks used isolated outputs |
| Lint/dedicated unit runner | Not configured in original repository; no linter/test-runner dependency added. TypeScript, meaningful content/HTTP audits and browser checks provide the available validation |
| External validation | No live CMS, deployed analytics, Google/Bing account, indexing, rich-result or field CWV validation claimed |

Browser tools remain optional and outside production dependencies. Reproduction commands and module requirements are documented in the README. No Git metadata was present in this checkout, so no commit or PR was created.

## Follow-up: confirmed location and Figma design

The owner confirmed Tripoli residency and availability across Libya and worldwide. Homepage titles/descriptions, hero/about/contact/availability copy, mobile expertise copy and Person `homeLocation` now reflect these facts in both languages, without inventing a street address.

The two supplied links are duplicates of [the same Figma education-app canvas](https://www.figma.com/design/mXRJRiYIfXrL04XpF2Mu1r/Ousted-Education-App?node-id=2027-55). The canvas is labeled Meras; metadata and the home-frame design context/screenshot were inspected. The existing UI expertise page now includes interface design in Figma, an original-design link, and a `CreativeWork` reference in its WebPage schema. No new project page or claim of UX research/test outcomes was added. No Figma source was modified.

Existing live CMS content still requires a reviewed merge of the updated homepage fields; expertise copy is deployed from source. The performance measurements above record the preceding SEO implementation, before this editorial follow-up, and were not remeasured for these copy/link changes.

Follow-up verification passed: TypeScript, isolated production build, 14-page HTTP SEO audit with 240 internal links/fragments, and full browser audit at 390px/1440px. Additional checks confirmed EN/AR Tripoli address schema, worldwide availability, the crawlable Figma link and its CreativeWork reference. Updated browser evidence/screenshots are in `docs/seo/`.
