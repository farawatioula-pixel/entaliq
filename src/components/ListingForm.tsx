"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { ListingImagesUpload } from "@/components/ListingImagesUpload";
import type { Category, Listing, ListingPackage, FaqItem, PackageTier } from "@/lib/marketplace-types";

const emptyPackage = (tier: PackageTier): Omit<ListingPackage, "id" | "listing_id"> => ({
  tier,
  name: "",
  description: "",
  price: 0,
  delivery_days: 1,
  revisions: 1,
  features: [],
});

export default function ListingForm({
  sellerId,
  categories,
  listing,
  existingPackages,
}: {
  sellerId: string;
  categories: Category[];
  listing?: Listing;
  existingPackages?: ListingPackage[];
}) {
  const router = useRouter();
  const topLevel = categories.filter((c) => !c.parent_id);

  const [title, setTitle] = useState(listing?.title ?? "");
  const [description, setDescription] = useState(listing?.description ?? "");
  const [categoryId, setCategoryId] = useState(listing?.category_id ?? "");
  const [subcategoryId, setSubcategoryId] = useState(listing?.subcategory_id ?? "");
  const [tags, setTags] = useState((listing?.tags ?? []).join(", "));
  const [images, setImages] = useState<string[]>(listing?.images.length ? listing.images : [""]);
  const [requirements, setRequirements] = useState(listing?.requirements ?? "");
  const [faq, setFaq] = useState<FaqItem[]>(listing?.faq.length ? listing.faq : []);
  const [packages, setPackages] = useState<Omit<ListingPackage, "id" | "listing_id">[]>(
    existingPackages?.length
      ? existingPackages
      : [emptyPackage("basic")]
  );

  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const subcategories = categoryId ? categories.filter((c) => c.parent_id === categoryId) : [];

  function updateFaq(i: number, field: keyof FaqItem, value: string) {
    setFaq((prev) => prev.map((f, idx) => (idx === i ? { ...f, [field]: value } : f)));
  }
  function addFaq() {
    setFaq((prev) => [...prev, { question: "", answer: "" }]);
  }
  function removeFaq(i: number) {
    setFaq((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updatePackage(
    i: number,
    field: keyof Omit<ListingPackage, "id" | "listing_id">,
    value: string | number | string[]
  ) {
    setPackages((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));
  }
  function addPackageTier(tier: PackageTier) {
    if (packages.some((p) => p.tier === tier)) return;
    setPackages((prev) => [...prev, emptyPackage(tier)]);
  }
  function removePackage(i: number) {
    setPackages((prev) => prev.filter((_, idx) => idx !== i));
  }

  function validate(): string | null {
    if (!title.trim()) return "Title is required.";
    if (!description.trim()) return "Description is required.";
    if (!categoryId) return "Choose a category.";
    if (packages.length === 0) return "At least one package is required.";
    if (packages.some((p) => !p.price || p.price <= 0)) return "Every package needs a price.";
    return null;
  }

  async function save(status: "draft" | "published") {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(status === "draft" ? "draft" : "publish");
    setError(null);

    const supabase = createClient();
    const cleanedImages = images.map((i) => i.trim()).filter(Boolean);
    const cleanedTags = tags.split(",").map((t) => t.trim()).filter(Boolean);
    const cleanedFaq = faq.filter((f) => f.question.trim() && f.answer.trim());
    const startingPrice = Math.min(...packages.map((p) => Number(p.price) || 0));

    const payload = {
      seller_id: sellerId,
      title: title.trim(),
      description: description.trim(),
      category_id: categoryId,
      subcategory_id: subcategoryId || null,
      tags: cleanedTags,
      images: cleanedImages,
      starting_price: startingPrice,
      delivery_days: Math.min(...packages.map((p) => Number(p.delivery_days) || 1)),
      revisions: Math.max(...packages.map((p) => Number(p.revisions) || 0)),
      requirements: requirements.trim(),
      faq: cleanedFaq,
      status,
      updated_at: new Date().toISOString(),
    };

    let listingId = listing?.id;

    if (listingId) {
      const { error: updateError } = await supabase.from("listings").update(payload).eq("id", listingId);
      if (updateError) {
        setError(updateError.message);
        setSaving(null);
        return;
      }
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from("listings")
        .insert(payload)
        .select()
        .single();
      if (insertError || !inserted) {
        setError(insertError?.message ?? "Could not create listing.");
        setSaving(null);
        return;
      }
      listingId = inserted.id;
    }

    // Replace packages: delete existing, insert current set.
    await supabase.from("listing_packages").delete().eq("listing_id", listingId);
    const { error: pkgError } = await supabase.from("listing_packages").insert(
      packages.map((p) => ({ ...p, listing_id: listingId }))
    );

    setSaving(null);

    if (pkgError) {
      setError(pkgError.message);
      return;
    }

    router.push("/dashboard/listings");
    router.refresh();
  }

  return (
    <div className="space-y-10">
      {error && (
        <div className="rounded-sm border border-red-dark/30 bg-red/5 px-4 py-3 text-sm text-red-dark">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-fg">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="I will design a modern logo for your brand"
          className="mt-2 w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm text-fg focus:border-cyan-deep focus:outline-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-fg">Category</label>
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setSubcategoryId("");
            }}
            className="mt-2 w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm text-fg focus:border-cyan-deep focus:outline-none"
          >
            <option value="">Select category</option>
            {topLevel.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-fg">Subcategory</label>
          <select
            value={subcategoryId}
            onChange={(e) => setSubcategoryId(e.target.value)}
            disabled={!categoryId}
            className="mt-2 w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm text-fg focus:border-cyan-deep focus:outline-none disabled:opacity-50"
          >
            <option value="">None</option>
            {subcategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-fg">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="mt-2 w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm text-fg focus:border-cyan-deep focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-fg">Tags (comma separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="logo, branding, minimalist"
          className="mt-2 w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm text-fg focus:border-cyan-deep focus:outline-none"
        />
      </div>

      <div>
        <ListingImagesUpload sellerId={sellerId} images={images} onChange={setImages} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-fg">
          What you need from the buyer
        </label>
        <textarea
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          rows={3}
          className="mt-2 w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm text-fg focus:border-cyan-deep focus:outline-none"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-fg">Packages</label>
          <div className="flex gap-2">
            {(["basic", "standard", "premium"] as PackageTier[])
              .filter((tier) => !packages.some((p) => p.tier === tier))
              .map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => addPackageTier(tier)}
                  className="rounded-sm border border-line px-3 py-1 text-xs font-semibold text-neutral-600 hover:border-cyan-deep hover:text-cyan-deep"
                >
                  + {tier}
                </button>
              ))}
          </div>
        </div>

        <div className="mt-3 space-y-4">
          {packages.map((pkg, i) => (
            <div key={i} className="rounded-sm border border-line bg-surface p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold uppercase tracking-wide text-fg">{pkg.tier}</p>
                {packages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePackage(i)}
                    className="text-xs font-semibold text-red-dark hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  value={pkg.name}
                  onChange={(e) => updatePackage(i, "name", e.target.value)}
                  placeholder="Package name"
                  className="rounded-sm border border-line px-3 py-2 text-sm focus:border-cyan-deep focus:outline-none"
                />
                <input
                  type="number"
                  value={pkg.price || ""}
                  onChange={(e) => updatePackage(i, "price", Number(e.target.value))}
                  placeholder="Price (JOD)"
                  className="rounded-sm border border-line px-3 py-2 text-sm focus:border-cyan-deep focus:outline-none"
                />
                <input
                  type="number"
                  value={pkg.delivery_days || ""}
                  onChange={(e) => updatePackage(i, "delivery_days", Number(e.target.value))}
                  placeholder="Delivery days"
                  className="rounded-sm border border-line px-3 py-2 text-sm focus:border-cyan-deep focus:outline-none"
                />
                <input
                  type="number"
                  value={pkg.revisions || ""}
                  onChange={(e) => updatePackage(i, "revisions", Number(e.target.value))}
                  placeholder="Revisions"
                  className="rounded-sm border border-line px-3 py-2 text-sm focus:border-cyan-deep focus:outline-none"
                />
              </div>

              <textarea
                value={pkg.description}
                onChange={(e) => updatePackage(i, "description", e.target.value)}
                placeholder="What's included"
                rows={2}
                className="mt-3 w-full rounded-sm border border-line px-3 py-2 text-sm focus:border-cyan-deep focus:outline-none"
              />

              <input
                type="text"
                value={pkg.features.join(", ")}
                onChange={(e) =>
                  updatePackage(
                    i,
                    "features",
                    e.target.value.split(",").map((f) => f.trim()).filter(Boolean)
                  )
                }
                placeholder="Features, comma separated"
                className="mt-3 w-full rounded-sm border border-line px-3 py-2 text-sm focus:border-cyan-deep focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-fg">FAQ</label>
          <button
            type="button"
            onClick={addFaq}
            className="text-sm font-semibold text-cyan-deep hover:underline"
          >
            + Add question
          </button>
        </div>
        <div className="mt-3 space-y-3">
          {faq.map((item, i) => (
            <div key={i} className="rounded-sm border border-line bg-surface p-4">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={item.question}
                  onChange={(e) => updateFaq(i, "question", e.target.value)}
                  placeholder="Question"
                  className="flex-1 rounded-sm border border-line px-3 py-2 text-sm focus:border-cyan-deep focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeFaq(i)}
                  className="ml-2 text-xs font-semibold text-red-dark hover:underline"
                >
                  Remove
                </button>
              </div>
              <textarea
                value={item.answer}
                onChange={(e) => updateFaq(i, "answer", e.target.value)}
                placeholder="Answer"
                rows={2}
                className="mt-2 w-full rounded-sm border border-line px-3 py-2 text-sm focus:border-cyan-deep focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 border-t border-line pt-6">
        <button
          type="button"
          onClick={() => save("draft")}
          disabled={saving !== null}
          className="rounded-sm border border-line px-6 py-3 text-sm font-semibold text-fg transition-colors hover:border-cyan-deep hover:text-cyan-deep disabled:opacity-60"
        >
          {saving === "draft" ? "Saving..." : "Save draft"}
        </button>
        <button
          type="button"
          onClick={() => save("published")}
          disabled={saving !== null}
          className="rounded-sm bg-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-dark disabled:opacity-60"
        >
          {saving === "publish" ? "Publishing..." : "Publish"}
        </button>
      </div>
    </div>
  );
}
