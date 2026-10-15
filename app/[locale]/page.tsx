import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioPage } from "@/components/PortfolioPage";
import { getSiteContent, isLocale } from "@/lib/site-content";
import { languageAlternates, socialLocale } from "@/lib/seo";
import type { Locale } from "@/types/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const content = await getSiteContent();
  const page = content.locales[locale];
  const canonical = `https://${content.settings.domain}/${locale}`;

  return {
    metadataBase: new URL(`https://${content.settings.domain}`),
    title: { absolute: page.seo.title },
    description: page.seo.description,
    keywords: page.seo.keywords,
    alternates: {
      canonical,
      languages: languageAlternates(content.settings.domain),
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: page.identity.name,
      title: page.seo.title,
      description: page.seo.description,
      locale: socialLocale(locale),
      alternateLocale: locale === "ar" ? ["en_US"] : ["ar_LY"],
      images: [{ url: "/og/aimen-flutter-developer.png", width: 1200, height: 630, alt: page.seo.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.seo.title,
      description: page.seo.description,
      images: [{ url: "/og/aimen-flutter-developer.png", alt: page.seo.title }],
    },
  };
}

export default async function LocalizedHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale as Locale;
  const content = await getSiteContent();
  return <PortfolioPage content={content} locale={locale} />;
}
