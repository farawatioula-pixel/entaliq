import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createClient } from "@supabase/supabase-js";
import { Link } from "@/i18n/navigation";
import { SUMMIT, siteUrl } from "@/lib/summit";

export const revalidate = 3600;

/**
 * Landing page for a shared referral link. It exists so the LinkedIn crawler
 * has a page whose Open Graph image is the sharer's personalised card — a
 * redirect would send the crawler to the generic one instead.
 */

async function registrantName(token: string): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  try {
    const supabase = createClient(url, key);
    const { data } = await supabase.rpc("share_card_name", { token });
    return typeof data === "string" && data.trim() ? data.trim() : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}): Promise<Metadata> {
  const { locale, token } = await params;
  const t = await getTranslations({ locale, namespace: "joinPage" });
  const name = await registrantName(token);

  const title = name ? t("ogTitle", { name }) : t("ogTitleFallback");
  const description = t("ogDescription");

  const image = name
    ? `${siteUrl()}/api/og/${encodeURIComponent(token)}?locale=${locale}`
    : locale === "ar"
      ? "/og/summit-share-ar.png"
      : "/og/summit-share-en.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale,
      images: [{ url: image, width: 1200, height: 627, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function JoinPage({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { locale, token } = await params;
  const t = await getTranslations({ locale, namespace: "joinPage" });
  const name = await registrantName(token);
  const isAr = locale === "ar";

  const facts = [
    {
      label: t("dateLabel"),
      value: isAr ? `${SUMMIT.weekdayAr} ${SUMMIT.dateAr}` : `${SUMMIT.weekdayEn}, ${SUMMIT.dateEn}`,
    },
    { label: t("timeLabel"), value: isAr ? SUMMIT.timeRangeAr : SUMMIT.timeRangeEn },
    { label: t("venueLabel"), value: isAr ? SUMMIT.venueAr : SUMMIT.venueEn },
  ];

  return (
    <main className="border-t-4 border-red bg-paper">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">
          {t("eyebrow")}
        </p>

        <h1 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {name ? t("headingWithName", { name }) : t("headingFallback")}
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-neutral-600">{t("body")}</p>

        <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} className="bg-surface px-6 py-5">
              <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
                {fact.label}
              </dt>
              <dd className="mt-2 font-display text-lg font-bold text-fg">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <Link
          href={`/register?ref=${encodeURIComponent(token)}`}
          className="mt-8 inline-flex items-center gap-2 rounded-sm bg-red px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-red-dark"
        >
          {t("cta")}
          <span aria-hidden="true" className="inline-block rtl:-scale-x-100">
            →
          </span>
        </Link>
      </div>
    </main>
  );
}
