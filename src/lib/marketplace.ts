import { createClient } from "@/lib/supabase/server";
import { categoryMatches, expandSearch, relevance, searchOrFilter } from "@/lib/search";
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

  let searchCtx: { terms: string[]; catIds: string[] } | null = null;
  if (filters.search) {
    const terms = expandSearch(filters.search);
    if (terms.length) {
      // Also return listings from categories whose name matches (e.g. "graphic design").
      const { data: cats } = await supabase.from("categories").select("id, name, name_ar, slug");
      const catIds = (cats ?? []).filter((c) => categoryMatches(c, terms)).map((c) => c.id);
      searchCtx = { terms, catIds };
      query = query.or(searchOrFilter(terms, catIds));
    }
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
  const rows = (data ?? []) as unknown as ListingWithSeller[];
  // With a search and no explicit sort, show the most relevant matches first.
  if (searchCtx && (!filters.sort || filters.sort === "newest")) {
    const { terms, catIds } = searchCtx;
    const score = (l: ListingWithSeller) =>
      relevance(
        {
          title: l.title,
          description: l.description,
          tags: l.tags,
          inCategory: catIds.includes(l.category_id ?? "") || catIds.includes(l.subcategory_id ?? ""),
        },
        terms
      );
    return rows.map((l) => ({ l, s: score(l) })).sort((a, b) => b.s - a.s).map((x) => x.l);
  }
  return rows;
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
