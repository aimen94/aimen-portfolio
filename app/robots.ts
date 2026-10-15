import type { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { settings } = await getSiteContent();
  const base = `https://${settings.domain}`;
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin"] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
