import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/site";

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

  { path: "/solutions/hr-people", changeFrequency: "monthly", priority: 0.7 },
  { path: "/solutions/operations", changeFrequency: "monthly", priority: 0.7 },
  { path: "/solutions/learning-development", changeFrequency: "monthly", priority: 0.7 },
  { path: "/solutions/healthcare", changeFrequency: "monthly", priority: 0.6 },

  { path: "/research", changeFrequency: "monthly", priority: 0.7 },
  { path: "/research/methodology", changeFrequency: "monthly", priority: 0.6 },
  { path: "/research/science-insight", changeFrequency: "monthly", priority: 0.5 },
  { path: "/research/cognitive-constructs", changeFrequency: "monthly", priority: 0.6 },

  { path: "/legal/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/legal/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/legal/cookies", changeFrequency: "yearly", priority: 0.3 },
  { path: "/legal/data-processing", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return STATIC_PATHS.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
