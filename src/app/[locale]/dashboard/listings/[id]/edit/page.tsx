import { notFound } from "next/navigation";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/marketplace";
import ListingForm from "@/components/ListingForm";
import type { Listing, ListingPackage } from "@/lib/marketplace-types";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale });
    return;
  }

  const { data: listing } = await supabase.from("listings").select("*").eq("id", id).single();

  if (!listing) notFound();
  if (listing.seller_id !== user.id) notFound();

  const { data: packages } = await supabase
    .from("listing_packages")
    .select("*")
    .eq("listing_id", id)
    .order("price", { ascending: true });

  const categories = await getCategories();

  return (
    <main className="border-t-4 border-cyan bg-paper px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">
          Dashboard
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-fg sm:text-4xl">Edit listing</h1>

        <div className="mt-10">
          <ListingForm
            sellerId={user.id}
            categories={categories}
            listing={listing as Listing}
            existingPackages={(packages ?? []) as ListingPackage[]}
          />
        </div>
      </div>
    </main>
  );
}
