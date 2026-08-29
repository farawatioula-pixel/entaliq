import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { ListingCard } from "@/components/ListingCard";
import type { ListingWithSeller } from "@/lib/marketplace";

export const revalidate = 0;

export default async function FavoritesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale });
    return;
  }

  const { data } = await supabase
    .from("favorites")
    .select("listing:listings(*, seller:profiles!listings_seller_id_fkey(id, name, avatar_url, category))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const listings = ((data ?? [])
    .map((f) => f.listing)
    .filter(Boolean)) as unknown as ListingWithSeller[];

  return (
    <main className="border-t-4 border-cyan bg-paper px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">
          Favorites
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-fg sm:text-4xl">
          Your saved services
        </h1>

        {listings.length === 0 ? (
          <div className="mt-10 rounded-sm border border-line bg-surface px-8 py-16 text-center">
            <p className="text-[15px] text-neutral-600">
              Tap the heart on any listing to save it here.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
