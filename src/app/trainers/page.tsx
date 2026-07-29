import type { Metadata } from "next";
import Link from "next/link";
import TrainersGrid from "@/components/TrainersGrid";
import LaunchCTA from "@/components/LaunchCTA";

export const metadata: Metadata = {
  title: "Trainers — Intaleq 2026",
  description:
    "Meet the practitioners leading Intaleq 2026's hands-on training tracks in Ghor Al-Safi.",
};

export default function TrainersPage() {
  return (
    <>
      <section className="border-t-4 border-red bg-ink text-white">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red">
            Who&apos;s leading the training
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl">
            Practitioners, not lecturers.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-300">
            Every trainer at Intaleq is actively working in the field they
            teach — not presenting theory, but the exact process they use to
            earn from it.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <TrainersGrid showBio />

        <div className="mt-14 flex flex-col items-start gap-4 rounded-sm border border-line bg-paper p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold">
              Are you a practitioner in a digital income field?
            </h2>
            <p className="mt-1 text-[15px] text-neutral-300">
              Intaleq is looking to expand its trainer bench for future
              cohorts.
            </p>
          </div>
          <Link
            href="/partners#partner-with-us"
            className="inline-flex shrink-0 items-center rounded-sm bg-surface border border-line px-6 py-3 text-sm font-semibold text-white hover:bg-line"
          >
            Get in touch
          </Link>
        </div>
      </section>

      <LaunchCTA />
    </>
  );
}
