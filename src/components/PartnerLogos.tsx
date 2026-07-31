import { partners } from "@/lib/data";

export default function PartnerLogos() {
  return (
    <div>
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted">
        Supported by
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-14 gap-y-6">
        {partners.map((name) => (
          <span
            key={name}
            className="font-display text-2xl font-bold text-neutral-400 transition-colors hover:text-fg"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
