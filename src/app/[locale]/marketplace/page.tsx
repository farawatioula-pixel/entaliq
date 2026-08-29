import { getCategories, getListings, type ListingFilters } from "@/lib/marketplace";
import { ListingCard } from "@/components/ListingCard";
import { Link } from "@/i18n/navigation";

export const revalidate = 0;

const sortOptions: { value: NonNullable<ListingFilters["sort"]>; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    q?: string;
    sort?: string;
  }>;
}) {
  const { category, subcategory, q, sort } = await searchParams;

  const categories = await getCategories();
  const topLevel = categories.filter((c) => !c.parent_id);
  const activeTop = topLevel.find((c) => c.slug === category);
  const subcategories = activeTop ? categories.filter((c) => c.parent_id === activeTop.id) : [];

  const listings = await getListings({
    categorySlug: category,
    subcategorySlug: subcategory,
    search: q,
    sort: (sort as ListingFilters["sort"]) ?? "newest",
  });

  return (
    <main className="bg-paper">
      <section className="border-t-4 border-cyan px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">
            Marketplace
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-bold text-fg sm:text-4xl">
            Hire real services from real Intaleq sellers
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-neutral-600">
            Browse listings, compare packages, and order directly. Every seller trained here.
          </p>

          <form action="/marketplace" method="get" className="mt-8 flex max-w-xl gap-2">
            {category && <input type="hidden" name="category" value={category} />}
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search services..."
              className="flex-1 rounded-sm border border-line bg-surface px-4 py-3 text-sm text-fg placeholder:text-neutral-400 focus:border-cyan-deep focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-sm bg-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-dark"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="border-t border-line px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-4">
            <Link
              href="/marketplace"
              className={`px-5 py-5 transition-colors ${!category ? "bg-paper" : "bg-surface hover:bg-paper"}`}
            >
              <p className="font-display text-base font-bold text-fg">All categories</p>
            </Link>
            {topLevel.map((c) => (
              <Link
                key={c.id}
                href={`/marketplace?category=${c.slug}`}
                className={`px-5 py-5 transition-colors ${
                  category === c.slug ? "bg-paper" : "bg-surface hover:bg-paper"
                }`}
              >
                <p className="font-display text-base font-bold text-fg">{c.name}</p>
              </Link>
            ))}
          </div>

          {subcategories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={`/marketplace?category=${category}`}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                  !subcategory
                    ? "border-cyan-deep text-cyan-deep"
                    : "border-line text-neutral-600 hover:border-cyan-deep"
                }`}
              >
                All
              </Link>
              {subcategories.map((sc) => (
                <Link
                  key={sc.id}
                  href={`/marketplace?category=${category}&subcategory=${sc.slug}`}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                    subcategory === sc.slug
                      ? "border-cyan-deep text-cyan-deep"
                      : "border-line text-neutral-600 hover:border-cyan-deep"
                  }`}
                >
                  {sc.name}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-neutral-600">
              {listings.length} service{listings.length === 1 ? "" : "s"}
            </p>
            <div className="flex gap-1">
              {sortOptions.map((opt) => {
                const params = new URLSearchParams();
                if (category) params.set("category", category);
                if (subcategory) params.set("subcategory", subcategory);
                if (q) params.set("q", q);
                params.set("sort", opt.value);
                const isActive = (sort ?? "newest") === opt.value;
                return (
                  <Link
                    key={opt.value}
                    href={`/marketplace?${params.toString()}`}
                    className={`rounded-sm px-3 py-1.5 text-xs font-semibold transition-colors ${
                      isActive ? "bg-fg text-white" : "text-neutral-600 hover:bg-surface"
                    }`}
                  >
                    {opt.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {listings.length === 0 ? (
            <div className="mt-10 rounded-sm border border-line bg-surface px-8 py-16 text-center">
              <p className="text-[15px] text-neutral-600">
                No services match yet.{" "}
                <Link href="/profile" className="text-cyan-deep hover:underline">
                  List the first one.
                </Link>
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
      </section>
    </main>
  );
}
