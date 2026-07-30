import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/ProfileForm";
import type { Profile } from "@/lib/types";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const initialProfile: Profile = profile ?? {
    id: user.id,
    name: "",
    headline: "",
    bio: "",
    location: "",
    contact: user.email ?? "",
    category: "SELL",
    services: [],
    updated_at: new Date().toISOString(),
  };

  return (
    <main className="border-t-4 border-cyan bg-ink px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
          Your account
        </p>
        <h1 className="mt-3 font-display text-3xl font-black text-fg sm:text-4xl">
          Edit your profile
        </h1>
        <p className="mt-2 text-[15px] text-neutral-400">
          This is what other people see in the{" "}
          <Link href="/directory" className="text-cyan hover:underline">
            directory
          </Link>
          .
        </p>

        <ProfileForm profile={initialProfile} />
      </div>
    </main>
  );
}
