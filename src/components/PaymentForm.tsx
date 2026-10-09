"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export function PaymentForm({ orderId }: { orderId: string }) {
  const t = useTranslations("payOrderPage");
  const router = useRouter();
  const [reference, setReference] = useState("");
  const [receiptPath, setReceiptPath] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    if (!isImage && !isPdf) {
      setError(t("receiptFileTypeError"));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(t("receiptSizeError"));
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const extension = file.name.split(".").pop() || "jpg";
    const path = `${orderId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("payment-receipts")
      .upload(path, file, { cacheControl: "3600" });

    setUploading(false);

    if (uploadError) {
      setError(uploadError.message);
      return;
    }

    setReceiptPath(path);
    setReceiptFileName(file.name);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!receiptPath) {
      setError(t("receiptRequired"));
      return;
    }

    setSubmitting(true);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "submitted",
        payment_reference: reference.trim() || null,
        payment_receipt_url: receiptPath,
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
          {t("receiptLabel")} <span className="text-red-dark">*</span>
        </label>
        <p className="mb-2 text-xs text-neutral-500">{t("receiptHint")}</p>

        {receiptFileName ? (
          <div className="flex items-center justify-between rounded-sm border border-cyan-deep bg-cyan/5 px-4 py-3 text-sm">
            <span className="truncate text-fg">{receiptFileName}</span>
            <button
              type="button"
              onClick={() => {
                setReceiptPath(null);
                setReceiptFileName(null);
              }}
              className="ml-3 shrink-0 text-xs font-semibold text-red-dark hover:underline"
            >
              {t("removeReceipt")}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full rounded-sm border border-dashed border-line px-4 py-6 text-sm font-semibold text-neutral-600 hover:border-cyan-deep hover:text-cyan-deep disabled:opacity-60"
          >
            {uploading ? t("uploadingReceipt") : t("uploadReceipt")}
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileSelected}
          className="hidden"
        />
      </div>

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
        disabled={submitting || uploading}
        className="w-full rounded-sm bg-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-dark disabled:opacity-60"
      >
        {submitting ? t("submitting") : t("confirmSent")}
      </button>
    </form>
  );
}
