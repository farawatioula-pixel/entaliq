"use client";

import { useState } from "react";
import type { Service } from "@/lib/types";

export default function ServicePackages({
  services,
  contact,
  servicesLabel,
  contactLabel,
}: {
  services: Service[];
  contact: string;
  servicesLabel: string;
  contactLabel: string;
}) {
  const [active, setActive] = useState(0);

  if (services.length === 0) return null;

  const current = services[active];

  return (
    <div>
      <h2 className="mb-3 font-display text-lg font-bold text-fg">{servicesLabel}</h2>

      <div className="overflow-hidden rounded-sm border border-line bg-surface">
        {services.length > 1 && (
          <div className="flex border-b border-line" role="tablist">
            {services.map((s, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`flex-1 px-3 py-3 text-center text-sm font-semibold transition-colors ${
                  i === active
                    ? "border-b-2 border-red text-fg"
                    : "text-neutral-600 hover:text-fg"
                }`}
              >
                {s.title.length > 18 ? `${s.title.slice(0, 18)}…` : s.title}
              </button>
            ))}
          </div>
        )}

        <div className="px-6 py-6">
          <h3 className="font-display text-base font-bold text-fg">{current.title}</h3>
          {current.price && (
            <p className="mt-2 font-display text-2xl font-bold text-red-dark">
              {current.price}
            </p>
          )}
          {current.description && (
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              {current.description}
            </p>
          )}

          {contact && (
            <div className="mt-6 rounded-sm bg-paper px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                {contactLabel}
              </p>
              <p className="mt-1 text-[15px] font-semibold text-fg">{contact}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
