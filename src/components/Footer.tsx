import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "./Logo";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-white/10 bg-ink text-neutral-400">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Logo className="h-7 w-7" />
              <span className="font-arabic text-base font-extrabold text-white">
                انطلق
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{t("tagline")}</p>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
              {t("platform")}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white">{t("about")}</Link></li>
              <li><Link href="/tracks" className="hover:text-white">{t("tracks")}</Link></li>
              <li><Link href="/trainers" className="hover:text-white">{t("trainers")}</Link></li>
              <li><Link href="/partners" className="hover:text-white">{t("partners")}</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
              {t("getInvolved")}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/register" className="hover:text-white">{t("registerPlenary")}</Link></li>
              <li><Link href="/register" className="hover:text-white">{t("applyTraining")}</Link></li>
              <li><Link href="/partners#partner-with-us" className="hover:text-white">{t("partnerWithUs")}</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
              {t("location")}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>{t("locationValue")}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <p>{t("ammanJordan")}</p>
        </div>
      </div>
    </footer>
  );
}
