import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { stats, gaps, promise, type Locale } from "@/lib/data";
import LaunchCTA from "@/components/LaunchCTA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const t = await getTranslations("aboutPage");

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
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
            {t("heroBody")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24 sm:px-8">
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.value} className="bg-surface px-8 py-10">
              <p className="font-display text-6xl font-bold text-red-dark">{stat.value}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">
                {stat.label[loc]}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-16 gap-y-12 sm:grid-cols-2">
          {gaps.map((gap) => (
            <div key={gap.title.en} className="border-s-2 border-red ps-5">
              <h2 className="font-display text-xl font-bold">{gap.title[loc]}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">
                {gap.body[loc]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            {t("modelEyebrow")}
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {t("modelTitle")}
          </h2>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-neutral-600">
            {t("modelBody")}
          </p>

          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
            {promise.map((item) => (
              <div key={item.title.en} className="bg-surface px-8 py-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-red-dark">
                  {item.title[loc]}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
                  {item.body[loc]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          {t("waysToJoin")}
        </p>
        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
          <div className="bg-surface px-8 py-10">
            <h3 className="font-display text-2xl font-bold">{t("plenary")}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
              {t("plenaryBody")}
            </p>
            <Link
              href="/register"
              className="mt-5 inline-flex items-center gap-1 text-[15px] font-semibold text-red-dark hover:underline"
            >
              {t("registerForPlenary")}
              <span className="inline-block rtl:-scale-x-100">→</span>
            </Link>
          </div>
          <div className="bg-paper px-8 py-10">
            <h3 className="font-display text-2xl font-bold">{t("training")}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
              {t("trainingBody")}
            </p>
            <Link
              href="/register"
              className="mt-5 inline-flex items-center gap-1 text-[15px] font-semibold text-red-dark hover:underline"
            >
              {t("applyForTraining")}
              <span className="inline-block rtl:-scale-x-100">→</span>
            </Link>
          </div>
        </div>
      </section>

      <LaunchCTA />
    </>
  );
}
