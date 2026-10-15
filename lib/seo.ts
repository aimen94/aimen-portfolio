import type { Locale } from "@/types/site";

// Both editions target readers across regions; language-only hreflang is intentional.
export function languageAlternates(domain: string, path = "") {
  const base = `https://${domain}`;
  return {
    en: `${base}/en${path}`,
    ar: `${base}/ar${path}`,
    "x-default": `${base}/en${path}`,
  };
}

export function socialLocale(locale: Locale) {
  return locale === "ar" ? "ar_LY" : "en_US";
}

// CMS content must never be able to terminate a JSON-LD script element.
export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function pageMetadata(content: import("@/types/site").SiteContent, locale: Locale, path: string, title: string, description: string): import("next").Metadata {
  const url = `https://${content.settings.domain}/${locale}${path}`;
  return {
    metadataBase: new URL(`https://${content.settings.domain}`),
    title: { absolute: title }, description,
    alternates: { canonical: url, languages: languageAlternates(content.settings.domain, path) },
    openGraph: {
      type: "website", url, title, description, siteName: content.locales[locale].identity.name,
      locale: socialLocale(locale), alternateLocale: [socialLocale(locale === "ar" ? "en" : "ar")],
      images: [{ url: "/og/aimen-flutter-developer.png", width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [{ url: "/og/aimen-flutter-developer.png", alt: title }] },
  };
}
