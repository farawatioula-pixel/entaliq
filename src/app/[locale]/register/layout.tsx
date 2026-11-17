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

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
