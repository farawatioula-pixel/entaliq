import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * Home page announcement band for the Mountaliq 2026 closing ceremony.
 * Sits directly under the hero so the registration call is the first thing
 * after the fold, for as long as the ceremony is still open.
 */
export default async function SummitBanner() {
  const t = await getTranslations("home");

  return (
    <section className="border-b border-line border-t-4 border-t-red bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">
            {t("summitBannerEyebrow")}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-2xl font-bold leading-tight tracking-tight text-fg sm:text-3xl">
            {t("summitBannerHeading")}
          </h2>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-neutral-600">
            {t("summitBannerBody")}
          </p>
        </div>

        <Link
          href="/register"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-sm bg-red px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-red-dark"
        >
          {t("summitBannerCta")}
          <span aria-hidden="true" className="inline-block rtl:-scale-x-100">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
