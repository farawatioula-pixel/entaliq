"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { ListingPackage } from "@/lib/marketplace-types";

export function PackageSelector({
  packages,
  listingId,
  currency = "JOD",
}: {
  packages: ListingPackage[];
  listingId: string;
  currency?: string;
}) {
  const t = useTranslations("packageSelector");
  const tierLabel: Record<ListingPackage["tier"], string> = {
    basic: t("tierBasic"),
    standard: t("tierStandard"),
    premium: t("tierPremium"),
  };
  const [active, setActive] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (packages.length === 0) return null;
  const current = packages[active];

  async function handleOrder() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listingId, package_id: current.id }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? t("couldNotPlaceOrder"));
      }
      const { order } = await res.json();
      window.location.href = `/orders/${order.id}`;
    } catch (e) {
      setError(e instanceof Error ? e.message : t("somethingWentWrong"));
      setSubmitting(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-sm border border-line bg-surface">
      {packages.length > 1 && (
        <div className="flex border-b border-line" role="tablist">
          {packages.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`flex-1 px-3 py-3 text-center text-sm font-semibold transition-colors ${
                i === active ? "border-b-2 border-red text-fg" : "text-neutral-600 hover:text-fg"
              }`}
            >
              {tierLabel[p.tier]}
            </button>
          ))}
        </div>
      )}

      <div className="px-6 py-6">
        <div className="flex items-baseline justify-between">
          <h3 className="font-display text-base font-bold text-fg">
            {current.name || tierLabel[current.tier]}
          </h3>
          <p className="font-display text-2xl font-bold text-red-dark">
            {currency} {current.price.toFixed(0)}
          </p>
        </div>

        {current.description && (
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">{current.description}</p>
        )}

        <div className="mt-4 flex gap-4 text-xs text-neutral-600">
          <span>{t("dayDelivery", { days: current.delivery_days })}</span>
          <span>{t("revision", { count: current.revisions })}</span>
        </div>

        {current.features.length > 0 && (
          <ul className="mt-4 space-y-2">
            {current.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-fg">
                <span className="mt-0.5 text-cyan-deep">✓</span>
                {f}
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={handleOrder}
          disabled={submitting}
          className="mt-6 w-full rounded-sm bg-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-dark disabled:opacity-60"
        >
          {submitting ? t("placingOrder") : t("continueCta")}
        </button>

        {error && <p className="mt-2 text-xs text-red-dark">{error}</p>}
      </div>
    </div>
  );
}
