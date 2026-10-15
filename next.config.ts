import type { NextConfig } from "next";

const cmsUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const nextConfig: NextConfig = {
  // Resolve missing pages before sending headers, including ordinary browsers.
  htmlLimitedBots: /.*/,
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 3600,
    remotePatterns: cmsUrl ? [{ protocol: "https", hostname: new URL(cmsUrl).hostname, port: "", pathname: "/storage/v1/object/public/portfolio-assets/**", search: "" }] : [],
  },
};
export default nextConfig;
