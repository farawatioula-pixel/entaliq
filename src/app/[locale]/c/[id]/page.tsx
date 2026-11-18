import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteUrl } from "@/lib/summit";

type Props = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ n?: string; r?: string }>;
};

function cardImage(id: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/attendee-cards/${encodeURIComponent(id)}.png`;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const { n } = await searchParams;
  const t = await getTranslations({ locale, namespace: "attendeeCard" });
  const name = (n ?? "").slice(0, 80);
  const title = name ? t("previewTitleNamed", { name }) : t("previewTitle");
  const image = cardImage(id);
  return {
    title,
    description: t("previewBody"),
    openGraph: {
      title,
      description: t("previewBody"),
      url: `${siteUrl()}/${locale}/c/${id}`,
      images: [{ url: image, width: 1200, height: 627 }],
      type: "website",
    },
    twitter: { card: "summary_large_image", title, images: [image] },
  };
}

export default async function SharedCardPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { n, r } = await searchParams;
  const t = await getTranslations("attendeeCard");
  const name = (n ?? "").slice(0, 80);

  return (
    <section className="border-t-4 border-red bg-paper">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:py-24 sm:px-8">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {name ? t("previewTitleNamed", { name }) : t("previewTitle")}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">{t("previewBody")}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cardImage(id)} alt="" className="mt-8 w-full rounded-sm border border-line" />
        <Link
          href={r ? `/register?ref=${encodeURIComponent(r)}` : "/register"}
          className="mt-8 inline-flex items-center rounded-sm bg-red px-6 py-3 text-sm font-semibold text-white hover:bg-red-dark"
        >
          {t("previewCta")}
        </Link>
      </div>
    </section>
  );
}
