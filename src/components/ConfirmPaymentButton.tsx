"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export function ConfirmPaymentButton({ orderId }: { orderId: string }) {
  const t = useTranslations("adminPaymentsPage");
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    setBusy(true);
    setError(null);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "confirmed",
        payment_confirmed_at: new Date().toISOString(),
        payment_confirmed_by: user?.id ?? null,
      })
      .eq("id", orderId);

    setBusy(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.refresh();
  }

  return (
    <div className="shrink-0">
      <button
        type="button"
        onClick={confirm}
        disabled={busy}
        className="rounded-sm bg-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-dark disabled:opacity-60"
      >
        {busy ? t("confirming") : t("confirmPayment")}
      </button>
      {error && <p className="mt-1 text-xs text-red-dark">{error}</p>}
    </div>
  );
}
