"use client";

import { useState } from "react";

export default function PortfolioGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  return (
    <div>
      <div className="aspect-video w-full overflow-hidden rounded-sm border border-line bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${i + 1}`}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-sm border-2 transition-colors ${
                i === active ? "border-red" : "border-line hover:border-neutral-400"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
