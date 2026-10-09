"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { formatPrice, type DisplayCurrency } from "@/lib/currency";

export function PaymentAmountSummary({
  price,
  platformFeePercent,
  platformFeeAmount,
  totalAmount,
}: {
  price: number;
  platformFeePercent: number;
  platformFeeAmount: number;
  totalAmount: number;
}) {
  const t = useTranslations("payOrderPage");
  const [currency, setCurrency] = useState<DisplayCurrency>("USD");

  return (
    <div className="mt-6 rounded-sm border border-line bg-surface px-5 py-4">
      <div className="flex items-center justify-end gap-1 pb-3">
        {(["USD", "JOD"] as DisplayCurrency[]).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCurrency(c)}
            className={`rounded-sm border px-3 py-1 text-xs font-semibold transition-colors ${
              currency === c
                ? "border-cyan-deep bg-cyan/10 text-cyan-deep"
                : "border-line text-neutral-600 hover:border-cyan-deep"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-neutral-600">
        <span>{t("servicePrice")}</span>
        <span className="text-fg">{formatPrice(price, currency)}</span>
      </div>
      <div className="mt-1.5 flex items-center justify-between text-sm text-neutral-600">
        <span>{t("mountaliqPercentage", { percent: platformFeePercent })}</span>
        <span className="text-fg">{formatPrice(platformFeeAmount, currency)}</span>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-600">
          {t("amountDue")}
        </p>
        <p className="font-display text-2xl font-bold text-fg">{formatPrice(totalAmount, currency)}</p>
      </div>
      {currency === "USD" && (
        <p className="mt-2 text-xs text-neutral-500">{t("usdReferenceNote")}</p>
      )}
    </div>
  );
}
