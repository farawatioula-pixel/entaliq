import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/marketplace";
import ListingForm from "@/components/ListingForm";
import { Link } from "@/i18n/navigation";

export default async function NewListingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("newListingPage");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale });
    return;
  }

  const categories = await getCategories();

  return (
    <main className="border-t-4 border-cyan bg-paper px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-fg sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-[15px] text-neutral-600">
          {t("subtitle")}
        </p>

        <Link
          href="/dashboard/listings/assistant"
          className="group mt-8 flex items-center gap-4 rounded-2xl bg-ink p-5 text-white shadow-lg transition-transform hover:-translate-y-0.5"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-volt text-xl text-ink">✦</span>
          <span className="flex-1">
            <span className="block font-display text-lg font-bold">
              {locale === "ar" ? "دع مساعد منطلق يعبّئها معك" : "Let the Mountaliq assistant fill this in with you"}
            </span>
            <span className="mt-0.5 block text-sm text-neutral-300">
              {locale === "ar"
                ? "أجب عن بضعة أسئلة قصيرة، وسيكتب ملفك وخدمتك وأسعارك."
                : "Answer a few short questions and it writes your profile, service and prices."}
            </span>
          </span>
          <span className="text-cyan rtl:-scale-x-100">→</span>
        </Link>

        <div className="mt-10">
          <ListingForm sellerId={user.id} categories={categories} />
        </div>
      </div>
    </main>
  );
}
