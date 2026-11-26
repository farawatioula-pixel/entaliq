import { Link, redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/marketplace";
import ListingAssistant from "@/components/ListingAssistant";

export default async function ListingAssistantPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale === "ar" ? "ar" : "en";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login?next=/dashboard/listings/assistant", locale });
    return;
  }

  const categories = (await getCategories())
    .filter((c) => !c.parent_id)
    .map((c) => ({ slug: c.slug, name: loc === "ar" && c.name_ar ? c.name_ar : c.name }));

  return (
    <main className="relative overflow-hidden bg-paper px-5 py-12 sm:px-8 sm:py-16">
      <div aria-hidden className="pointer-events-none absolute -start-40 top-0 h-96 w-96 rounded-full bg-cyan opacity-20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -end-40 bottom-0 h-96 w-96 rounded-full bg-red opacity-15 blur-3xl" />
      <div className="relative mx-auto max-w-2xl">
        <ListingAssistant locale={loc} userId={user.id} categories={categories} />
        <p className="mt-5 text-center text-sm text-neutral-600">
          <Link href="/dashboard/listings/new" className="font-semibold text-cyan-deep hover:underline">
            {loc === "ar" ? "أفضّل تعبئة النموذج بنفسي" : "I'd rather fill in the form myself"}
          </Link>
        </p>
      </div>
    </main>
  );
}
