import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

const categoryColor: Record<Profile["category"], string> = {
  SELL: "text-cyan",
  CREATE: "text-muted",
  BUILD: "text-red",
};

export const revalidate = 0;

export default async function DirectoryPage() {
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .neq("name", "")
    .order("updated_at", { ascending: false });

  const list = (profiles ?? []) as Profile[];

  return (
    <main className="border-t-4 border-cyan bg-ink px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Directory</p>
        <h1 className="mt-3 font-display text-3xl font-black text-fg sm:text-4xl">
          Services from the Intaleq community
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-neutral-400">
          Trainees who&apos;ve set up a profile and listed what they offer.
        </p>

        {list.length === 0 ? (
          <div className="mt-12 rounded-sm border border-line bg-surface px-8 py-16 text-center">
            <p className="text-[15px] text-neutral-400">
              No profiles yet.{" "}
              <Link href="/signup" className="text-cyan hover:underline">
                Be the first to set one up.
              </Link>
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {list.map((profile) => (
              <Link
                key={profile.id}
                href={`/directory/${profile.id}`}
                className="flex flex-col gap-3 bg-surface px-6 py-7 transition-colors hover:bg-paper"
              >
                <p
                  className={`text-xs font-semibold uppercase tracking-widest ${categoryColor[profile.category]}`}
                >
                  {profile.category}
                </p>
                <h2 className="font-display text-xl font-bold text-fg">{profile.name}</h2>
                {profile.headline && (
                  <p className="text-[15px] text-neutral-300">{profile.headline}</p>
                )}
                {profile.location && (
                  <p className="mt-auto text-xs text-neutral-400">{profile.location}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
