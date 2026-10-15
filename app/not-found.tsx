import Link from "next/link";
import { headers } from "next/headers";

export const metadata = { title: "404 | Aimen Elwahab", robots: { index: false, follow: true } };

export default async function NotFound() {
  const locale = (await headers()).get("x-site-locale") === "ar" ? "ar" : "en";
  return <main id="main-content" className="container expertiseArticle">
    <span className="eyebrow">404</span>
    <h1>{locale === "ar" ? "الصفحة غير موجودة" : "Page not found"}</h1>
    <p>{locale === "ar" ? "قد يكون الرابط غير صحيح أو تغيّر عنوان الصفحة. يمكنك العودة إلى أعمالي أو التواصل معي." : "This address may be incorrect or the page may have moved. Explore my work or get in touch."}</p>
    <div className="ctaRow"><Link className="primaryButton big" href={`/${locale}`}>{locale === "ar" ? "العودة للرئيسية" : "Back to home"}</Link><Link className="textButton" href={`/${locale}#work`}>{locale === "ar" ? "تصفّح المشاريع" : "Explore projects"}</Link><Link className="textButton" href={`/${locale}#contact`}>{locale === "ar" ? "تواصل معي" : "Contact me"}</Link></div>
  </main>;
}
