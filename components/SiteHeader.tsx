"use client";

import { CalendarDays, Languages, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MixedText } from "@/components/MixedText";
import type { Locale, SiteLocaleContent } from "@/types/site";

export function SiteHeader({
  locale,
  name,
  ui,
  bookingUrl,
  cvUrl,
}: {
  locale: Locale;
  name: string;
  ui: SiteLocaleContent["ui"];
  bookingUrl?: string;
  cvUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);
  const bookingHref = bookingUrl || `/${locale}#contact`;
  const bookingTarget = bookingUrl ? "_blank" : undefined;
  const otherLocale: Locale = locale === "en" ? "ar" : "en";
  const otherLocaleHref = pathname?.replace(/^\/(en|ar)(?=\/|$)/, `/${otherLocale}`) || `/${otherLocale}`;

  return (
    <header className="siteHeader">
      <a className="skipLink" href="#main-content">{locale === "ar" ? "الانتقال إلى المحتوى" : "Skip to content"}</a>
      <div className="container headerInner">
        <a href={`/${locale}#top`} className="brand" aria-label={`${name} — ${ui.home}`} onClick={close}>
          <strong><MixedText text={name} locale={locale} /></strong>
          <span dir="ltr">// FLUTTER DEV</span>
        </a>

        <nav className="desktopNav" aria-label={locale === "ar" ? "التنقل الرئيسي" : "Primary navigation"}>
          <a href={`/${locale}#work`}>{ui.selectedWork}</a>
          <a href={`/${locale}#approach`}>{ui.approach}</a>
          <a href={`/${locale}#services`}>{ui.services}</a>
          <a href={`/${locale}#about`}>{ui.about}</a>
          <a href={`/${locale}#contact`}>{ui.contact}</a>
        </nav>

        <div className="headerActions">
          <a className="iconButton languageButton" href={otherLocaleHref} hrefLang={otherLocale} lang={otherLocale} aria-label={`${ui.language}: ${otherLocale === "ar" ? ui.arabic : ui.english}`} title={`${ui.language}: ${otherLocale === "ar" ? ui.arabic : ui.english}`}>
            <Languages size={17} /><span>{otherLocale.toUpperCase()}</span>
          </a>
          <ThemeToggle labels={{ theme: ui.theme, light: ui.light, dark: ui.dark, system: ui.system }} />
          <a className="ghostButton hideTablet" data-contact-method={bookingTarget ? "booking" : undefined} href={bookingHref} target={bookingTarget} rel={bookingTarget ? "noreferrer" : undefined}><MixedText text={ui.bookCall} locale={locale} /></a>
          {cvUrl ? <a className="ghostButton hideTablet" href={cvUrl} target="_blank" rel="noreferrer">{ui.cv}</a> : null}
          <a className="primaryButton hideTiny" href={`/${locale}#contact`}><MixedText text={ui.hireMe} locale={locale} /></a>
          <button className="iconButton mobileMenuButton" onClick={() => setOpen((value) => !value)} aria-label={open ? ui.closeMenu : ui.openMenu} aria-expanded={open}>
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mobileMenu" role="dialog" aria-label={ui.mobileNavigation}>
          <div className="container mobileMenuInner">
            <a href={`/${locale}#work`} onClick={close}>{ui.selectedWork}</a>
            <a href={`/${locale}#approach`} onClick={close}>{ui.approach}</a>
            <a href={`/${locale}#services`} onClick={close}>{ui.services}</a>
            <a href={`/${locale}#about`} onClick={close}>{ui.about}</a>
            <a href={`/${locale}#contact`} onClick={close}>{ui.contact}</a>
            <a href={otherLocaleHref} hrefLang={otherLocale} lang={otherLocale} onClick={close}>{otherLocale === "ar" ? ui.arabic : ui.english}</a>
            <div className="mobileMenuActions">
              <a className="primaryButton big" data-contact-method={bookingTarget ? "booking" : undefined} href={bookingHref} target={bookingTarget} rel={bookingTarget ? "noreferrer" : undefined} onClick={close}>
                <CalendarDays size={17} /> <MixedText text={ui.bookGoogleMeet} locale={locale} />
              </a>
              {cvUrl ? <a className="ghostButton big" href={cvUrl} target="_blank" rel="noreferrer" onClick={close}>{ui.downloadCv}</a> : null}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
