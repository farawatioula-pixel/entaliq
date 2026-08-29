"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AvatarUpload({
  userId,
  value,
  onChange,
}: {
  userId: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }

    setUploading(true);
    setError(null);

    const supabase = createClient();
    const extension = file.name.split(".").pop() || "jpg";
    // A fixed filename per user means re-uploading replaces the old photo
    // instead of piling up unused files in storage.
    const path = `${userId}/photo.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, cacheControl: "3600" });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);

    // Cache-bust so the new photo shows immediately instead of a stale
    // cached version at the same URL.
    onChange(`${publicUrl}?t=${Date.now()}`);
    setUploading(false);
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-neutral-600">
        Profile photo
      </label>

      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-surface">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-2xl text-neutral-300">?</span>
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-sm border border-line px-4 py-2 text-sm font-semibold text-fg transition-colors hover:border-cyan hover:text-cyan-deep disabled:opacity-60"
          >
            {uploading ? "Uploading…" : value ? "Change photo" : "Upload photo"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelected}
            className="hidden"
          />
          {error && <p className="mt-1.5 text-xs text-red-dark">{error}</p>}
        </div>
      </div>
    </div>
  );
}
