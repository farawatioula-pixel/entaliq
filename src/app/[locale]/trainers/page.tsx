import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import TrainersGrid from "@/components/TrainersGrid";
import LaunchCTA from "@/components/LaunchCTA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "trainersPage" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function TrainersPage() {
  const t = await getTranslations("trainersPage");

  return (
    <>
      <section className="border-t-4 border-red bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">
            {t("eyebrow")}
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-600">
            {t("heroBody")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <TrainersGrid showBio />

        <div className="mt-14 flex flex-col items-start gap-4 rounded-sm border border-line bg-paper p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold">{t("ctaTitle")}</h2>
            <p className="mt-1 text-[15px] text-neutral-600">{t("ctaBody")}</p>
          </div>
          <Link
            href="/partners#partner-with-us"
            className="inline-flex shrink-0 items-center rounded-sm bg-surface border border-line px-6 py-3 text-sm font-semibold text-fg hover:bg-line"
          >
            {t("getInTouch")}
          </Link>
        </div>
      </section>

      <LaunchCTA />
    </>
  );
}
