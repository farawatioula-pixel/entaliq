"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ListingImagesUpload({
  sellerId,
  images,
  onChange,
}: {
  sellerId: string;
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setError(null);

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError("Please choose image files only.");
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Each image must be under 5MB.");
        continue;
      }

      setUploading(true);
      const supabase = createClient();
      const extension = file.name.split(".").pop() || "jpg";
      const path = `${sellerId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(path, file, { cacheControl: "3600" });

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("listing-images").getPublicUrl(path);

      onChange([...images.filter(Boolean), publicUrl]);
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-fg">Images</label>

      <div className="mt-2 flex flex-wrap gap-3">
        {images.filter(Boolean).map((img, i) => (
          <div key={img + i} className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt=""
              className="h-24 w-24 rounded-sm border border-line object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-surface text-xs text-red-dark hover:border-red-dark"
              aria-label="Remove image"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-24 w-24 flex-col items-center justify-center rounded-sm border border-dashed border-line text-xs font-semibold text-neutral-600 hover:border-cyan-deep hover:text-cyan-deep disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "+ Add photo"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesSelected}
          className="hidden"
        />
      </div>

      {error && <p className="mt-1.5 text-xs text-red-dark">{error}</p>}
    </div>
  );
}
