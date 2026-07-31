"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Service } from "@/lib/types";

const categories: Profile["category"][] = ["SELL", "CREATE", "BUILD"];
const categoryLabel: Record<Profile["category"], string> = {
  SELL: "Sell — e-commerce & affiliate marketing",
  CREATE: "Create — content, freelancing, digital products",
  BUILD: "Build — vibe coding & AI services",
};

const emptyService: Service = { title: "", description: "", price: "" };

export default function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [name, setName] = useState(profile.name);
  const [headline, setHeadline] = useState(profile.headline);
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location);
  const [contact, setContact] = useState(profile.contact);
  const [category, setCategory] = useState<Profile["category"]>(profile.category);
  const [services, setServices] = useState<Service[]>(
    profile.services.length ? profile.services : [emptyService]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function updateService(index: number, field: keyof Service, value: string) {
    setServices((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  }

  function addService() {
    setServices((prev) => [...prev, { ...emptyService }]);
  }

  function removeService(index: number) {
    setServices((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const cleanedServices = services
      .map((s) => ({ ...s, title: s.title.trim(), description: s.description.trim(), price: s.price.trim() }))
      .filter((s) => s.title.length > 0);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        name,
        headline,
        bio,
        location,
        contact,
        category,
        services: cleanedServices,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSaved(true);
    router.refresh();
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-10">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-600">Full name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-sm border border-line bg-surface px-4 py-3 text-[15px] text-fg focus:border-red focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-600">
            Headline
          </label>
          <input
            placeholder="e.g. Social media manager & content creator"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full rounded-sm border border-line bg-surface px-4 py-3 text-[15px] text-fg focus:border-red focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-600">
            Location
          </label>
          <input
            placeholder="e.g. Amman, Jordan"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-sm border border-line bg-surface px-4 py-3 text-[15px] text-fg focus:border-red focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-600">
            Contact (WhatsApp, email, or link)
          </label>
          <input
            placeholder="e.g. WhatsApp: +962 7..."
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full rounded-sm border border-line bg-surface px-4 py-3 text-[15px] text-fg focus:border-red focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-600">About you</label>
        <textarea
          rows={4}
          placeholder="A couple of sentences about what you do."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full rounded-sm border border-line bg-surface px-4 py-3 text-[15px] text-fg focus:border-red focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-neutral-600">Track</label>
        <div className="grid gap-3 sm:grid-cols-3">
          {categories.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-sm border px-4 py-3 text-left text-sm transition-colors ${
                category === c
                  ? "border-red bg-surface text-fg"
                  : "border-line text-neutral-600 hover:text-fg"
              }`}
            >
              {categoryLabel[c]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-neutral-600">Your services</label>
          <button
            type="button"
            onClick={addService}
            className="text-sm font-semibold text-cyan-deep hover:underline"
          >
            + Add a service
          </button>
        </div>

        <div className="mt-3 space-y-4">
          {services.map((service, i) => (
            <div key={i} className="rounded-sm border border-line bg-surface p-5">
              <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-neutral-600">
                    Service title
                  </label>
                  <input
                    placeholder="e.g. Instagram content package"
                    value={service.title}
                    onChange={(e) => updateService(i, "title", e.target.value)}
                    className="w-full rounded-sm border border-line bg-paper px-3 py-2.5 text-[15px] text-fg focus:border-red focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-neutral-600">
                    Price
                  </label>
                  <input
                    placeholder="e.g. 30 JOD / post"
                    value={service.price}
                    onChange={(e) => updateService(i, "price", e.target.value)}
                    className="w-full rounded-sm border border-line bg-paper px-3 py-2.5 text-[15px] text-fg focus:border-red focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-medium text-neutral-600">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="What's included, turnaround time, etc."
                  value={service.description}
                  onChange={(e) => updateService(i, "description", e.target.value)}
                  className="w-full rounded-sm border border-line bg-paper px-3 py-2.5 text-[15px] text-fg focus:border-red focus:outline-none"
                />
              </div>
              {services.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeService(i)}
                  className="mt-3 text-xs font-semibold text-neutral-600 hover:text-red-dark"
                >
                  Remove this service
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-dark">{error}</p>}
      {saved && <p className="text-sm text-cyan-deep">Saved.</p>}

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-8">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center rounded-sm bg-red px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-dark disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save profile"}
        </button>
        <button
          type="button"
          onClick={handleSignOut}
          className="text-sm font-semibold text-neutral-600 hover:text-fg"
        >
          Sign out
        </button>
      </div>
    </form>
  );
}
