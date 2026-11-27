import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/marketplace";
import { getOAuthProviders } from "@/lib/oauth";
import StartDoors from "@/components/StartDoors";

export const metadata = { title: "ابدأ مع منطلق | Start with Mountaliq" };

export default async function StartPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ door?: string }>;
}) {
  const { locale } = await params;
  const { door } = await searchParams;
  const loc = locale === "ar" ? "ar" : "en";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [cats, providers, profileRes] = await Promise.all([
    getCategories(),
    getOAuthProviders(),
    user
      ? supabase.from("profiles").select("name, avatar_url").eq("id", user.id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  const profile = profileRes.data as { name?: string; avatar_url?: string } | null;
  const categories = cats
    .filter((c) => !c.parent_id)
    .map((c) => ({ id: c.id, slug: c.slug, name: loc === "ar" && c.name_ar ? c.name_ar : c.name }));

  return (
    <main className="relative overflow-hidden bg-paper px-5 py-12 sm:px-8 sm:py-16">
      <div aria-hidden className="pointer-events-none absolute -start-40 top-0 h-96 w-96 rounded-full bg-cyan opacity-20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -end-40 bottom-0 h-96 w-96 rounded-full bg-red opacity-15 blur-3xl" />
      <div className="relative mx-auto max-w-3xl">
        <StartDoors
          locale={loc}
          initialDoor={door === "sell" || door === "buy" ? door : null}
          userId={user?.id ?? null}
          knownName={profile?.name ?? ""}
          knownAvatar={profile?.avatar_url ?? ""}
          categories={categories}
          oauthProviders={providers}
        />
      </div>
    </main>
  );
}
