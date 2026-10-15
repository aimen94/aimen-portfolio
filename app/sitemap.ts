import { expertise } from "@/data/expertise";
import type { MetadataRoute } from "next";
import { languageAlternates } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getSiteContent();
  const base = `https://${content.settings.domain}`;
  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/en`, changeFrequency: "weekly", priority: 1, alternates: { languages: languageAlternates(content.settings.domain) } },
    { url: `${base}/ar`, changeFrequency: "weekly", priority: 1, alternates: { languages: languageAlternates(content.settings.domain) } },
  ];

  for (const item of expertise) {
    for (const locale of ["en", "ar"]) entries.push({
      url: `${base}/${locale}/expertise/${item.slug}`, changeFrequency: "monthly", priority: 0.7,
      alternates: { languages: languageAlternates(content.settings.domain, `/expertise/${item.slug}`) },
    });
  }
  for (const project of content.projects) {
    entries.push(
      { url: `${base}/en/projects/${project.id}`, changeFrequency: "monthly", priority: 0.8, alternates: { languages: languageAlternates(content.settings.domain, `/projects/${project.id}`) } },
      { url: `${base}/ar/projects/${project.id}`, changeFrequency: "monthly", priority: 0.8, alternates: { languages: languageAlternates(content.settings.domain, `/projects/${project.id}`) } },
    );
  }
  return entries;
}
