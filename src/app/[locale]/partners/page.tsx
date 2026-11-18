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
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-600">
            {t("heroBody")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24 sm:px-8">
        <PartnerLogos />
      </section>

      <section id="partner-with-us" className="scroll-mt-20 bg-paper py-16 sm:py-24">
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
