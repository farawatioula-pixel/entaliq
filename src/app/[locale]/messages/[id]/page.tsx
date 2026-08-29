import { notFound } from "next/navigation";
import { redirect, Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getConversationWithMessages } from "@/lib/messaging";
import { MessageThread } from "@/components/MessageThread";

export const revalidate = 0;

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale });
    return;
  }

  const result = await getConversationWithMessages(id);
  if (!result) notFound();

  const { conversation, messages } = result;
  const isParticipant = conversation.buyer_id === user.id || conversation.seller_id === user.id;
  if (!isParticipant) notFound();

  const other = conversation.buyer_id === user.id ? conversation.seller : conversation.buyer;

  return (
    <main className="border-t-4 border-cyan bg-paper px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <nav className="text-xs text-neutral-600">
          <Link href="/messages" className="hover:text-cyan-deep">
            Messages
          </Link>{" "}
          / <span className="text-fg">{other?.name}</span>
        </nav>

        <h1 className="mt-3 font-display text-2xl font-bold text-fg sm:text-3xl">
          {other?.name}
        </h1>
        {conversation.listing && (
          <p className="mt-1 text-sm text-neutral-600">Re: {conversation.listing.title}</p>
        )}

        <div className="mt-6">
          <MessageThread
            conversationId={conversation.id}
            currentUserId={user.id}
            initialMessages={messages}
          />
        </div>
      </div>
    </main>
  );
}
