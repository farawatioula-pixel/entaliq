import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/summit";

/**
 * Public pages only. Anything behind a login (dashboard, orders, messages,
 * profile) and anything personal (a visitor's own share card) is deliberately
 * left out, along with the admin pages — see robots.ts, which also blocks them.
 *
 * `lastModified` is a fixed date rather than `new Date()`: a sitemap that
 * claims every page changed at the moment of each fetch teaches Google to
 * ignore the field. Bump CONTENT_UPDATED when the summit copy changes.
 */
const CONTENT_UPDATED = new Date("2026-11-19");

const PAGES: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
  { path: "", priority: 1.0, changeFrequency: "daily" },
  { path: "/register", priority: 1.0, changeFrequency: "daily" },
  { path: "/summit", priority: 0.9, changeFrequency: "weekly" },
  { path: "/marketplace", priority: 0.9, changeFrequency: "daily" },
  { path: "/tracks", priority: 0.8, changeFrequency: "weekly" },
  { path: "/trainers", priority: 0.8, changeFrequency: "weekly" },
  { path: "/partners", priority: 0.7, changeFrequency: "weekly" },
  { path: "/directory", priority: 0.7, changeFrequency: "weekly" },
  { path: "/guides", priority: 0.6, changeFrequency: "weekly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl().replace(/\/$/, "");

  return PAGES.flatMap(({ path, priority, changeFrequency }) =>
    routing.locales.map((locale) => ({
      url: `${base}/${locale}${path}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency,
      priority,
      // Tells Google the two language versions are the same page, so an Arabic
      // searcher is served /ar and an English one /en instead of them
      // competing with each other.
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${base}/${l}${path}`])
        ),
      },
    }))
  );
}
