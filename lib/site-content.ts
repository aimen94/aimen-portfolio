import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { defaultContent } from "@/data/default-content";
import type { Locale, SiteContent } from "@/types/site";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "ar";
}

function isModernContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<SiteContent>;
  return Boolean(candidate.locales?.en && candidate.locales?.ar && candidate.settings && Array.isArray(candidate.projects));
}

function normalizeContent(value: unknown): SiteContent {
  if (isModernContent(value)) return value;
  // Older CMS documents are intentionally ignored instead of risking a broken bilingual site.
  // The admin dashboard can save the current v3 structure back to Supabase in one click.
  return defaultContent;
}

function validDomain(domain: string) {
  // A canonical host is editorial configuration, never a request Host header.
  return /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(domain) ? domain.toLowerCase() : defaultContent.settings.domain;
}

function withEnvFallbacks(content: SiteContent): SiteContent {
  return {
    ...content,
    // Preserve CMS edits while supplying newly introduced interface labels.
    locales: {
      en: { ...content.locales.en, ui: { ...defaultContent.locales.en.ui, ...content.locales.en.ui, contactForm: { ...defaultContent.locales.en.ui.contactForm, ...content.locales.en.ui.contactForm } } },
      ar: { ...content.locales.ar, ui: { ...defaultContent.locales.ar.ui, ...content.locales.ar.ui, contactForm: { ...defaultContent.locales.ar.ui.contactForm, ...content.locales.ar.ui.contactForm } } },
    },
    projects: content.projects.map((project) => ({
      ...project,
      googlePlayUrl: project.googlePlayUrl ?? defaultContent.projects.find((item) => item.id === project.id)?.googlePlayUrl,
    })),
    settings: {
      ...content.settings,
      domain: validDomain(content.settings.domain),
      bookingUrl: content.settings.bookingUrl || process.env.NEXT_PUBLIC_BOOKING_URL || defaultContent.settings.bookingUrl,
      bookingEmbedUrl: content.settings.bookingEmbedUrl || process.env.NEXT_PUBLIC_BOOKING_EMBED_URL || defaultContent.settings.bookingEmbedUrl,
      email: content.settings.email || process.env.NEXT_PUBLIC_EMAIL || defaultContent.settings.email,
      phone: content.settings.phone || process.env.NEXT_PUBLIC_PHONE || defaultContent.settings.phone,
      githubUrl: content.settings.githubUrl || defaultContent.settings.githubUrl,
      linkedinUrl: content.settings.linkedinUrl || defaultContent.settings.linkedinUrl,
    },
  };
}

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  if (!supabaseUrl || !supabaseAnonKey) return withEnvFallbacks(defaultContent);

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase
      .from("portfolio_site_content")
      .select("content")
      .eq("id", "main")
      .abortSignal(AbortSignal.timeout(4000))
      .maybeSingle();

    if (error || !data?.content) return withEnvFallbacks(defaultContent);
    return withEnvFallbacks(normalizeContent(data.content));
  } catch {
    return withEnvFallbacks(defaultContent);
  }
});
