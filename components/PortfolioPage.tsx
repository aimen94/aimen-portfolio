import { ArrowDown, ArrowRight, CalendarDays, FileText, Github, Linkedin, Mail, Phone, Smartphone, Video } from "lucide-react";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { SiteHeader } from "@/components/SiteHeader";
import { ContactForm } from "@/components/ContactForm";
import { MixedText } from "@/components/MixedText";
import { ExpertiseLinks } from "@/components/ExpertiseLinks";
import { serializeJsonLd } from "@/lib/seo";
import type { Locale, SiteContent } from "@/types/site";

function bookingLink(content: SiteContent, locale: Locale) {
  if (content.settings.bookingUrl) return content.settings.bookingUrl;
  const { bookingSubject: subject, bookingBody: body } = content.locales[locale].ui;
  return `mailto:${content.settings.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function PortfolioPage({ content, locale }: { content: SiteContent; locale: Locale }) {
  const page = content.locales[locale];
  const bookingHref = bookingLink(content, locale);
  const bookingTarget = content.settings.bookingUrl ? "_blank" : undefined;
  const telHref = `tel:${content.settings.phone.replace(/\s+/g, "")}`;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: page.identity.name,
    url: `https://${content.settings.domain}/${locale}`,
    "@id": `https://${content.settings.domain}/#person`,
    alternateName: content.locales[locale === "ar" ? "en" : "ar"].identity.name,
    jobTitle: page.identity.role,
    email: `mailto:${content.settings.email}`,
    telephone: content.settings.phone,
    sameAs: [content.settings.githubUrl, content.settings.linkedinUrl].filter(Boolean),
    homeLocation: { "@type": "Place", name: locale === "ar" ? "طرابلس، ليبيا" : "Tripoli, Libya", address: { "@type": "PostalAddress", addressLocality: "Tripoli", addressCountry: "LY" } },
    knowsAbout: ["Flutter", "Dart", "Mobile Application Development", "Android", "iOS", "Clean Architecture", "BLoC", "Cubit", "Supabase", "REST APIs", "Figma", "Mobile Interface Design", "Arabic RTL UI"],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `https://${content.settings.domain}/#website`,
    name: page.seo.title,
    publisher: { "@id": `https://${content.settings.domain}/#person` },
    url: `https://${content.settings.domain}`,
    inLanguage: ["en", "ar"],
  };

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteJsonLd) }} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
        "@context": "https://schema.org", "@type": "ProfilePage",
        "@id": `https://${content.settings.domain}/${locale}#profile`,
        url: `https://${content.settings.domain}/${locale}`, name: page.seo.title,
        description: page.seo.description, inLanguage: locale,
        mainEntity: { "@id": `https://${content.settings.domain}/#person` },
        isPartOf: { "@id": `https://${content.settings.domain}/#website` },
      }) }} />
      <SiteHeader locale={locale} name={page.identity.name} ui={page.ui} bookingUrl={content.settings.bookingUrl} cvUrl={content.settings.cvUrl} />

      <section className="hero container" id="top">
        <div className="heroCopy">
          <span className="eyebrow"><i /> <MixedText text={page.hero.eyebrow} locale={locale} /></span>
          <h1 className="heroIdentity"><span className="heroName"><MixedText text={page.identity.name} locale={locale} /></span><span className="heroRole"><MixedText text={page.identity.role} locale={locale} /></span></h1>
          <h2 className="heroHeadline"><MixedText text={page.hero.headlinePrefix} locale={locale} /> <em><MixedText text={page.hero.headlineAccent} locale={locale} /></em> <MixedText text={page.hero.headlineSuffix} locale={locale} /></h2>
          <p><MixedText text={page.hero.description} locale={locale} /></p>
          <div className="ctaRow">
            <a className="primaryButton big" href="#contact">{page.ui.startProject} <ArrowRight size={17} /></a>
            <a className="ghostButton big" data-contact-method={bookingTarget ? "booking" : undefined} href={bookingHref} target={bookingTarget} rel={bookingTarget ? "noreferrer" : undefined}><Video size={17} /> {page.ui.bookCall}</a>
            <a className="textButton" href="#work">{page.ui.selectedWork} <ArrowDown size={15} /></a>
            {content.settings.cvUrl ? <a className="textButton" href={content.settings.cvUrl} target="_blank" rel="noreferrer"><FileText size={15} /> {page.ui.cv}</a> : null}
          </div>
          <div className="heroFacts">
            <div><strong>Flutter</strong><span dir="ltr">Android & iOS</span></div>
            <div><strong dir="ltr">Clean Architecture</strong><span dir="ltr">APIs · BLoC/Cubit · Supabase</span></div>
            <div><strong>{page.ui.remote}</strong><span><MixedText text={page.identity.availability} locale={locale} /></span></div>
          </div>
        </div>

        <div className="heroVisual" aria-hidden="true">
          <div className="terminalTop"><span>● ● ●</span><b>flutter_product.arch</b><small>ACTIVE</small></div>
          {content.projects.slice(0, 3).map((project) => (
            <div className={`systemCard ${project.accent}`} key={project.id}>
              <span>{project.name[locale].split("—")[0].trim()}</span>
              <strong><MixedText text={project.category[locale]} locale={locale} /></strong>
              <small><MixedText text={project.highlights[locale].slice(0, 3).join(" · ")} locale={locale} /></small>
            </div>
          ))}
          <div className="terminalLegend">
            {content.projects.slice(0, 3).map((project) => <span key={project.id}>{project.name[locale].split("—")[0].trim()}</span>)}
          </div>
        </div>
      </section>

      <section className="workSection" id="work">
        <div className="container sectionHeading split">
          <div><span className="eyebrow"><MixedText text={page.work.eyebrow} locale={locale} /></span><h2><MixedText text={page.work.title} locale={locale} /></h2></div>
          <p><MixedText text={page.work.description} locale={locale} /></p>
        </div>
        <div className="container projectList">
          {content.projects.filter((project) => project.featured !== false).map((project) => <ProjectShowcase key={project.id} project={project} locale={locale} ui={page.ui} />)}
        </div>
      </section>

      <section className="section container" id="approach">
        <div className="sectionHeading split">
          <div><span className="eyebrow"><MixedText text={page.approach.eyebrow} locale={locale} /></span><h2><MixedText text={page.approach.title} locale={locale} /></h2></div>
          <p><MixedText text={page.approach.description} locale={locale} /></p>
        </div>
        <div className="threeGrid">
          {page.approach.items.map((item, index) => (
            <div className="infoCard" key={`${item.title}-${index}`}><b>{String(index + 1).padStart(2, "0")}</b><h3><MixedText text={item.title} locale={locale} /></h3><p><MixedText text={item.description} locale={locale} /></p></div>
          ))}
        </div>
      </section>

      <section className="section alt" id="services">
        <div className="container">
          <div className="sectionHeading"><span className="eyebrow"><MixedText text={page.services.eyebrow} locale={locale} /></span><h2><MixedText text={page.services.title} locale={locale} /></h2></div>
          <div className="serviceGrid">
            {page.services.items.map((item, index) => <div className="serviceCard" key={`${item.title}-${index}`}><b>{String(index + 1).padStart(2, "0")}</b><h3><MixedText text={item.title} locale={locale} /></h3><p><MixedText text={item.description} locale={locale} /></p></div>)}
          </div>
          <ExpertiseLinks locale={locale} />
        </div>
      </section>

      <section className="section container" id="technology">
        <div className="sectionHeading"><span className="eyebrow"><MixedText text={page.stack.eyebrow} locale={locale} /></span><h2><MixedText text={page.stack.title} locale={locale} /></h2></div>
        <div className="stackGrid">
          {page.stack.items.map((item, index) => <div key={`${item.title}-${index}`}><span><MixedText text={item.title} locale={locale} /></span><strong dir="auto">{item.value}</strong></div>)}
        </div>
      </section>

      <section className="section container" id="about">
        <div className="aboutGrid">
          <div><span className="eyebrow"><MixedText text={page.about.eyebrow} locale={locale} /></span><h2><MixedText text={page.about.title} locale={locale} /></h2></div>
          <div className="aboutCopy">{page.about.paragraphs.map((paragraph, index) => <p key={index}><MixedText text={paragraph} locale={locale} /></p>)}</div>
        </div>
        <div className="profileStrip">
          <div><span><MixedText text={page.about.educationTitle} locale={locale} /></span><strong><MixedText text={page.about.educationDetail} locale={locale} /></strong><small><MixedText text={page.about.educationMeta} locale={locale} /></small></div>
          <div><span><MixedText text={page.about.focusTitle} locale={locale} /></span><strong><MixedText text={page.about.focusDetail} locale={locale} /></strong><small><MixedText text={page.about.focusMeta} locale={locale} /></small></div>
          <div><span><MixedText text={page.about.availabilityTitle} locale={locale} /></span><strong><MixedText text={page.about.availabilityDetail} locale={locale} /></strong><small><MixedText text={page.about.availabilityMeta} locale={locale} /></small></div>
        </div>
      </section>

      <section className="contactSection" id="contact">
        <div className="container contactIntroGrid">
          <div>
            <span className="eyebrow gold"><MixedText text={page.contact.eyebrow} locale={locale} /></span>
            <h2><MixedText text={page.contact.title} locale={locale} /></h2>
            <p><MixedText text={page.contact.description} locale={locale} /></p>
            <div className="ctaRow">
              <a className="primaryButton big" data-contact-method={bookingTarget ? "booking" : undefined} href={bookingHref} target={bookingTarget} rel={bookingTarget ? "noreferrer" : undefined}><CalendarDays size={17} /> {page.ui.bookGoogleMeet}</a>
              <a className="darkGhost big" href={`mailto:${content.settings.email}`}>{page.ui.emailMe}</a>
              <a className="darkGhost big" href={telHref}><Phone size={16} /> {page.ui.callMe}</a>
            </div>
          </div>
          <div className="contactLinks">
            <a href={`mailto:${content.settings.email}`}><span><Mail size={16} /> {page.ui.email}</span><strong dir="ltr">{content.settings.email}</strong><ArrowRight size={17} /></a>
            <a href={telHref}><span><Phone size={16} /> {page.ui.phone}</span><strong dir="ltr">{content.settings.phone}</strong><ArrowRight size={17} /></a>
            <a href={content.settings.linkedinUrl} target="_blank" rel="noreferrer"><span><Linkedin size={16} /> {page.ui.linkedin}</span><strong>{page.ui.connectProfessionally}</strong><ArrowRight size={17} /></a>
            <a href={content.settings.githubUrl} target="_blank" rel="noreferrer"><span><Github size={16} /> {page.ui.github}</span><strong>{page.ui.exploreRepositories}</strong><ArrowRight size={17} /></a>
          </div>
        </div>

        {content.settings.bookingEmbedUrl ? (
          <div className="container bookingEmbedWrap">
            <div><span className="eyebrow gold"><MixedText text={page.contact.bookingEyebrow} locale={locale} /></span><h3><MixedText text={page.contact.bookingTitle} locale={locale} /></h3><p><MixedText text={page.contact.bookingDescription} locale={locale} /></p></div>
            <div className="bookingFrame"><iframe src={content.settings.bookingEmbedUrl} title={page.ui.bookGoogleMeet} loading="lazy" /></div>
          </div>
        ) : null}

        <div className="container contactFormWrap">
          <div><span className="eyebrow gold"><MixedText text={page.contact.inquiryEyebrow} locale={locale} /></span><h3><MixedText text={page.contact.inquiryTitle} locale={locale} /></h3><p><MixedText text={page.contact.inquiryDescription} locale={locale} /></p></div>
          <ContactForm email={content.settings.email} labels={page.ui.contactForm} />
        </div>
      </section>

      <footer>
        <div className="container footerInner">
          <span>© {new Date().getFullYear()} {page.identity.name}</span>
          <span><Smartphone size={14} /> {page.identity.role}</span>
          <span dir="ltr">{content.settings.domain}</span>
        </div>
      </footer>
    </main>
  );
}
