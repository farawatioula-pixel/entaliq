import { useTranslations } from "next-intl";
import { partners } from "@/lib/data";

export default function PartnerLogos() {
  const t = useTranslations("common");

  return (
    <div>
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted">
        {t("supportedBy")}
      </p>
      <div className="mt-10 grid grid-cols-2 items-center gap-x-8 gap-y-12 sm:grid-cols-4">
        {partners.map((partner) => (
          <div key={partner.name} className="flex flex-col items-center gap-4">
            <div className="flex h-24 items-center justify-center sm:h-28">
              {partner.logo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className={`w-auto object-contain ${
                    partner.logo.endsWith(".svg")
                      ? "h-10 sm:h-12"
                      : partner.wide
                        ? "h-auto max-h-full max-w-[200px]"
                        : "h-full"
                  }`}
                />
              ) : (
                <span className="font-display text-2xl font-bold text-fg">{partner.name}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
