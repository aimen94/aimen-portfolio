# Prioritized SEO audit — 15 October 2026

Repository inspected before edits: all App Router routes, components, shared libraries, bilingual defaults, types, CSS, middleware, SQL/RLS, environment template, package scripts, existing audit scripts and documentation, deployment files (none supplied), and public image inventory. No framework migration required.

| Priority | Finding | Implementation decision |
| --- | --- | --- |
| P0 | Next.js 15 App Router already SSRs home and project content; localized canonicals/hreflang and sitemap already exist | Preserve and regression-test; do not describe these as new fixes |
| P0 | Unknown locale/project metadata returns empty metadata; generic error recovery; root/legacy aliases use temporary redirects | Validate in metadata, useful localized 404 recovery, permanent canonical redirects, test HTTP statuses with multiple agents |
| P1 | Homepage H1 contains name alone | Include visible professional role within the same H1, retain visual hierarchy |
| P1 | No expertise destinations, limited contextual internal links | Three distinct bilingual topics: Flutter/mobile development, Supabase/API integration, Flutter UI implementation; preserve about/contact as substantial homepage sections |
| P1 | Project descriptions do not separate problem from personal responsibilities | Add evidence-based sections using only existing project descriptions and stacks; preserve development status |
| P1 | Person/WebSite/CreativeWork present; breadcrumbs/profile graph absent | Add connected ProfilePage and visible/schema breadcrumbs; avoid unsupported ratings, commercial business schema and platform claims |
| P1 | CMS screenshot URLs use raw image tags | Responsive Next Image, bounded local/CMS optimizer policy, external-image compatibility, lazy loading and priority project hero |
| P2 | All four font families preload on both languages | Keep families/design, preload by route language if possible; measure before deciding |
| P2 | Public content queries Supabase per request | Bound CMS timeout; retain fresh reads and per-request deduplication, do not cache stale fallback content |
| P2 | Search Console Google token only; no measurement handoff or full SEO runtime crawler | Add Bing token support, repeatable checks, measured lab baseline, indexing and 30/60/90-day plan |

Facts: repository identifies Aimen Elwahab / أيمن الوهاب in Libya, B.Sc. Mobile Computing at University of Tripoli (2023), Flutter/Dart, Cubit/BLoC, REST/Dio, Supabase/PostgreSQL, and UI implementation. Initial audit requested location confirmation. Follow-up: the owner confirmed residency in Tripoli and availability across Libya and worldwide; bilingual content and Person location now reflect it. The owner also supplied a Figma education-app design, inspected as interface-design evidence. No verified web-service portfolio or UX research case study: no web-development or UX-strategy landing pages created. Search volumes and keyword difficulty are unavailable; numerical estimates will not be invented.

Existing development process uses `.next`; production verification uses an isolated source copy with shared installed dependencies to avoid output-directory collisions. No live CMS credentials or deployment configuration supplied. No lint configuration or dedicated test runner is installed; existing audit and typecheck are available.
