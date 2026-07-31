import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

const categoryColor: Record<Profile["category"], string> = {
  SELL: "text-cyan-deep",
  CREATE: "text-violet-deep",
  BUILD: "text-red-dark",
};

export default async function DirectoryProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("directoryProfilePage");
  const categoryLabels = t.raw("categoryLabels") as Record<Profile["category"], string>;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile || !profile.name) {
    notFound();
  }

  const p = profile as Profile;

  return (
    <main className="border-t-4 border-cyan bg-paper px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/directory" className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-fg">
          <span className="inline-block rtl:-scale-x-100">←</span> {t("backToDirectory")}
        </Link>

        <p className={`mt-6 text-xs font-semibold uppercase tracking-widest ${categoryColor[p.category]}`}>
          {categoryLabels[p.category]}
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-fg sm:text-4xl">{p.name}</h1>
        {p.headline && <p className="mt-2 text-lg text-neutral-600">{p.headline}</p>}
        {p.location && <p className="mt-1 text-sm text-neutral-600">{p.location}</p>}

        {p.bio && <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-neutral-600">{p.bio}</p>}

        {p.contact && (
          <div className="mt-6 inline-block rounded-sm border border-line bg-surface px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              {t("contact")}
            </p>
            <p className="mt-1 text-[15px] text-fg">{p.contact}</p>
          </div>
        )}

        {p.services.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-xl font-bold text-fg">{t("services")}</h2>
            <div className="mt-4 space-y-px overflow-hidden rounded-sm border border-line bg-line">
              {p.services.map((service, i) => (
                <div key={i} className="flex flex-col gap-1 bg-surface px-6 py-5 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold text-fg">{service.title}</h3>
                    {service.description && (
                      <p className="mt-1 text-[15px] text-neutral-600">{service.description}</p>
                    )}
                  </div>
                  {service.price && (
                    <p className="shrink-0 text-sm font-semibold text-red-dark sm:ms-6">{service.price}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
