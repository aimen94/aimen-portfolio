import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aimen Elwahab — Software Engineer & Flutter Developer",
    short_name: "Aimen Elwahab",
    description: "Aimen Elwahab’s bilingual portfolio: mobile applications, API integration, and backend development.",
    start_url: "/en",
    display: "standalone",
    background_color: "#05070c",
    theme_color: "#05070c",
    lang: "en",
  };
}
