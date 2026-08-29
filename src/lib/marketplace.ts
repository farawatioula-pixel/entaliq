import { createClient } from "@/lib/supabase/server";
import type { Category, Listing, ListingPackage } from "@/lib/marketplace-types";

export type ListingWithSeller = Listing & {
  seller: { id: string; name: string; avatar_url: string; category: string } | null;
};

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data ?? []) as Category[];
}

export type ListingFilters = {
  categorySlug?: string;
  subcategorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price_low" | "price_high" | "rating";
};

export async function getListings(filters: ListingFilters = {}) {
  const supabase = await createClient();

  let query = supabase
    .from("listings")
    .select("*, seller:profiles!listings_seller_id_fkey(id, name, avatar_url, category)")
    .eq("status", "published");

  if (filters.categorySlug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", filters.categorySlug)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
  }

  if (filters.subcategorySlug) {
    const { data: subcat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", filters.subcategorySlug)
      .single();
    if (subcat) query = query.eq("subcategory_id", subcat.id);
  }

  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  if (filters.minPrice !== undefined) query = query.gte("starting_price", filters.minPrice);
  if (filters.maxPrice !== undefined) query = query.lte("starting_price", filters.maxPrice);

  switch (filters.sort) {
    case "price_low":
      query = query.order("starting_price", { ascending: true });
      break;
    case "price_high":
      query = query.order("starting_price", { ascending: false });
      break;
    case "rating":
      query = query.order("rating", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data } = await query;
  return (data ?? []) as unknown as ListingWithSeller[];
}

export async function getListingById(id: string) {
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("*, seller:profiles!listings_seller_id_fkey(id, name, avatar_url, category, headline, bio, location)")
    .eq("id", id)
    .single();

  if (!listing) return null;

  const { data: packages } = await supabase
    .from("listing_packages")
    .select("*")
    .eq("listing_id", id)
    .order("price", { ascending: true });

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, buyer:profiles!reviews_buyer_id_fkey(name, avatar_url)")
    .eq("listing_id", id)
    .order("created_at", { ascending: false });

  const { data: related } = await supabase
    .from("listings")
    .select("*, seller:profiles!listings_seller_id_fkey(id, name, avatar_url, category)")
    .eq("status", "published")
    .eq("category_id", listing.category_id)
    .neq("id", id)
    .limit(3);

  return {
    listing: listing as unknown as ListingWithSeller,
    packages: (packages ?? []) as ListingPackage[],
    reviews: reviews ?? [],
    related: (related ?? []) as unknown as ListingWithSeller[],
  };
}

// Increment view count. Fire-and-forget, best effort, never blocks rendering.
export async function trackListingView(id: string, currentViews: number) {
  const supabase = await createClient();
  await supabase.from("listings").update({ views: currentViews + 1 }).eq("id", id);
}
