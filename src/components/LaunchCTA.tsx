import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function LaunchCTA() {
  const t = useTranslations("launchCta");

  return (
    <section className="relative overflow-hidden border-t-4 border-red bg-ink text-white">
      <div className="bg-noise absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
              {t("eyebrow")}
            </p>
            <h2 className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl">
              {t("heading")}
            </h2>
            <p className="mt-2 font-display text-2xl text-neutral-400">{t("subheading")}</p>
          </div>
          <Link
            href="/partners#partner-with-us"
            className="inline-flex shrink-0 items-center rounded-sm bg-red px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-red-dark"
          >
            {t("cta")}
          </Link>
        </div>

      </div>
    </section>
  );
}
