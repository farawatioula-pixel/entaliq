import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "./Logo";
import { nextSteps, type Locale } from "@/lib/data";

export default function LaunchCTA() {
  const t = useTranslations("launchCta");
  const locale = useLocale() as Locale;

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

        <div className="mt-16 grid grid-cols-1 gap-10 border-t border-white/10 pt-12 sm:grid-cols-3">
          <div>
            <Logo className="h-10 w-10" />
            <p className="mt-4 text-[15px] leading-relaxed text-neutral-300">
              {t("tagline1")}
              <br />
              {t("tagline2")}
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-red">
              {t("sellCreateBuild")}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              {t("nextSteps")}
            </p>
            <ol className="mt-4 space-y-3">
              {nextSteps.map((step, i) => (
                <li key={step.en} className="flex items-baseline gap-3 text-[15px]">
                  <span className="font-display text-sm font-bold text-red">
                    0{i + 1}
                  </span>
                  <span>{step[locale]}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              {t("partnership")}
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-neutral-300">
              {t("partnershipBody")}
            </p>
            <Link
              href="/partners#partner-with-us"
              className="mt-3 inline-block text-[15px] font-semibold text-red hover:underline"
            >
              {t("partnerWithUs")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
