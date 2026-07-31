import { getTranslations } from "next-intl/server";
import PartnerLogos from "@/components/PartnerLogos";
import PartnerForm from "@/components/PartnerForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "partnersPage" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function PartnersPage() {
  const t = await getTranslations("partnersPage");
  const tiers = t.raw("tiers") as { name: string; body: string }[];

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
        <PartnerLogos />

        <div className="mt-20 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
          {tiers.map((tier) => (
            <div key={tier.name} className="bg-surface px-8 py-10">
              <h2 className="font-display text-xl font-bold">{tier.name}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
                {tier.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="partner-with-us" className="scroll-mt-20 bg-paper py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-dark">
            {t("partnerWithUs")}
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-fg sm:text-5xl">
            {t("formTitle")}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">
            {t("formBody")}
          </p>

          <div className="mt-10">
            <PartnerForm />
          </div>
        </div>
      </section>
    </>
  );
}
