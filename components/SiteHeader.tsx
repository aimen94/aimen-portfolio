"use client";

import { CalendarDays, Languages, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const [headerHeight, setHeaderHeight] = useState(74);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const observer = new ResizeObserver(() => setHeaderHeight(header.getBoundingClientRect().height));
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 981px)");
    const onResize = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", onResize);
    return () => desktop.removeEventListener("change", onResize);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key !== "Tab") return;
      const controls = [headerRef.current, menuRef.current].flatMap((root) =>
        Array.from(root?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [])
      ).filter((element) => element.getClientRects().length && element.getBoundingClientRect().bottom > 0);
      if (!controls.length) return;
      const current = controls.indexOf(document.activeElement as HTMLElement);
      const next = (current + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
      event.preventDefault();
      controls[next].focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);
  const bookingHref = bookingUrl || `/${locale}#contact`;
  const bookingTarget = bookingUrl ? "_blank" : undefined;
  const otherLocale: Locale = locale === "en" ? "ar" : "en";
  const otherLocaleHref = pathname?.replace(/^\/(en|ar)(?=\/|$)/, `/${otherLocale}`) || `/${otherLocale}`;

  return (
    <header className="siteHeader" ref={headerRef}>
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
          <a className="iconButton languageButton" href={otherLocaleHref} hrefLang={otherLocale} lang={otherLocale} onClick={close} aria-label={`${ui.language}: ${otherLocale === "ar" ? ui.arabic : ui.english}`} title={`${ui.language}: ${otherLocale === "ar" ? ui.arabic : ui.english}`}>
            <Languages size={17} /><span>{otherLocale.toUpperCase()}</span>
          </a>
          <ThemeToggle labels={{ theme: ui.theme, light: ui.light, dark: ui.dark, system: ui.system }} />
          <a className="ghostButton hideTablet" data-contact-method={bookingTarget ? "booking" : undefined} href={bookingHref} target={bookingTarget} rel={bookingTarget ? "noreferrer" : undefined}><MixedText text={ui.bookCall} locale={locale} /></a>
          {cvUrl ? <a className="ghostButton hideTablet" href={cvUrl} target="_blank" rel="noreferrer">{ui.cv}</a> : null}
          <a className="primaryButton hideTiny" href={`/${locale}#contact`} onClick={close}><MixedText text={ui.hireMe} locale={locale} /></a>
          <button ref={toggleRef} className="iconButton mobileMenuButton" onClick={() => setOpen((value) => !value)} aria-label={open ? ui.closeMenu : ui.openMenu} aria-controls="mobile-navigation" aria-expanded={open}>
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {open && createPortal(
        <div id="mobile-navigation" ref={menuRef} className="mobileMenu" style={{ top: headerHeight }} role="dialog" aria-label={ui.mobileNavigation} lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
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
        </div>,
        document.body
      )}
    </header>
  );
}
