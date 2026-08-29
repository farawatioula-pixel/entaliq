import { redirect, Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Listing } from "@/lib/marketplace-types";
import { ListingRow } from "@/components/ListingRow";

export const revalidate = 0;

export default async function DashboardListingsPage({
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

  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("seller_id", user.id)
    .order("updated_at", { ascending: false });

  const list = (listings ?? []) as Listing[];

  return (
    <main className="border-t-4 border-cyan bg-paper px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">
              Dashboard
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold text-fg sm:text-4xl">
              My listings
            </h1>
          </div>
          <Link
            href="/dashboard/listings/new"
            className="rounded-sm bg-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-dark"
          >
            Create listing
          </Link>
        </div>

        {list.length === 0 ? (
          <div className="mt-10 rounded-sm border border-line bg-surface px-8 py-16 text-center">
            <p className="text-[15px] text-neutral-600">
              You have not created any listings yet.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {list.map((listing) => (
              <ListingRow key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
