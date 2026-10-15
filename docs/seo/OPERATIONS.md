# Deployment, indexing and measurement handoff

Prepared 15 October 2026. No deployment, DNS changes, Search Console submission, Bing submission, analytics account connection or indexing request was performed.

## Release checklist

1. Deploy the existing Next.js application to the intended production environment; no framework migration or deployment-provider change is needed. Production canonical host defaults to `aimen.ly`. The CMS `settings.domain` remains authoritative and must contain the bare production hostname. Malformed hosts fall back to the repository default. HTTP/www/alternate-host consolidation must be configured on the actual host/CDN; no host redirects are assumed locally.
2. **Existing Supabase CMS content takes precedence over repository defaults.** Back up the live `portfolio_site_content` main document before editing. Compare and selectively merge the new homepage location/availability/SEO and H1 source fields, project `caseStudy` and `seo` fields from `data/default-content.ts`; preserve live settings, uploaded image URLs, extra projects and newer factual edits. The H1 code includes the saved CMS identity role automatically. Project problem/contribution and SEO fields are now editable in the dashboard. New expertise pages use `data/expertise.ts`, outside the old CMS schema, and deploy without a CMS migration. The SQL schema needs no change.
3. Set `NEXT_PUBLIC_SUPABASE_URL` and its public anon key only if using the CMS. Never put service-role keys in public variables. No live CMS credentials were present here, so runtime verification used repository defaults. Public CMS reads have a four-second timeout and fallback content; repeated CMS failures still need operational monitoring. No cache hides a published CMS update beyond normal request/render behavior.
4. Check `https://aimen.ly/robots.txt`, `/sitemap.xml`, `/en`, `/ar`, all expertise/case-study pages, and an invalid page. Expect 14 public sitemap URLs for the current three projects, reciprocal language alternates, HTTP 200 public pages and HTTP 404 unknown pages. Root and legacy project aliases return HTTP 308. Metadata is resolved before response streaming to preserve real 404s.
5. Check Arabic RTL, contact addresses, calendar link, GitHub and LinkedIn, screenshots and language switching on the deployed host. CMS images in the configured public `portfolio-assets` bucket receive optimization. Other pre-existing external image URLs render directly for compatibility. If changing a local/CMS image at the same URL, allow for the optimizer's one-hour cache; prefer a new filename.
6. Vercel preview environments emit `noindex` through metadata when `VERCEL_ENV=preview`. Other staging hosts need equivalent indexing controls or host-level authentication. Do not deploy public duplicate staging copies with production canonicals as the only protection. `/admin` retains noindex and robots exclusion; exclusion is not access control. Existing Supabase Auth/RLS handles the editor.
7. Recheck the social previews. Home/expertise use the supplied 1200×630 brand image; project pages use their own screenshots. Portrait screenshots may be cropped by social networks; bespoke project social cards are an optional later visual enhancement.

## Google Search Console and Bing

- Add a Google **Domain property** for `aimen.ly`, obtain the exact TXT record from Search Console, and add it at your DNS provider. Domain verification covers HTTP/HTTPS and subdomains. No DNS access was available here.
- Alternatively add the **URL-prefix property** `https://aimen.ly/`. Put only its HTML verification token into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and rebuild/deploy. This environment value does not verify a Domain property; DNS is required there.
- Verify Bing Webmaster Tools using its supplied token in `NEXT_PUBLIC_BING_SITE_VERIFICATION`, then rebuild/deploy; the page renders `msvalidate.01`. DNS verification or authorized Search Console import is another account-side option.
- Submit `https://aimen.ly/sitemap.xml` to each verified property. The robots file already advertises it. Submission is an account action, not established by adding the XML file.
- Use URL Inspection for `/en`, `/ar`, one page from each expertise cluster, and all project pages. Check crawl permission, live response, Google-selected canonical and rendered HTML before requesting indexing. A request does not guarantee indexing.
- Inspect Pages/Indexing for excluded duplicates, soft 404s, redirects and server errors. A missing or changed project ID must retain a redirect at the deployment/app level if old URLs have links. Current IDs were preserved.
- Validate deployed markup in [Schema.org Validator](https://validator.schema.org/) and [Google Rich Results Test](https://search.google.com/test/rich-results). Local tests parse JSON-LD and validate expected graph relationships; they do not establish rich-result eligibility. Person/WebSite/CreativeWork may provide semantic context without producing a Google rich result.
- Monitor Core Web Vitals in Search Console and PageSpeed Insights after traffic accumulates. Local synthetic LCP/CLS are not real-user field metrics; INP and 75th-percentile CWV require real interactions/traffic. Do not call absence of field data a pass.

## Analytics connection and contact intents

`ContactMeasurement` emits the browser event `portfolio:contact-intent` on email, telephone, and tagged external booking links. The validated mailto form emits `contact_method: email_prepared` before opening the visitor's mail client. Payload fields are only `event`, `contact_method`, `page_path`, and `page_language`. No name, email field, message, query string or full link URL is included. This hook stores and transmits nothing by itself.

Connect an existing consent-managed analytics installation, for example:

```js
window.addEventListener('portfolio:contact-intent', ({ detail }) => {
  // Runs only once your consent/analytics integration allows collection.
  window.gtag?.('event', detail.event, {
    contact_method: detail.contact_method,
    page_path: detail.page_path,
    page_language: detail.page_language,
  });
});
```

Have the analytics provider derive session source/medium and organic attribution; do not infer it from a missing referrer. Configure custom dimensions for method/language if required. Validate exactly one event per action in the provider's debug tool. Contact intents are a funnel metric, **not confirmed inquiries**. Email preparation is not delivery; booking clicks are not completed appointments. Count completed inquiries/bookings separately through an authorized inbox/CRM/calendar integration or manual lead log and deduplicate them. Do not double-count email clicks and preparation as two completed leads.

## KPI definitions and reporting

| KPI | Measurement and segmentation | Decision |
| --- | --- | --- |
| Organic impressions/clicks | Search Console web search; weekly trend and rolling 28 days | Which clusters gain relevant visibility and visits? |
| CTR | Clicks ÷ impressions, by page/query/device/country | Refine a title only when there is enough comparable exposure |
| Average position | Search Console by query/page; retain device/country context | Directional evidence, not a universal rank or guarantee |
| Indexed pages | Search Console Pages and individual inspections; expected 14 currently | Investigate useful pages that remain excluded |
| Brand vs non-brand | Brand variants: Aimen Elwahab, أيمن الوهاب, aimen94, domain; report project-brand queries separately | Separate identity discovery from service discovery; review spelling variants |
| Arabic vs English | Landing paths `/ar/` and `/en/`; separately label query language | Page language is not necessarily the user's language |
| Geography | Libya first, then Arabic-market countries and other countries | Validate the target-market fit rather than total traffic alone |
| Organic contact intents | Analytics event filtered to organic sessions, by method/page/language | Detect which pages encourage contact |
| Confirmed qualified inquiries | Authorized CRM/calendar records or manual log with source attribution | Assess business value; avoid labeling every click a lead |
| CWV | Field p75 LCP ≤2.5s, INP ≤200ms, CLS ≤0.1, mobile and desktop | Use field evidence when available; keep synthetic results separate |

No numeric growth target is fabricated before a baseline exists. Capture launch date and a 28-day starting period. For low traffic, compare longer windows and report sample sizes. Search Console country is available; city-level Tripoli ranking was not measured.

## 30/60/90-day plan

**Days 1–30 — release and establish evidence.** Deploy, merge reviewed CMS content, verify both webmaster properties, submit sitemap, inspect every page type, connect authorized analytics and test contact intents. Export a 28-day baseline for impressions/clicks/CTR/position, indexed pages, language, country and brand/non-brand. Tripoli residency and Libya-wide/worldwide availability are owner-confirmed. Confirm any more detailed project responsibilities before adding stronger claims. Check live field data availability and image behavior; resolve crawl/status errors immediately.

**Days 31–60 — improve demonstrated intent.** Compare two 28-day periods with sample sizes. Investigate high-impression/low-CTR pages within comparable position ranges; test one factual title/description revision at a time. Expand case studies with owner-confirmed technical decisions, constraints and implementation evidence. Improve the page answering each observed query rather than producing near-duplicate keyword pages. Address field CWV issues if measured. Align the supplied public profiles with the portfolio's canonical link through authorized owner edits.

**Days 61–90 — evaluate qualified outcomes.** Compare 90-day trends by cluster, language and country. Connect organic contact intents to actual qualified conversations where attribution is available. Expand only topics justified by real project evidence and observed queries. A verified web application case study could justify a web-development page; UX research requires its own evidence. Seek relevant editorial mentions through real project collaborators and professional profiles; no bulk link schemes. Keep a monthly crawl/indexing review and remeasure after major changes.

Reference guidance: [Google localized pages](https://developers.google.com/search/docs/specialty/international/localized-versions), [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [Google profile markup](https://developers.google.com/search/docs/appearance/structured-data/profile-page), [Next.js 15 Image](https://nextjs.org/docs/15/app/api-reference/components/image), [Web Vitals](https://web.dev/articles/vitals).
