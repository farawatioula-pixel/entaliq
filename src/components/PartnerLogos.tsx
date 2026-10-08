import { useTranslations } from "next-intl";
import { partners } from "@/lib/data";

export default function PartnerLogos() {
  const t = useTranslations("common");

  return (
    <div>
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted">
        {t("supportedBy")}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-14 gap-y-6">
        {partners.map((partner) => (
          <div key={partner.name} className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={partner.logo}
              alt={partner.name}
              className="h-9 w-auto object-contain"
            />
            <span className="font-display text-2xl font-bold text-neutral-500 transition-colors hover:text-fg">
              {partner.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
