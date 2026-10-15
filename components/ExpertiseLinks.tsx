import Link from "next/link";
import { expertise } from "@/data/expertise";
import { MixedText } from "@/components/MixedText";
import type { Locale } from "@/types/site";

export function ExpertiseLinks({ locale, slugs, exclude }: { locale: Locale; slugs?: string[]; exclude?: string }) {
  return <ul className="expertiseLinks">{expertise.filter(item => item.slug !== exclude && (!slugs || slugs.includes(item.slug))).map(item => (
    <li key={item.slug}><Link href={`/${locale}/expertise/${item.slug}`}><MixedText text={item.title[locale]} locale={locale} /></Link></li>
  ))}</ul>;
}
