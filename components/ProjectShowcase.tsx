"use client";

import { ProjectImage } from "@/components/ProjectImage";
import Link from "next/link";
import { ArrowRight, Maximize2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MixedText } from "@/components/MixedText";
import type { Locale, Project, SiteLocaleContent } from "@/types/site";

export function ProjectShowcase({ project, locale, ui }: { project: Project; locale: Locale; ui: SiteLocaleContent["ui"] }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const selected = project.images[active] ?? project.images[0];
  const previous = project.images.length ? project.images[(active + project.images.length - 1) % project.images.length] : undefined;
  const next = project.images.length ? project.images[(active + 1) % project.images.length] : undefined;

  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!lightbox) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false);
      // The close button is the only focusable control in the viewer.
      if (event.key === "Tab") { event.preventDefault(); closeButton.current?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); previousFocus?.focus(); };
  }, [lightbox]);

  return (
    <article className={`projectCard accent-${project.accent}`} id={project.id}>
      <div className="projectHeader">
        <div>
          <div className="projectMeta">
            <span>{project.index}</span>
            <span className="statusPill"><MixedText text={project.status[locale]} locale={locale} /></span>
            <span><MixedText text={project.category[locale]} locale={locale} /></span>
          </div>
          <h3><MixedText text={project.name[locale]} locale={locale} /></h3>
          <p><MixedText text={project.short[locale]} locale={locale} /></p>
          <Link className="projectLink" href={`/${locale}/projects/${project.id}`}>
            <MixedText text={`${ui.viewCaseStudy} — ${project.name[locale].split("—")[0].trim()}`} locale={locale} /> <ArrowRight size={15} />
          </Link>
          {project.googlePlayUrl ? (
            <div>
              <a className="projectLink" href={project.googlePlayUrl} target="_blank" rel="noopener noreferrer">
                {ui.googlePlay} <ArrowRight size={15} />
              </a>
            </div>
          ) : null}
        </div>
        <div className="techCluster">
          {project.technologies.map((item) => <span key={item} dir="ltr">{item}</span>)}
        </div>
      </div>

      {selected ? (
        <div className="projectBody">
          <div className="projectCopy">
            <span className="eyebrow">{ui.screenSpotlight}</span>
            <h4><MixedText text={selected.label[locale]} locale={locale} /></h4>
            <p><MixedText text={selected.description[locale]} locale={locale} /></p>

            <div className="highlights">
              {project.highlights[locale].map((item) => <span key={item} dir="auto"><MixedText text={item} locale={locale} /></span>)}
            </div>

            <div className="thumbGrid" aria-label={`${project.name[locale]} — ${ui.screenshotSelector}`}>
              {project.images.map((image, index) => (
                <button key={`${image.src}-${index}`} className={index === active ? "thumb active" : "thumb"} onClick={() => setActive(index)} aria-label={`${ui.showScreenshot}: ${image.label[locale]}`} aria-pressed={index === active} type="button">
                  <ProjectImage src={image.src} width={90} height={195} sizes="90px" alt="" loading="lazy" />
                  <small><MixedText text={image.label[locale]} locale={locale} /></small>
                </button>
              ))}
            </div>
          </div>

          <div className="phones" aria-label={`${project.name[locale]} — ${ui.appScreenshots}`}>
            {previous ? <div className="phone phoneLeft"><ProjectImage width={390} height={845} sizes="(max-width: 640px) 170px, 240px" src={previous.src} alt={`${project.name[locale]} — ${previous.label[locale]}`} loading="lazy" /></div> : null}
            <button className="phone phoneCenter phoneButton" type="button" onClick={() => setLightbox(true)} aria-label={`${ui.openScreenshot}: ${selected.label[locale]}`}>
              <ProjectImage width={390} height={845} sizes="(max-width: 640px) 170px, 240px" src={selected.src} loading="lazy" alt={`${project.name[locale]} — ${selected.label[locale]}`} />
              <span className="zoomBadge"><Maximize2 size={14} /> {ui.view}</span>
            </button>
            {next ? <div className="phone phoneRight"><ProjectImage width={390} height={845} sizes="(max-width: 640px) 170px, 240px" src={next.src} alt={`${project.name[locale]} — ${next.label[locale]}`} loading="lazy" /></div> : null}
          </div>
        </div>
      ) : <div className="emptyProjectMedia">{ui.emptyMedia}</div>}

      {lightbox && selected ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${ui.appScreenshots}: ${selected.label[locale]}`} onClick={() => setLightbox(false)}>
          <button ref={closeButton} type="button" className="lightboxClose" onClick={() => setLightbox(false)} aria-label={ui.closeScreenshot}><X size={20} /></button>
          <ProjectImage width={780} height={1690} sizes="(max-width: 640px) 90vw, 440px" src={selected.src} loading="lazy" alt={`${project.name[locale]} — ${selected.label[locale]}`} onClick={(event) => event.stopPropagation()} />
        </div>
      ) : null}
    </article>
  );
}
