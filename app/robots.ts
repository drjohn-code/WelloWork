import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/site";

// AI crawlers we want to allow. These are the well-known user-agents that
// modern training and answer engines identify as. If the user adds or
// removes an entry, keep them as their own rule entries below so the robots.txt
// output is explicit per user-agent.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "GoogleOther",
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
  "Amazonbot",
  "Meta-ExternalAgent",
  "FacebookBot",
  "Bytespider",
  "CCBot",
  "Diffbot",
  "DuckAssistBot",
  "YouBot",
  "cohere-ai",
  "MistralAI-User",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/api/"],
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
