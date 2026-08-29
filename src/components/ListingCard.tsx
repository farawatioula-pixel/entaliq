import { Link } from "@/i18n/navigation";
import type { ListingWithSeller } from "@/lib/marketplace";
import { FavoriteButton } from "@/components/FavoriteButton";

const categoryColor: Record<string, string> = {
  SELL: "text-cyan-deep",
  CREATE: "text-violet-deep",
  BUILD: "text-red-dark",
};

const categoryBg: Record<string, string> = {
  SELL: "bg-cyan/10",
  CREATE: "bg-violet/10",
  BUILD: "bg-red/10",
};

export function ListingCard({
  listing,
  currency = "JOD",
  fromLabel = "From",
}: {
  listing: ListingWithSeller;
  currency?: string;
  fromLabel?: string;
}) {
  const seller = listing.seller;
  const sellerCategory = seller?.category ?? "SELL";
  const cover = listing.images?.[0];
  const initial = (seller?.name ?? "?").trim().charAt(0).toUpperCase() || "?";

  return (
    <Link
      href={`/marketplace/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-sm border border-line bg-surface transition-colors hover:border-cyan-deep"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper">
        <div className="absolute right-2 top-2 z-10">
          <FavoriteButton listingId={listing.id} size="sm" />
        </div>
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-2xl font-bold text-neutral-300">
              {listing.title.trim().charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 px-5 py-4">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line ${categoryBg[sellerCategory]}`}
          >
            {seller?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={seller.avatar_url} alt={seller.name} className="h-full w-full object-cover" />
            ) : (
              <span className={`text-[10px] font-bold ${categoryColor[sellerCategory]}`}>{initial}</span>
            )}
          </div>
          <p className="text-xs font-semibold text-neutral-600">{seller?.name ?? "Seller"}</p>
        </div>

        <h3 className="font-display text-base font-bold leading-snug text-fg line-clamp-2">
          {listing.title}
        </h3>

        {listing.review_count > 0 && (
          <p className="text-xs text-neutral-600">
            <span className="font-semibold text-fg">★ {listing.rating.toFixed(1)}</span>{" "}
            ({listing.review_count})
          </p>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-line pt-3">
          <span className="text-xs text-neutral-600">{listing.delivery_days}d delivery</span>
          <p className="text-sm font-semibold text-fg">
            {fromLabel} {currency} {listing.starting_price.toFixed(0)}
          </p>
        </div>
      </div>
    </Link>
  );
}
