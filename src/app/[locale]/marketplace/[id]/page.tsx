import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getListingById, trackListingView } from "@/lib/marketplace";
import { PackageSelector } from "@/components/PackageSelector";
import { ListingCard } from "@/components/ListingCard";
import { ContactSellerButton } from "@/components/ContactSellerButton";
import { FavoriteButton } from "@/components/FavoriteButton";

export const revalidate = 0;

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getListingById(id);

  if (!result) notFound();

  const { listing, packages, reviews, related } = result;
  const seller = listing.seller as unknown as {
    id: string;
    name: string;
    avatar_url: string;
    headline?: string;
    bio?: string;
    location?: string;
  } | null;

  // Fire-and-forget view tracking, does not block render.
  trackListingView(listing.id, listing.views);

  return (
    <main className="bg-paper">
      <section className="border-t-4 border-cyan px-5 py-10 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <nav className="text-xs text-neutral-600">
              <Link href="/marketplace" className="hover:text-cyan-deep">
                Marketplace
              </Link>{" "}
              /{" "}
              <span className="text-fg">{listing.title}</span>
            </nav>

            <h1 className="mt-3 font-display text-2xl font-bold text-fg sm:text-3xl">
              {listing.title}
            </h1>

            <div className="mt-4 flex items-center justify-between">
              <Link
                href={`/directory/${seller?.id ?? ""}`}
                className="flex items-center gap-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-surface">
                  {seller?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={seller.avatar_url} alt={seller.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-display text-sm font-bold text-neutral-400">
                      {(seller?.name ?? "?").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-fg">{seller?.name}</p>
                  {listing.review_count > 0 && (
                    <p className="text-xs text-neutral-600">
                      ★ {listing.rating.toFixed(1)} ({listing.review_count} reviews)
                    </p>
                  )}
                </div>
              </Link>
              <FavoriteButton listingId={listing.id} />
            </div>

            {listing.images.length > 0 && (
              <div className="mt-6 aspect-video w-full overflow-hidden rounded-sm border border-line bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={listing.images[0]} alt={listing.title} className="h-full w-full object-cover" />
              </div>
            )}

            <div className="mt-8">
              <h2 className="font-display text-lg font-bold text-fg">About this service</h2>
              <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-neutral-700">
                {listing.description}
              </p>
            </div>

            {listing.faq.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-lg font-bold text-fg">FAQ</h2>
                <div className="mt-3 divide-y divide-line rounded-sm border border-line bg-surface">
                  {listing.faq.map((item, i) => (
                    <div key={i} className="px-5 py-4">
                      <p className="text-sm font-semibold text-fg">{item.question}</p>
                      <p className="mt-1 text-sm text-neutral-600">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <h2 className="font-display text-lg font-bold text-fg">
                Reviews ({listing.review_count})
              </h2>
              {reviews.length === 0 ? (
                <p className="mt-3 text-sm text-neutral-600">No reviews yet.</p>
              ) : (
                <div className="mt-3 space-y-4">
                  {reviews.map((r) => {
                    const buyer = (r as unknown as { buyer?: { name: string } }).buyer;
                    return (
                      <div key={r.id} className="rounded-sm border border-line bg-surface px-5 py-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-fg">{buyer?.name ?? "Buyer"}</p>
                          <p className="text-sm font-semibold text-fg">★ {r.rating}</p>
                        </div>
                        {r.comment && (
                          <p className="mt-2 text-sm text-neutral-600">{r.comment}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <PackageSelector packages={packages} listingId={listing.id} />
            {seller && <ContactSellerButton sellerId={seller.id} listingId={listing.id} />}
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line px-5 py-12 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-lg font-bold text-fg">Related services</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
