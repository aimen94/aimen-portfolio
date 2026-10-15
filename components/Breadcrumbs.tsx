import Link from "next/link";
import { serializeJsonLd } from "@/lib/seo";
import type { Locale } from "@/types/site";

export function Breadcrumbs({ locale, domain, name, path }: { locale: Locale; domain: string; name: string; path: string }) {
  const home = locale === "ar" ? "الرئيسية" : "Home";
  const graph = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: home, item: `https://${domain}/${locale}` },
      { "@type": "ListItem", position: 2, name, item: `https://${domain}/${locale}${path}` },
    ],
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(graph) }} />
    <nav className="breadcrumbs" aria-label={locale === "ar" ? "مسار التصفح" : "Breadcrumb"}><ol><li><Link href={`/${locale}`}>{home}</Link></li><li aria-current="page">{name}</li></ol></nav>
  </>;
}
