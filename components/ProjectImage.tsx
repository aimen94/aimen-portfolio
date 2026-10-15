import Image from "next/image";
import type { ImageProps } from "next/image";

// CMS assets are optimized only on our configured public bucket. Other existing
// external images still render directly, without opening an arbitrary URL proxy.
export function ProjectImage({ src, ...props }: ImageProps) {
  let optimize = typeof src !== "string" || src.startsWith("/images/");
  if (typeof src === "string" && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const url = new URL(src);
      optimize = url.protocol === "https:" && url.hostname === new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
        && url.pathname.startsWith("/storage/v1/object/public/portfolio-assets/") && !url.search;
    } catch { /* A local URL is already handled above. */ }
  }
  return <Image src={src} {...props} unoptimized={!optimize} />;
}
