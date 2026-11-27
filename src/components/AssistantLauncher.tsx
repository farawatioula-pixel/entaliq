"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

/** Small floating "✦" button on every page that opens the Mountaliq assistant. */
export default function AssistantLauncher() {
  const pathname = usePathname();
  const locale = useLocale();
  if (pathname === "/" || /^\/(start|dashboard|admin|messages|orders|c)(\/|$)/.test(pathname)) return null;
  return (
    <Link
      href="/start"
      className="fixed bottom-5 end-5 z-40 flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-2xl ring-2 ring-cyan transition-transform hover:-translate-y-1"
    >
      <span className="text-volt">✦</span>
      {locale === "ar" ? "ابدأ مع منطلق" : "Start with Mountaliq"}
    </Link>
  );
}
