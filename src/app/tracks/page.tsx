import type { Metadata } from "next";
import TracksGrid, { TracksCTA } from "@/components/TracksGrid";
import LaunchCTA from "@/components/LaunchCTA";

export const metadata: Metadata = {
  title: "Tracks — Intaleq 2026",
  description:
    "Seven digital income tracks across three worlds — Sell, Create, Build — taught hands-on in Ghor Al-Safi.",
};

export default function TracksPage() {
  return (
    <>
      <section className="border-t-4 border-red bg-ink text-white">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
            Seven tracks · Three worlds
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl">
            Every path leads to income.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-300">
            Pick one track. Spend a week building the skill, the product, and
            the first client or sale that makes it real.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <TracksGrid showDetail />
        <TracksCTA />
      </section>

      <LaunchCTA />
    </>
  );
}
