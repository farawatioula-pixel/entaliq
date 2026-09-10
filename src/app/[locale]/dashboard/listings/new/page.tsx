import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/marketplace";
import ListingForm from "@/components/ListingForm";

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

        <div className="mt-10">
          <ListingForm sellerId={user.id} categories={categories} />
        </div>
      </div>
    </main>
  );
}
