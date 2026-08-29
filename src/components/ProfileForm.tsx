"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { AvatarUpload } from "@/components/AvatarUpload";
import type { Profile, Service } from "@/lib/types";

const categories: Profile["category"][] = ["SELL", "CREATE", "BUILD"];

const emptyService: Service = { title: "", description: "", price: "" };

export default function ProfileForm({ profile }: { profile: Profile }) {
  const t = useTranslations("profileForm");
  const router = useRouter();
  const [name, setName] = useState(profile.name);
  const [headline, setHeadline] = useState(profile.headline);
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location);
  const [contact, setContact] = useState(profile.contact);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [portfolioImages, setPortfolioImages] = useState<string[]>(
    profile.portfolio_images.length ? profile.portfolio_images : [""]
  );
  const [category, setCategory] = useState<Profile["category"]>(profile.category);
  const [services, setServices] = useState<Service[]>(
    profile.services.length ? profile.services : [emptyService]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const categoryLabel: Record<Profile["category"], string> = {
    SELL: t("categorySell"),
    CREATE: t("categoryCreate"),
    BUILD: t("categoryBuild"),
  };

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

  function updatePortfolioImage(index: number, value: string) {
    setPortfolioImages((prev) => prev.map((url, i) => (i === index ? value : url)));
  }

  function addPortfolioImage() {
    setPortfolioImages((prev) => [...prev, ""]);
  }

  function removePortfolioImage(index: number) {
    setPortfolioImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const cleanedServices = services
      .map((s) => ({ ...s, title: s.title.trim(), description: s.description.trim(), price: s.price.trim() }))
      .filter((s) => s.title.length > 0);

    const cleanedPortfolioImages = portfolioImages.map((url) => url.trim()).filter(Boolean);

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
        avatar_url: avatarUrl.trim(),
        portfolio_images: cleanedPortfolioImages,
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
          <label className="mb-1.5 block text-sm font-medium text-neutral-600">
            {t("fullName")}
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-sm border border-line bg-surface px-4 py-3 text-[15px] text-fg focus:border-red focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-600">
            {t("headline")}
          </label>
          <input
            placeholder={t("headlinePlaceholder")}
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full rounded-sm border border-line bg-surface px-4 py-3 text-[15px] text-fg focus:border-red focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-600">
            {t("location")}
          </label>
          <input
            placeholder={t("locationPlaceholder")}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-sm border border-line bg-surface px-4 py-3 text-[15px] text-fg focus:border-red focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-600">
            {t("contact")}
          </label>
          <input
            placeholder={t("contactPlaceholder")}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full rounded-sm border border-line bg-surface px-4 py-3 text-[15px] text-fg focus:border-red focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <AvatarUpload userId={profile.id} value={avatarUrl} onChange={setAvatarUrl} />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-600">
          {t("aboutYou")}
        </label>
        <textarea
          rows={4}
          placeholder={t("aboutYouPlaceholder")}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full rounded-sm border border-line bg-surface px-4 py-3 text-[15px] text-fg focus:border-red focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-neutral-600">{t("track")}</label>
        <div className="grid gap-3 sm:grid-cols-3">
          {categories.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-sm border px-4 py-3 text-start text-sm transition-colors ${
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
          <label className="block text-sm font-medium text-neutral-600">
            {t("portfolioImages")}
          </label>
          <button
            type="button"
            onClick={addPortfolioImage}
            className="text-sm font-semibold text-cyan-deep hover:underline"
          >
            {t("addImage")}
          </button>
        </div>

        <div className="mt-3 space-y-3">
          {portfolioImages.map((url, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                placeholder={t("imageUrlPlaceholder")}
                value={url}
                onChange={(e) => updatePortfolioImage(i, e.target.value)}
                className="w-full rounded-sm border border-line bg-surface px-4 py-3 text-[15px] text-fg focus:border-red focus:outline-none"
              />
              {portfolioImages.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePortfolioImage(i)}
                  className="shrink-0 text-xs font-semibold text-neutral-600 hover:text-red-dark"
                >
                  {t("removeImage")}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-neutral-600">
            {t("yourServices")}
          </label>
          <button
            type="button"
            onClick={addService}
            className="text-sm font-semibold text-cyan-deep hover:underline"
          >
            {t("addService")}
          </button>
        </div>

        <div className="mt-3 space-y-4">
          {services.map((service, i) => (
            <div key={i} className="rounded-sm border border-line bg-surface p-5">
              <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-neutral-600">
                    {t("serviceTitle")}
                  </label>
                  <input
                    placeholder={t("serviceTitlePlaceholder")}
                    value={service.title}
                    onChange={(e) => updateService(i, "title", e.target.value)}
                    className="w-full rounded-sm border border-line bg-paper px-3 py-2.5 text-[15px] text-fg focus:border-red focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-neutral-600">
                    {t("price")}
                  </label>
                  <input
                    placeholder={t("pricePlaceholder")}
                    value={service.price}
                    onChange={(e) => updateService(i, "price", e.target.value)}
                    className="w-full rounded-sm border border-line bg-paper px-3 py-2.5 text-[15px] text-fg focus:border-red focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-medium text-neutral-600">
                  {t("description")}
                </label>
                <textarea
                  rows={2}
                  placeholder={t("descriptionPlaceholder")}
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
                  {t("removeService")}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-dark">{error}</p>}
      {saved && <p className="text-sm text-cyan-deep">{t("saved")}</p>}

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-8">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center rounded-sm bg-red px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-dark disabled:opacity-60"
        >
          {saving ? t("saving") : t("saveProfile")}
        </button>
        <button
          type="button"
          onClick={handleSignOut}
          className="text-sm font-semibold text-neutral-600 hover:text-fg"
        >
          {t("signOut")}
        </button>
      </div>
    </form>
  );
}
