import { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://sevenscleaners.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow all standard crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/cleaner", "/dashboard", "/api/"],
      },
      // Explicitly allow AI crawlers so the site shows up in AI suggestions
      { userAgent: "GPTBot", allow: "/" },           // OpenAI / ChatGPT
      { userAgent: "ChatGPT-User", allow: "/" },     // ChatGPT browse
      { userAgent: "Claude-Web", allow: "/" },       // Anthropic / Claude
      { userAgent: "ClaudeBot", allow: "/" },        // Anthropic crawler
      { userAgent: "PerplexityBot", allow: "/" },    // Perplexity AI
      { userAgent: "CCBot", allow: "/" },            // Common Crawl (AI training)
      { userAgent: "Google-Extended", allow: "/" },  // Google AI (Gemini)
      { userAgent: "Amazonbot", allow: "/" },        // Amazon Alexa AI
      { userAgent: "Applebot-Extended", allow: "/" },// Apple AI
      { userAgent: "cohere-ai", allow: "/" },        // Cohere AI
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
    host: APP_URL,
  };
}
