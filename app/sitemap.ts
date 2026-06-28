import type { MetadataRoute } from "next";
import { localizedUrl, languageAlternates } from "./lib/site";
import { ENABLED_LOCALES } from "@/i18n/locales";

const STATIC_PATHS: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/book-a-demo", changeFrequency: "monthly", priority: 0.9 },
  { path: "/careers", changeFrequency: "monthly", priority: 0.4 },

  { path: "/platform/growth", changeFrequency: "monthly", priority: 0.8 },
  { path: "/platform/assessment", changeFrequency: "monthly", priority: 0.8 },
  { path: "/platform/measure", changeFrequency: "monthly", priority: 0.8 },
  { path: "/platform/workshops", changeFrequency: "monthly", priority: 0.7 },
  { path: "/platform/proactive-care", changeFrequency: "monthly", priority: 0.7 },

  { path: "/cognitive-rewards", changeFrequency: "monthly", priority: 0.8 },

  { path: "/research", changeFrequency: "monthly", priority: 0.7 },
  { path: "/research/methodology", changeFrequency: "monthly", priority: 0.6 },
  { path: "/research/science-insight", changeFrequency: "monthly", priority: 0.5 },
  { path: "/research/cognitive-constructs", changeFrequency: "monthly", priority: 0.6 },

  { path: "/legal", changeFrequency: "yearly", priority: 0.3 },
];

// One <url> entry per ENABLED locale per path, each carrying hreflang
// alternates (incl. x-default). Disabled locales never appear (SEO_GUIDELINES
// §9 hreflang coverage, §6 config-driven enablement). Adding a locale to
// ENABLED_LOCALES automatically expands the sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const { path, changeFrequency, priority } of STATIC_PATHS) {
    const languages = languageAlternates(path);
    for (const locale of ENABLED_LOCALES) {
      entries.push({
        url: localizedUrl(path, locale),
        lastModified,
        changeFrequency,
        priority,
        alternates: { languages },
      });
    }
  }

  return entries;
}
