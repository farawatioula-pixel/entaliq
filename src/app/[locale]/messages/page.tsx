import { redirect, Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getConversationsForUser } from "@/lib/messaging";

export const revalidate = 0;

export default async function MessagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale });
    return;
  }

  const conversations = await getConversationsForUser(user.id);

  return (
    <main className="border-t-4 border-cyan bg-paper px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-deep">
          Messages
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-fg sm:text-4xl">
          Your conversations
        </h1>

        {conversations.length === 0 ? (
          <div className="mt-10 rounded-sm border border-line bg-surface px-8 py-16 text-center">
            <p className="text-[15px] text-neutral-600">
              No conversations yet. Message a seller from a listing to start one.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-2">
            {conversations.map((c) => {
              const isBuyer = c.buyer_id === user.id;
              const other = isBuyer ? c.seller : c.buyer;
              return (
                <Link
                  key={c.id}
                  href={`/messages/${c.id}`}
                  className="flex items-center justify-between gap-3 rounded-sm border border-line bg-surface px-5 py-4 transition-colors hover:border-cyan-deep"
                >
                  <div>
                    <p className="font-display text-base font-bold text-fg">{other?.name}</p>
                    {c.listing && (
                      <p className="text-xs text-neutral-600">Re: {c.listing.title}</p>
                    )}
                    {c.last_message && (
                      <p className="mt-1 line-clamp-1 text-sm text-neutral-600">
                        {c.last_message.content}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
