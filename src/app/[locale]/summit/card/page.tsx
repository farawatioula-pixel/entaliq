import { getTranslations } from "next-intl/server";
import AttendeeCard from "@/components/AttendeeCard";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "attendeeCard" });
  return { title: t("metaTitle") };
}

export default async function AttendeeCardPage() {
  const t = await getTranslations("attendeeCard");

  return (
    <section className="border-t-4 border-red bg-paper">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:py-24 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red">{t("heroEyebrow")}</p>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">{t("heroTitle")}</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">{t("heroBody")}</p>
        <div className="mt-10">
          <AttendeeCard />
        </div>
      </div>
    </section>
  );
}
