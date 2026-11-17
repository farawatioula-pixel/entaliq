import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

/**
 * Open Graph metadata for the registration page. This is what LinkedIn reads
 * when someone shares their referral link, so the post shows a proper card
 * rather than a bare URL.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "registerPage" });

  const title = t("ogTitle");
  const description = t("ogDescription");

  // 1200x627 branded card carrying the summit details and the partner logos,
  // so a shared link renders as a proper campaign card on LinkedIn.
  const image = {
    url: locale === "ar" ? "/og/summit-share-ar.png" : "/og/summit-share-en.png",
    width: 1200,
    height: 627,
    alt: title,
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
