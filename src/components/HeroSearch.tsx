"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";

export default function HeroSearch({
  placeholder,
  ctaLabel,
}: {
  placeholder: string;
  ctaLabel: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/marketplace?q=${encodeURIComponent(trimmed)}` : "/marketplace");
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="mt-8 flex max-w-xl gap-2">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="flex-1 rounded-sm border border-line bg-surface px-4 py-3.5 text-[15px] text-fg placeholder:text-neutral-400 focus:border-cyan-deep focus:outline-none"
      />
      <button
        type="submit"
        className="shrink-0 rounded-sm bg-red px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-red-dark"
      >
        {ctaLabel}
      </button>
    </form>
  );
}
