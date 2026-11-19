import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { sourceLabel } from "@/lib/source";

export const revalidate = 0;

type Registration = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  organisation: string | null;
  locale: string | null;
  referred_by: string | null;
  share_token: string | null;
  referrer: string | null;
  utm_source: string | null;
  created_at: string;
};

/** Jordanian numbers come in as 07…, +9627…, 9627… — normalise for wa.me. */
function whatsappLink(phone: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.length < 7) return null;
  let msisdn = digits;
  if (msisdn.startsWith("00")) msisdn = msisdn.slice(2);
  if (msisdn.startsWith("0")) msisdn = `962${msisdn.slice(1)}`;
  else if (!msisdn.startsWith("962")) msisdn = `962${msisdn}`;
  return `https://wa.me/${msisdn}`;
}

function amman(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-JO" : "en-GB", {
    timeZone: "Asia/Amman",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

export default async function AdminRegistrationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("adminRegistrationsPage");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale });
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) notFound();

  const { data } = await supabase
    .from("registrations")
    .select(
      "id, name, email, phone, organisation, locale, referred_by, share_token, referrer, utm_source, created_at"
    )
    .eq("type", "ceremony")
    .order("created_at", { ascending: false });

  const all = (data ?? []) as Registration[];

  // Signups that arrived through someone else's shared card.
  const referred = all.filter((r) => r.referred_by);

  // How many came from each channel, biggest first.
  const sourceCounts = new Map<string, number>();
  for (const r of all) {
    const s = sourceLabel(r);
    const key =
      s.kind === "shared" ? t("sourceShared") : s.kind === "direct" ? t("sourceDirect") : s.label;
    sourceCounts.set(key, (sourceCounts.get(key) ?? 0) + 1);
  }
  const sources = [...sourceCounts.entries()].sort((a, b) => b[1] - a[1]);

  // Server component with revalidate = 0: this renders once per request, so
  // reading the clock here is the intended behaviour rather than an unstable
  // value that could change between re-renders.
  // eslint-disable-next-line react-hooks/purity
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const last24h = all.filter((r) => r.created_at > since);

  const stats = [
    { label: t("totalLabel"), value: all.length, accent: true },
    { label: t("last24hLabel"), value: last24h.length },
    { label: t("referredLabel"), value: referred.length },
  ];

  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-neutral-600">{t("refreshHint")}</p>

        <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface px-6 py-5">
              <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
                {s.label}
              </dt>
              <dd
                className={`mt-2 font-display text-4xl font-bold ${
                  s.accent ? "text-red-dark" : "text-fg"
                }`}
              >
                {s.value}
              </dd>
            </div>
          ))}
        </dl>

        {sources.length > 0 && (
          <section className="mt-10 border border-line bg-surface px-6 py-6">
            <h2 className="font-display text-lg font-bold">{t("sourcesHeading")}</h2>
            <p className="mt-1 text-sm text-neutral-600">{t("sourcesHint")}</p>
            <ul className="mt-5 space-y-2.5">
              {sources.map(([label, count]) => (
                <li key={label} className="flex items-center gap-4">
                  <span className="w-36 shrink-0 truncate text-sm font-semibold text-fg">
                    {label}
                  </span>
                  <span className="h-2.5 flex-1 overflow-hidden rounded-sm bg-paper">
                    <span
                      className="block h-full bg-cyan-deep"
                      style={{ width: `${Math.round((count / all.length) * 100)}%` }}
                    />
                  </span>
                  <span className="w-20 shrink-0 text-end text-sm tabular-nums text-neutral-600">
                    {count} · {Math.round((count / all.length) * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {all.length === 0 ? (
          <p className="mt-10 text-sm text-neutral-600">{t("empty")}</p>
        ) : (
          <div className="mt-10 overflow-x-auto border border-line bg-surface">
            <table className="w-full min-w-[720px] border-collapse text-start text-sm">
              <thead>
                <tr className="border-b border-line bg-paper">
                  {[t("colName"), t("colOrg"), t("colPhone"), t("colEmail"), t("colWhen"), t("colSource")].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-widest text-muted"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {all.map((r) => {
                  const wa = whatsappLink(r.phone);
                  const src = sourceLabel(r);
                  return (
                    <tr key={r.id} className="border-b border-line last:border-0">
                      <td className="px-4 py-3 font-semibold text-fg">{r.name}</td>
                      <td className="px-4 py-3 text-neutral-600">{r.organisation || "—"}</td>
                      <td className="px-4 py-3">
                        {wa ? (
                          <a
                            href={wa}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-cyan-deep hover:underline"
                            dir="ltr"
                          >
                            {r.phone}
                          </a>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-neutral-600" dir="ltr">
                        {r.email || "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-neutral-600">
                        {amman(r.created_at, locale)}
                      </td>
                      <td className="px-4 py-3">
                        {src.kind === "shared" ? (
                          <span className="rounded-sm border border-cyan-deep bg-cyan/10 px-2 py-0.5 text-xs font-semibold text-cyan-deep">
                            {t("sourceShared")}
                          </span>
                        ) : src.kind === "direct" ? (
                          <span className="text-xs text-neutral-500">{t("sourceDirect")}</span>
                        ) : (
                          <span
                            className="rounded-sm border border-line bg-paper px-2 py-0.5 text-xs font-semibold text-fg"
                            dir="ltr"
                          >
                            {src.label}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
