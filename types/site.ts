export type Locale = "en" | "ar";
export type Accent = "amber" | "blue" | "violet" | "green";

export type LocalizedText = Record<Locale, string>;

export type ProjectImage = {
  src: string;
  label: LocalizedText;
  description: LocalizedText;
};

export type Project = {
  id: string;
  index: string;
  name: LocalizedText;
  category: LocalizedText;
  status: LocalizedText;
  accent: Accent;
  short: LocalizedText;
  description: LocalizedText;
  technologies: string[];
  highlights: Record<Locale, string[]>;
  images: ProjectImage[];
  featured?: boolean;
  googlePlayUrl?: string;
  caseStudy?: { problem: LocalizedText; contribution: LocalizedText };
  seo?: { title: LocalizedText; description: LocalizedText };
};

export type ServiceItem = {
  title: string;
  description: string;
};

export type StackItem = {
  title: string;
  value: string;
};

export type ApproachItem = {
  title: string;
  description: string;
};

export type SiteLocaleContent = {
  identity: {
    name: string;
    role: string;
    availability: string;
  };
  hero: {
    eyebrow: string;
    headlinePrefix: string;
    headlineAccent: string;
    headlineSuffix: string;
    description: string;
  };
  work: {
    eyebrow: string;
    title: string;
    description: string;
  };
  approach: {
    eyebrow: string;
    title: string;
    description: string;
    items: ApproachItem[];
  };
  services: {
    eyebrow: string;
    title: string;
    items: ServiceItem[];
  };
  stack: {
    eyebrow: string;
    title: string;
    items: StackItem[];
  };
  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    educationTitle: string;
    educationDetail: string;
    educationMeta: string;
    focusTitle: string;
    focusDetail: string;
    focusMeta: string;
    availabilityTitle: string;
    availabilityDetail: string;
    availabilityMeta: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    bookingEyebrow: string;
    bookingTitle: string;
    bookingDescription: string;
    inquiryEyebrow: string;
    inquiryTitle: string;
    inquiryDescription: string;
  };
  ui: {
    bookingSubject: string;
    bookingBody: string;
    home: string;
    openMenu: string;
    closeMenu: string;
    mobileNavigation: string;
    screenshotSelector: string;
    showScreenshot: string;
    appScreenshots: string;
    openScreenshot: string;
    closeScreenshot: string;
    emptyMedia: string;
    googlePlay: string;
    remote: string;
    selectedWork: string;
    approach: string;
    services: string;
    about: string;
    contact: string;
    bookCall: string;
    bookGoogleMeet: string;
    hireMe: string;
    startProject: string;
    cv: string;
    downloadCv: string;
    screenSpotlight: string;
    viewCaseStudy: string;
    view: string;
    email: string;
    emailMe: string;
    phone: string;
    github: string;
    linkedin: string;
    exploreRepositories: string;
    connectProfessionally: string;
    callMe: string;
    productOverview: string;
    coreProductAreas: string;
    productScreens: string;
    selectedFlows: string;
    backToWork: string;
    similarProduct: string;
    discussProduct: string;
    language: string;
    english: string;
    arabic: string;
    theme: string;
    light: string;
    dark: string;
    system: string;
    contactForm: {
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      topic: string;
      message: string;
      messagePlaceholder: string;
      send: string;
      required: string;
      invalidEmail: string;
      ready: string;
      unavailable: string;
      topics: string[];
    };
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
};

export type SiteSettings = {
  domain: string;
  bookingUrl: string;
  bookingEmbedUrl: string;
  email: string;
  phone: string;
  githubUrl: string;
  linkedinUrl: string;
  whatsappUrl: string;
  cvUrl: string;
};

export type SiteContent = {
  locales: Record<Locale, SiteLocaleContent>;
  settings: SiteSettings;
  projects: Project[];
};
