# Arabic localization and bilingual SEO audit

Date: 15 October 2026

## Scope and implementation

Reviewed all application routes, components, defaults, content types, CMS templates, middleware, styles, manifest, sitemap and robots implementation. The public site has two homepages and six project detail pages. There are no separate experience, blog or service routes; services, qualifications, skills and availability appear on each homepage. The administrative interface remains English; Arabic content templates used by that interface were corrected.

The existing Next.js 15 App Router architecture, visual design, names, project IDs, image assets, booking and social links, and legacy redirects are preserved. The root URL continues to redirect to `/en`; Arabic remains directly available at `/ar`.

### Content improvements

- Arabic hero identifies أيمن الوهاب as a software engineer and Flutter application developer in Libya, with mobile, API and backend responsibilities visible immediately.
- Rewrote introduction, approach, services, skills, about, contact and booking text in natural professional Arabic, keeping established technology names in English.
- Aligned English positioning with mobile application engineering and Supabase backend development; corrected Arabic labels in the English skills section.
- Shortened project cards and expanded technical context in project details using technologies already listed in the repository.
- Salahly keeps its existing live-product status. Mekdam and Ostad descriptions explicitly state that development is ongoing; their existing store links are preserved without implying that every described feature has shipped.
- Corrected Arabic screen descriptions, course terminology, credit/invoice wording and supplier-order tracking language.
- Localized mobile-navigation controls, image selection/viewer controls, empty media, remote-work label, Google Play links and email validation.
- Contact copy accurately describes the mailto form: it prepares an email for the visitor to review and send. It does not claim server-side message delivery.
- Preserved existing education and availability facts; added no counts, awards, employment history, performance claims or years of experience.

### Important terminology changes

| Original expression | Replacement |
| --- | --- |
| تطوير منتجات رقمية قابلة للتوسع | تطوير تطبيقات الجوال والأنظمة الخلفية |
| Flutter stack منظم حسب مسؤولية كل طبقة | التقنيات المستخدمة في تطوير التطبيقات |
| أنظم Codebase | أنظّم الكود |
| إدارة Authentication | إدارة تسجيل الدخول |
| تجهيز Production release | تجهيز الإصدار |
| تحديث Dependencies وتحسين Performance | تحديث المكتبات وتحسين الأداء |
| مراجعة Architecture أو Code | مراجعة بنية التطبيق أو الكود |
| Workflow الأنسب | متطلبات تطويره، بحسب السياق |
| عرض دراسة الحالة | الاطلاع على تفاصيل المشروع |
| قيد تطوير المنتج | قيد التطوير |
| Timeline واضح للمراحل | تسلسل واضح للمراحل |
| تحميل CV | تحميل السيرة الذاتية |

## SEO implementation

- Home and project pages have unique localized titles and descriptions, with absolute titles preventing the inherited template from repeating Aimen’s name.
- Added concise optional project SEO fields to the existing centralized content model; older CMS projects retain generated-title and short-description fallbacks.
- Canonicals remain self-referential on `/en`, `/ar`, and their project routes. Shared language-alternate generation supplies reciprocal `en`, `ar`, and `x-default` entries, including sitemap entries. English remains the default to preserve current routing.
- Language-only hreflang is intentional: both editions target readers across countries. Open Graph uses `ar_LY` and `en_US` locale identifiers; hreflang does not unnecessarily restrict Arabic discovery to Libya.
- Localized Open Graph and Twitter/X titles, descriptions and image alternatives. Metadata bases follow the configured site domain.
- Homepage JSON-LD retains `Person` and `WebSite`, links them with stable IDs, includes the alternate name, and uses the localized professional role.
- Project JSON-LD uses `CreativeWork` with author, description, language, technologies and screenshots. This avoids unsupported platform/release implications from the former universal `SoftwareApplication` markup. No prices, reviews, ratings, release dates or operating-system support are invented. This markup does not promise a Google rich result.
- JSON-LD serialization escapes `<` so CMS text cannot terminate a script element.
- Sitemap and robots now render dynamically, reflecting CMS project/domain changes after deployment. Removed request-time `lastModified` values because a request is not a content update.
- Robots uses the configured domain and continues to exclude `/admin`; admin pages retain `noindex` metadata.
- Each public page retains one H1. Project card links now include the project brand, making repeated detail links more descriptive.
- React request caching deduplicates CMS reads shared by page rendering and metadata. Public content and metadata remain server-rendered; no client-only content fetch was introduced.

Reference guidance: [Google localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions), [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [Next.js 15 metadata](https://nextjs.org/docs/15/app/api-reference/functions/generate-metadata).

## RTL and visitor experience

Technical names and brands use bidirectional isolation. Email and telephone displays, email input, domains and technical badges retain LTR direction; message and name fields support automatic direction. Border separators use logical properties, and RTL arrow mirroring targets directional arrows rather than rotating calendar/video icons. The gallery viewer supports Escape, initial close-button focus, focus containment and focus restoration. Screenshot media below the hero loads lazily, retaining existing fixed-aspect-ratio containers.

## Files changed

| File | Purpose |
| --- | --- |
| `data/default-content.ts` | Arabic and English copy, project descriptions and metadata, interface labels |
| `types/site.ts` | New interface labels and optional bilingual project SEO fields |
| `lib/site-content.ts` | Per-request caching and backward-compatible label defaults for older CMS documents |
| `lib/seo.ts` | Shared language alternates, social locale and safe JSON-LD serialization |
| `components/PortfolioPage.tsx` | Profile/WebSite schema, localized hero labels and booking fallback, bidi handling |
| `components/ProjectShowcase.tsx` | Short card copy, descriptive links, localized controls, lazy images and viewer keyboard support |
| `components/SiteHeader.tsx` | Localized navigation accessibility and language links |
| `components/MixedText.tsx` | Additional technical terms and project brand isolation |
| `components/ContactForm.tsx` | Localized validation/email body and directional input handling |
| `components/AdminDashboard.tsx` | Arabic templates for newly created projects |
| `app/[locale]/page.tsx` | Homepage metadata, canonical/alternate consistency and social images |
| `app/[locale]/projects/[id]/page.tsx` | Project metadata, safe CreativeWork schema and localized store action |
| `app/layout.tsx` | Broader software-engineering metadata fallback |
| `app/admin/page.tsx` | Absolute administrative title |
| `app/sitemap.ts` | Dynamic content discovery, shared alternates, accurate omission of unknown modification dates |
| `app/robots.ts` | Dynamic configured sitemap/host |
| `app/manifest.ts` | Updated bilingual portfolio description and professional positioning |
| `app/globals.css` | Logical separators, bidi isolation and precise RTL arrow rules |
| `package.json` | Repeatable audit command |
| `scripts/audit.mjs` | Translation, media and optional production-HTTP regression checks |
| `README.md` | Updated positioning, schema inventory and audit instructions |
| `docs/LOCALIZATION-SEO-AUDIT.md` | Findings, implementation, checks and follow-up |
| `docs/audit/*` | Local browser verification results and Arabic mobile/desktop screenshots |

## Verification

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed on the working repository |
| `npm run build` | Passed using an isolated copy of the final source with the same installed dependencies |
| `npm run audit` | Passed: matching translation keys, nonempty content, no accidental Arabic in the English edition, existing media paths, safe JSON-LD serialization |
| `npm run audit -- http://127.0.0.1:3100` | Passed: all 8 public pages return 200 with crawlable content, one H1, unique titles/descriptions, canonical references, reciprocal language alternates, JSON-LD, sitemap and robots |
| Invalid URLs and legacy routes | Passed: unknown locales/projects return 404; root and legacy project redirects remain 307 with unchanged targets |
| Admin indexing | Passed: robots exclusion and HTML noindex |
| Browser checks | Passed on all 8 pages at 390px and 1440px: language/RTL, one H1, metadata, JSON-LD parsing, available image elements, language-switch destination and navigation; no horizontal overflow or JavaScript console errors |
| Interactive Arabic checks | Passed: mobile menu, screenshot viewer close/Escape, localized missing-field and invalid-email messages |
| Visual review | Arabic desktop and mobile screenshots reviewed, including the mobile hero at full resolution |
| Dedicated lint/test scripts | Not available in the original package; no ESLint dependency/configuration or existing test suite. Added the dependency-free audit command using installed TypeScript |
| Live CMS, Search Console, rich-result tools, field Core Web Vitals | Not run: deployment/account/external verification required |

An initial shared-directory runtime check returned 500 chunk errors, and one build attempt failed prerendering `/404` and `/500` with a missing webpack chunk. Process inspection found an existing `next dev` server writing into the same `.next` directory. The final production build and runtime verification used an isolated copy of the final source to remove that interference; those checks passed. The existing development server was left running.

Browser evidence is in [`audit/browser-results.json`](audit/browser-results.json), [`audit/arabic-mobile.png`](audit/arabic-mobile.png), and [`audit/arabic-desktop.png`](audit/arabic-desktop.png). Screenshots are verification artifacts, not public site assets. The first-load JavaScript reported by the final build is 111 kB for each localized homepage and 110 kB for project detail routes; these bundle figures are not field performance scores.

## Deployment and external follow-up

1. **CMS content:** no Supabase environment file is present in this checkout. Local checks use repository defaults. Existing live CMS content takes precedence over defaults, so deploying code alone will not rewrite a saved CMS document. Back up the current document, then merge the reviewed `locales` and matching project text/SEO fields through `/admin` → Advanced JSON. Preserve live settings, project IDs, uploaded media, extra projects and any newer factual edits. Review before using Save Changes. New interface labels fall back automatically without replacing existing editorial content.
2. **Factual confirmation:** confirm individual shipped features, exact project responsibilities, supported released platforms and current store availability before making more specific claims. Existing Ostad store link and in-development status are both retained; confirm whether they refer to a public version and a newer development version. No separate experience timeline was invented.
3. **After deployment:** verify both languages and the sitemap on the production domain. Use Search Console to submit the sitemap and inspect representative home/project URLs. Google’s indexing decision and rankings require external observation.
4. **Structured data:** run representative deployed URLs through Schema.org Validator and Google Rich Results Test. CreativeWork does not imply rich-result eligibility; local checks validate JSON serialization and expected schema types, not Google eligibility.
5. **Performance:** fixed media containers and lazy loading are preserved/improved; no field Core Web Vitals or ranking gains are claimed. Use PageSpeed Insights and Search Console field data to assess real LCP, INP and CLS. Responsive next/image conversion can be considered after measuring screenshot transfer costs; it is outside this content-focused change.
6. **Bookings/contact:** booking settings and the visitor’s email handler require real external/browser configuration. No test email was sent and no calendar booking was created. Verify Google Meet conferencing inside the appointment schedule.

## Typography follow-up

Unified all text in the Arabic edition under Changa, including Latin technology names. Arabic theme font variables now also cover secondary/contact/project headings that previously inherited the English serif family. The highlighted hero word inherits the surrounding heading’s family and weight, eliminating the Inter fallback that gave “الجوال” a different appearance.

Reduced Arabic hero name size to 42–64px on larger screens and 36–42px on phones; supporting hero headline to 32–48px and 28–34px respectively. Section titles use 28–42px, with primary homepage sections at 26–30px on phones; project hero titles use 32–54px.

Verified computed fonts throughout all four Arabic pages at 360, 390, 768 and 1440px: one Changa family, matching headline/emphasis family and weight, and no horizontal overflow. Type checking and content audit passed. Reviewed updated mobile screenshot. Evidence: `audit/typography-results.json`, `audit/arabic-typography-mobile.png`, and `audit/arabic-typography-desktop.png`. English typography retains its existing design.
