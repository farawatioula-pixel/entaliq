"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";

export default function LocaleSwitcher({
  fullWidth,
}: {
  fullWidth?: boolean;
  locale?: string;
}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const nextLocale = locale === "en" ? "ar" : "en";

  function switchLocale() {
    router.replace(
      // @ts-expect-error -- params shape matches the current route
      { pathname, params },
      { locale: nextLocale }
    );
  }

  return (
    <button
      type="button"
      onClick={switchLocale}
      className={`inline-flex items-center rounded-sm border border-line px-4 py-2 text-[15px] font-semibold text-fg transition-colors hover:border-cyan hover:text-cyan-deep ${
        fullWidth ? "w-full justify-center" : ""
      }`}
    >
      {nextLocale === "ar" ? "العربية" : "English"}
    </button>
  );
}
