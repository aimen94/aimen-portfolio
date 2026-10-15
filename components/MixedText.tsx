import type { ReactNode } from "react";
import type { Locale } from "@/types/site";

const technicalTerms = [
  "Feature-first Architecture",
  "Feature-first",
  "Clean Architecture",
  "Dependency Injection",
  "State Management",
  "Row Level Security",
  "Edge Functions",
  "Google Calendar",
  "Google Meet",
  "Google Maps",
  "Secure Storage",
  "Local Storage",
  "Android Studio",
  "REST APIs",
  "REST API",
  "Responsive UI",
  "API integrations",
  "API integration",
  "BLoC/Cubit",
  "Cubit/BLoC",
  "Repository Pattern",
  "Flutter Mobile Developer",
  "Flutter Developer",
  "Mobile Computing",
  "PostgreSQL",
  "Supabase",
  "GoRouter",
  "Injectable",
  "GetIt",
  "Flutter",
  "Dart",
  "Android",
  "iOS",
  "BLoC",
  "Cubit",
  "Dio",
  "FCM",
  "GitHub",
  "LinkedIn",
  "CI/CD",
  "Figma",
  "B2B",
  "RTL",
  "Changa",
  "Inter",
  "UI",
  "UX",
  "API",
  "Codebase",
  "Backend",
  "Frontend",
  "Salahly",
  "Mekdam",
  "Ostad.ly",
  "Ostad",
  "Google Play",
] as const;

const escapedTerms = technicalTerms
  .slice()
  .sort((a, b) => b.length - a.length)
  .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

const technicalPattern = new RegExp(`(${escapedTerms.join("|")})`, "g");
const technicalSet = new Set<string>(technicalTerms);

export function MixedText({ text, locale }: { text: string; locale: Locale }): ReactNode {
  if (locale !== "ar") return text;

  return text.split(technicalPattern).map((part, index) => {
    if (!part) return null;
    if (technicalSet.has(part)) {
      return (
        <bdi dir="ltr" className="techTerm" key={`${part}-${index}`}>
          {part}
        </bdi>
      );
    }
    return part;
  });
}
