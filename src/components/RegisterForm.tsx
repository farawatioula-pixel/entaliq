"use client";

import { FormEvent, useState } from "react";

type FormType = "plenary" | "training";

const trainingBackgrounds = [
  "No prior experience",
  "Some self-taught skills",
  "Studying a related field",
  "Currently employed, looking to add a skill",
];

export default function RegisterForm({
  type,
  onClose,
}: {
  type: FormType;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    const nextErrors: Record<string, string> = {};
    if (!String(payload.name || "").trim()) nextErrors.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email || ""))) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (type === "plenary" && !String(payload.organisation || "").trim()) {
      nextErrors.organisation = "Tell us your organisation.";
    }
    if (type === "training") {
      if (!String(payload.phone || "").trim()) nextErrors.phone = "Enter a phone number.";
      const age = Number(payload.age);
      if (!age || age < 15 || age > 40) nextErrors.age = "Enter an age between 15 and 40.";
      if (!String(payload.background || "").trim()) nextErrors.background = "Select a background.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...payload }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-sm border border-line bg-paper p-8 text-center">
        <p className="font-display text-xl font-bold">You&apos;re in.</p>
        <p className="mt-2 text-[15px] text-neutral-600">
          {type === "plenary"
            ? "Your spot for the Intaleq 2026 plenary in Amman is confirmed. We'll email the schedule closer to the date."
            : "Your application for the Ghor Al-Safi training program has been received. We'll follow up by email with next steps."}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex items-center rounded-sm bg-ink px-6 py-2.5 text-sm font-semibold text-white hover:bg-black"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Field label="Full name" name="name" error={errors.name} required autoComplete="name" />
      <Field
        label="Email address"
        name="email"
        type="email"
        error={errors.email}
        required
        autoComplete="email"
      />

      {type === "plenary" && (
        <Field
          label="Organisation"
          name="organisation"
          error={errors.organisation}
          required
          autoComplete="organization"
        />
      )}

      {type === "training" && (
        <>
          <Field
            label="Phone number"
            name="phone"
            type="tel"
            error={errors.phone}
            required
            autoComplete="tel"
          />
          <Field label="Age" name="age" type="number" error={errors.age} required />
          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="background">
              Background
            </label>
            <select
              id="background"
              name="background"
              defaultValue=""
              className={`w-full rounded-sm border bg-white px-4 py-3 text-[15px] focus:border-ink ${
                errors.background ? "border-red" : "border-line"
              }`}
            >
              <option value="" disabled>
                Select one
              </option>
              {trainingBackgrounds.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            {errors.background && (
              <p className="mt-1 text-sm text-red">{errors.background}</p>
            )}
          </div>
        </>
      )}

      {status === "error" && (
        <p className="text-sm text-red">
          Something went wrong sending your submission. Please try again.
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex flex-1 items-center justify-center rounded-sm bg-red px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-red-dark disabled:opacity-60"
        >
          {status === "submitting"
            ? "Submitting…"
            : type === "plenary"
              ? "Register for Plenary"
              : "Apply for Training"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-sm border border-line px-5 py-3.5 text-[15px] font-semibold text-neutral-600 hover:bg-paper"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className={`w-full rounded-sm border bg-white px-4 py-3 text-[15px] focus:border-ink ${
          error ? "border-red" : "border-line"
        }`}
      />
      {error && <p className="mt-1 text-sm text-red">{error}</p>}
    </div>
  );
}
