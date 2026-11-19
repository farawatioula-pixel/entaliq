import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/summit";

/**
 * Keeps crawlers on the public site and out of everything else.
 *
 * The admin pages matter most here: /admin/registrations lists every
 * attendee's name, phone and email, and must never reach a search index.
 * It is already behind an admin check, but a disallow costs nothing and
 * removes any chance of a stray link exposing it.
 */
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl().replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/*/admin/",
          "/*/dashboard/",
          "/*/orders/",
          "/*/messages/",
          "/*/profile",
          "/*/favorites",
          "/*/login",
          "/*/signup",
          "/*/forgot-password",
          "/*/reset-password",
          // Personal attendee share cards, one per registration.
          "/*/c/",
          "/*/summit/card",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
