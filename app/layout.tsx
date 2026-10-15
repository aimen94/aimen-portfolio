import type { Metadata } from "next";
import { headers } from "next/headers";
import { Changa, Manrope, Newsreader } from "next/font/google";
import "./globals.css";
import { ContactMeasurement } from "@/components/ContactMeasurement";

const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const changa = Changa({ subsets: ["arabic", "latin"], variable: "--font-changa", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://aimen.ly"),
  title: {
    default: "Aimen Elwahab | Software Engineer & Flutter Developer",
    template: "%s | Aimen Elwahab",
  },
  description: "Aimen Elwahab, software engineer and Flutter developer in Libya. Mobile applications, API integration, and backend development.",
  authors: [{ name: "Aimen Elwahab", url: "https://aimen.ly" }],
  creator: "Aimen Elwahab",
  publisher: "Aimen Elwahab",
  category: "technology",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined,
  },
  robots: {
    index: process.env.VERCEL_ENV !== "preview",
    follow: true,
    googleBot: {
      index: process.env.VERCEL_ENV !== "preview",
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const themeScript = `
(function(){
  try {
    var saved = localStorage.getItem('theme') || 'system';
    var dark = saved === 'dark' || (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  } catch (e) {}
})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-site-locale") === "ar" ? "ar" : "en";
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning className={`${newsreader.variable} ${manrope.variable} ${changa.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}<ContactMeasurement /></body>
    </html>
  );
}
