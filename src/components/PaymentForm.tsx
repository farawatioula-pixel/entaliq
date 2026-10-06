"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export function PaymentForm({ orderId }: { orderId: string }) {
  const t = useTranslations("payOrderPage");
  const router = useRouter();
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "submitted",
        payment_reference: reference.trim() || null,
        payment_submitted_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    setSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push(`/orders/${orderId}`);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-600">
          {t("referenceLabel")}
        </label>
        <input
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder={t("referencePlaceholder")}
          className="w-full rounded-sm border border-line bg-surface px-4 py-3 text-[15px] text-fg focus:border-red focus:outline-none"
        />
        <p className="mt-1.5 text-xs text-neutral-600">{t("referenceHint")}</p>
      </div>

      {error && <p className="text-sm text-red-dark">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-sm bg-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-dark disabled:opacity-60"
      >
        {submitting ? t("submitting") : t("confirmSent")}
      </button>
    </form>
  );
}
