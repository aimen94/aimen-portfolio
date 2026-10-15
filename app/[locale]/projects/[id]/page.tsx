import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ExpertiseLinks } from "@/components/ExpertiseLinks";
import { ProjectImage } from "@/components/ProjectImage";
import Link from "next/link";
import { ArrowLeft, CalendarDays, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { getSiteContent, isLocale } from "@/lib/site-content";
import { SiteHeader } from "@/components/SiteHeader";
import { MixedText } from "@/components/MixedText";
import { languageAlternates, serializeJsonLd, socialLocale } from "@/lib/seo";
import type { Locale } from "@/types/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale: rawLocale, id } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const content = await getSiteContent();
  const project = content.projects.find((item) => item.id === id);
  if (!project) notFound();
  const title = project.seo?.title[locale] || (locale === "ar"
    ? `${project.name.ar} | تطوير التطبيق — أيمن الوهاب`
    : `${project.name.en} | App Development | Aimen Elwahab`);
  const description = project.seo?.description[locale] || project.short[locale];
  const canonical = `https://${content.settings.domain}/${locale}/projects/${project.id}`;

  return {
    metadataBase: new URL(`https://${content.settings.domain}`),
    title: { absolute: title },
    description,
    keywords: locale === "ar"
      ? [...project.technologies, project.category.ar, "مطور Flutter", "تطوير تطبيقات الجوال", "مبرمج تطبيقات ليبيا"]
      : [...project.technologies, project.category.en, "Flutter developer", "mobile app development"],
    alternates: {
      canonical,
      languages: languageAlternates(content.settings.domain, `/projects/${project.id}`),
    },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      locale: socialLocale(locale),
      alternateLocale: [socialLocale(locale === "ar" ? "en" : "ar")],
      siteName: content.locales[locale].identity.name,
      images: project.images[0] ? [{ url: project.images[0].src, alt: `${project.name[locale]} — ${project.images[0].label[locale]}` }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: project.images[0] ? [{ url: project.images[0].src, alt: `${project.name[locale]} — ${project.images[0].label[locale]}` }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: rawLocale, id } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale as Locale;
  const content = await getSiteContent();
  const page = content.locales[locale];
  const foundProject = content.projects.find((item) => item.id === id);
  if (!foundProject) notFound();
  const project = foundProject as NonNullable<typeof foundProject>;

  const bookingHref = content.settings.bookingUrl || `mailto:${content.settings.email}?subject=${encodeURIComponent(page.ui.bookingSubject)}`;
  const bookingTarget = content.settings.bookingUrl ? "_blank" : undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `https://${content.settings.domain}/${locale}/projects/${project.id}#project`,
    inLanguage: locale,
    image: project.images.map((image) => new URL(image.src, `https://${content.settings.domain}`).href),
    keywords: project.technologies.join(", "),
    name: project.name[locale],
    description: project.description[locale],
    genre: project.category[locale],
    author: { "@type": "Person", "@id": `https://${content.settings.domain}/#person`, name: page.identity.name, url: `https://${content.settings.domain}/${locale}` },
    url: `https://${content.settings.domain}/${locale}/projects/${project.id}`,
  };

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <SiteHeader locale={locale} name={page.identity.name} ui={page.ui} bookingUrl={content.settings.bookingUrl} cvUrl={content.settings.cvUrl} />
      <section className="caseHero container">
        <Breadcrumbs locale={locale} domain={content.settings.domain} name={project.name[locale]} path={`/projects/${project.id}`} />
        <Link className="textButton caseBack" href={`/${locale}#work`}><ArrowLeft size={16} /> {page.ui.backToWork}</Link>
        <div className="caseHeroGrid">
          <div>
            <div className="projectMeta"><span>{project.index}</span><span className="statusPill"><MixedText text={project.status[locale]} locale={locale} /></span><span><MixedText text={project.category[locale]} locale={locale} /></span></div>
            <h1><MixedText text={project.name[locale]} locale={locale} /></h1>
            <p><MixedText text={project.description[locale]} locale={locale} /></p>
            {project.googlePlayUrl ? (
              <a className="projectLink" href={project.googlePlayUrl} target="_blank" rel="noopener noreferrer">
                {page.ui.googlePlay} <ExternalLink size={15} />
              </a>
            ) : null}
            <div className="techCluster caseTech">{project.technologies.map((item) => <span key={item} dir="ltr">{item}</span>)}</div>
          </div>
          {project.images[0] ? <div className="caseLeadPhone"><ProjectImage width={540} height={1170} sizes="(max-width: 640px) 75vw, 270px" priority src={project.images[0].src} alt={`${project.name[locale]} — ${project.images[0].label[locale]}`} /></div> : null}
        </div>
      </section>

      {project.caseStudy?.problem[locale] && project.caseStudy.contribution[locale] ? <section className="section container caseDetail">
        <h2>{locale === "ar" ? "المشكلة التي يعالجها التطبيق" : "The problem the app addresses"}</h2>
        <p><MixedText text={project.caseStudy.problem[locale]} locale={locale} /></p>
        <h2>{locale === "ar" ? "مساهمتي في التطوير" : "My development contribution"}</h2>
        <p><MixedText text={project.caseStudy.contribution[locale]} locale={locale} /></p>
      </section> : null}
      <section className="section alt">
        <div className="container caseGrid">
          <div><span className="eyebrow"><MixedText text={page.ui.productOverview} locale={locale} /></span><h2><MixedText text={project.short[locale]} locale={locale} /></h2></div>
          <div><h3><MixedText text={page.ui.coreProductAreas} locale={locale} /></h3><div className="caseHighlights">{project.highlights[locale].map((item) => <span key={item}><MixedText text={item} locale={locale} /></span>)}</div></div>
        </div>
      </section>

      <section className="section container">
        <div className="sectionHeading"><span className="eyebrow"><MixedText text={page.ui.productScreens} locale={locale} /></span><h2><MixedText text={page.ui.selectedFlows} locale={locale} /></h2></div>
        <div className="caseGallery">
          {project.images.map((image, index) => (
            <figure key={`${image.src}-${index}`}>
              <div className="casePhone"><ProjectImage width={480} height={1040} sizes="(max-width: 640px) 70vw, 240px" src={image.src} alt={`${project.name[locale]} — ${image.label[locale]}`} loading="lazy" /></div>
              <figcaption><strong><MixedText text={image.label[locale]} locale={locale} /></strong><span><MixedText text={image.description[locale]} locale={locale} /></span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section container caseDetail">
        <h2>{locale === "ar" ? "خبرات مرتبطة بالمشروع" : "Engineering behind this project"}</h2>
        <ExpertiseLinks locale={locale} slugs={[
          ...(project.technologies.includes("Flutter") ? ["flutter-mobile-development", "flutter-ui-implementation"] : []),
          ...(project.technologies.some(tech => /Supabase|REST API|Dio/.test(tech)) ? ["supabase-api-integration"] : []),
        ]} />
        <h2>{locale === "ar" ? "مشاريع أخرى" : "More projects"}</h2>
        <ul className="expertiseLinks">{content.projects.filter(item => item.id !== project.id).map(item => <li key={item.id}><Link href={`/${locale}/projects/${item.id}`}><MixedText text={item.name[locale]} locale={locale} /></Link></li>)}</ul>
        <p className="ctaRow"><Link className="textButton" href={`/${locale}#about`}>{page.ui.about} — {page.identity.name}</Link><Link className="textButton" href={`/${locale}#contact`}>{page.ui.contact}</Link></p>
      </section>
      <section className="caseCta">
        <div className="container caseCtaInner">
          <div><span className="eyebrow gold"><MixedText text={page.ui.similarProduct} locale={locale} /></span><h2><MixedText text={page.ui.discussProduct} locale={locale} /></h2></div>
          <a className="primaryButton big" data-contact-method={bookingTarget ? "booking" : undefined} href={bookingHref} target={bookingTarget} rel={bookingTarget ? "noreferrer" : undefined}><CalendarDays size={17} /> {page.ui.bookGoogleMeet} <ExternalLink size={14} /></a>
        </div>
      </section>
    </main>
  );
}
