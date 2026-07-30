import type { Metadata } from "next";
import PartnerLogos from "@/components/PartnerLogos";
import PartnerForm from "@/components/PartnerForm";

export const metadata: Metadata = {
  title: "Partners — Intaleq 2026",
  description:
    "Partner with Intaleq 2026 — Jordan's Digital Youth Income & Training Platform. Sponsorship tiers and measurable impact.",
};

const tiers = [
  {
    name: "Anchor Partner",
    body: "Top billing across the plenary and training week, a speaking slot in Amman, and co-branding on the Ghor Al-Safi training site.",
  },
  {
    name: "Track Sponsor",
    body: "Your name attached to one of the seven digital income tracks, with trainee outcomes reported back for that track specifically.",
  },
  {
    name: "In-Kind Partner",
    body: "Provide space, equipment, logistics, or trainer time in exchange for recognition across all Intaleq 2026 materials.",
  },
];

export default function PartnersPage() {
  return (
    <>
      <section className="border-t-4 border-red bg-ink text-white">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
            Partners
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl">
            Tie your name to youth economic empowerment.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-300">
            A national annual platform with measurable impact: number of
            trainees, income generated, projects actually launched.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <PartnerLogos />

        <div className="mt-20 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
          {tiers.map((tier) => (
            <div key={tier.name} className="bg-surface px-8 py-10">
              <h2 className="font-display text-xl font-bold">{tier.name}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-neutral-300">
                {tier.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="partner-with-us" className="scroll-mt-20 bg-ink py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-red">
            Partner with us
          </p>
          <h2 className="mt-4 font-display text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
            Ready to lock in your partnership?
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-neutral-400">
            Tell us a little about your organisation and what you&apos;d like
            to support — we&apos;ll follow up with sponsorship tiers and
            impact metrics.
          </p>

          <div className="mt-10">
            <PartnerForm />
          </div>
        </div>
      </section>
    </>
  );
}
