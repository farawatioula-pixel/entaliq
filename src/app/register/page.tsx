"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import RegisterForm from "@/components/RegisterForm";

const plenaryPoints = [
  "Conference in Amman",
  "Speakers & panel discussions",
  "Networking with practitioners",
  "Open to all backgrounds",
];

const trainingPoints = [
  "Ghor Al-Safi — in partnership with Jordan Bromine Company",
  "Seven digital income tracks",
  "Hands-on, project-based learning",
  "Designed for youth with no prior experience",
];

export default function RegisterPage() {
  const [open, setOpen] = useState<"plenary" | "training" | null>(null);

  return (
    <>
      <section className="border-t-4 border-red bg-ink text-white">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red">
            Intaleq 2026
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl">
            Register for the Movement
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-300">
            Whether you&apos;re joining as a conference attendee in Amman or a
            trainee in Ghor Al-Safi — your spot starts here.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Choose your path
        </p>

        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line lg:grid-cols-2">
          <div className="bg-surface px-8 py-10 sm:px-12 sm:py-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-red">
              Option 01
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold">Plenary Session</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-neutral-300">
              Attend the annual Intaleq conference in Amman. Panels, keynotes,
              and Jordan&apos;s digital economy practitioners — one room, one
              day, the full picture.
            </p>
            <ul className="mt-6 space-y-2">
              {plenaryPoints.map((p) => (
                <li key={p} className="flex items-start gap-2 text-[15px]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm">
              <span className="font-semibold">What you need:</span> Name, email,
              organisation
            </p>
            <button
              type="button"
              onClick={() => setOpen("plenary")}
              className="mt-8 flex w-full items-center justify-between rounded-sm bg-surface border border-line px-6 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-line"
            >
              Register for Plenary
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="bg-paper px-8 py-10 sm:px-12 sm:py-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-red">
              Option 02
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold">Training Program</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-neutral-300">
              Apply for the hands-on training program in Ghor Al-Safi. A real
              skill, a real project, and a launchable income source — by the
              end of the week.
            </p>
            <ul className="mt-6 space-y-2">
              {trainingPoints.map((p) => (
                <li key={p} className="flex items-start gap-2 text-[15px]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm">
              <span className="font-semibold">What you need:</span> Name, email,
              phone, age, background
            </p>
            <button
              type="button"
              onClick={() => setOpen("training")}
              className="mt-8 flex w-full items-center justify-between rounded-sm bg-red px-6 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-red-dark"
            >
              Apply for Training
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>

      {open && (
        <Modal
          title={open === "plenary" ? "Register for Plenary" : "Apply for Training"}
          onClose={() => setOpen(null)}
        >
          <RegisterForm type={open} onClose={() => setOpen(null)} />
        </Modal>
      )}
    </>
  );
}
