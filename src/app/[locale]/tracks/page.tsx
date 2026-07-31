import { getTranslations } from "next-intl/server";
import TracksGrid, { TracksCTA } from "@/components/TracksGrid";
import LaunchCTA from "@/components/LaunchCTA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tracksPage" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function TracksPage() {
  const t = await getTranslations("tracksPage");

  return (
    <>
      <section className="border-t-4 border-red bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:py-24 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">
            {t("eyebrow")}
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl sm:leading-[0.95] lg:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-600">
            {t("heroBody")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24 sm:px-8">
        <TracksGrid showDetail />
        <TracksCTA />
      </section>

      <LaunchCTA />
    </>
  );
}
