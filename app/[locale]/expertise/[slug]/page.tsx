import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { expertise } from "@/data/expertise";
import { getSiteContent, isLocale } from "@/lib/site-content";
import { pageMetadata, serializeJsonLd } from "@/lib/seo";
import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ExpertiseLinks } from "@/components/ExpertiseLinks";
import { MixedText } from "@/components/MixedText";

type Props = { params: Promise<{ locale: string; slug: string }> };
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const item = expertise.find(item => item.slug === slug);
  if (!item) notFound();
  const content = await getSiteContent();
  return pageMetadata(content, locale, `/expertise/${slug}`, `${item.title[locale]} | ${content.locales[locale].identity.name}`, item.description[locale]);
}

export default async function ExpertisePage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const item = expertise.find(item => item.slug === slug);
  if (!item) notFound();
  const content = await getSiteContent();
  const page = content.locales[locale];
  const url = `https://${content.settings.domain}/${locale}/expertise/${slug}`;
  const schema = {
    "@context": "https://schema.org", "@type": "WebPage", "@id": `${url}#webpage`, url,
    name: item.title[locale], description: item.description[locale], inLanguage: locale,
    isPartOf: { "@id": `https://${content.settings.domain}/#website` },
    about: { "@type": "Thing", name: item.title[locale] },
    ...(item.designReference ? { mentions: { "@type": "CreativeWork", name: item.designReference.label[locale], url: item.designReference.url, author: { "@id": `https://${content.settings.domain}/#person` } } } : {}),
    author: { "@type": "Person", "@id": `https://${content.settings.domain}/#person`, name: page.identity.name, url: `https://${content.settings.domain}/${locale}` },
  };
  return <>
    <SiteHeader locale={locale} name={page.identity.name} ui={page.ui} bookingUrl={content.settings.bookingUrl} cvUrl={content.settings.cvUrl} />
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
      <article className="container expertiseArticle">
        <Breadcrumbs locale={locale} domain={content.settings.domain} name={item.title[locale]} path={`/expertise/${slug}`} />
        <span className="eyebrow">{page.identity.name}</span>
        <h1><MixedText text={item.title[locale]} locale={locale} /></h1>
        <p className="expertiseIntro"><MixedText text={item.intro[locale]} locale={locale} /></p>
        {item.sections.map(section => <section key={section.title.en}>
          <h2><MixedText text={section.title[locale]} locale={locale} /></h2>
          <p><MixedText text={section.body[locale]} locale={locale} /></p>
        </section>)}
        {item.designReference ? <p><a className="projectLink" href={item.designReference.url} target="_blank" rel="noopener noreferrer"><MixedText text={item.designReference.label[locale]} locale={locale} /></a></p> : null}
        <section>
          <h2>{locale === "ar" ? "مشاريع توضح هذا العمل" : "Projects demonstrating this work"}</h2>
          <ul className="relatedProjects">{item.projectIds.map(id => content.projects.find(p => p.id === id)).filter(p => !!p).map(project => <li key={project.id}>
            <h3><Link href={`/${locale}/projects/${project.id}`}><MixedText text={project.name[locale]} locale={locale} /></Link></h3>
            <p><MixedText text={project.short[locale]} locale={locale} /></p>
          </li>)}</ul>
        </section>
        <section><h2>{locale === "ar" ? "خبرات مرتبطة" : "Related expertise"}</h2><ExpertiseLinks locale={locale} exclude={slug} /></section>
        <section className="expertiseContact"><h2>{page.contact.title}</h2><p>{page.contact.description}</p><div className="ctaRow"><Link className="primaryButton big" href={`/${locale}#contact`}>{page.ui.startProject}</Link><Link className="textButton" href={`/${locale}#about`}>{page.ui.about} — {page.identity.name}</Link></div></section>
      </article>
    </main>
  </>;
}
