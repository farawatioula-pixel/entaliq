import { createClient } from "@/lib/supabase/server";
import type { Conversation, Message } from "@/lib/marketplace-types";

export type ConversationWithParties = Conversation & {
  buyer: { id: string; name: string; avatar_url: string } | null;
  seller: { id: string; name: string; avatar_url: string } | null;
  listing: { id: string; title: string } | null;
  last_message: { content: string; sender_id: string } | null;
};

export async function getConversationsForUser(userId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("conversations")
    .select(
      "*, buyer:profiles!conversations_buyer_id_fkey(id, name, avatar_url), seller:profiles!conversations_seller_id_fkey(id, name, avatar_url), listing:listings(id, title)"
    )
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order("last_message_at", { ascending: false });

  const conversations = (data ?? []) as unknown as ConversationWithParties[];

  // Attach last message preview for each conversation.
  for (const c of conversations) {
    const { data: last } = await supabase
      .from("messages")
      .select("content, sender_id")
      .eq("conversation_id", c.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    c.last_message = last ?? null;
  }

  return conversations;
}

export async function getOrCreateConversation(
  buyerId: string,
  sellerId: string,
  listingId: string | null
) {
  const supabase = await createClient();

  const existingQuery = supabase
    .from("conversations")
    .select("*")
    .eq("buyer_id", buyerId)
    .eq("seller_id", sellerId);

  const { data: existing } = listingId
    ? await existingQuery.eq("listing_id", listingId).maybeSingle()
    : await existingQuery.is("listing_id", null).maybeSingle();

  if (existing) return existing as Conversation;

  const { data: created, error } = await supabase
    .from("conversations")
    .insert({ buyer_id: buyerId, seller_id: sellerId, listing_id: listingId })
    .select()
    .single();

  if (error) throw error;
  return created as Conversation;
}

export async function getConversationWithMessages(conversationId: string) {
  const supabase = await createClient();

  const { data: conversation } = await supabase
    .from("conversations")
    .select(
      "*, buyer:profiles!conversations_buyer_id_fkey(id, name, avatar_url), seller:profiles!conversations_seller_id_fkey(id, name, avatar_url), listing:listings(id, title)"
    )
    .eq("id", conversationId)
    .single();

  if (!conversation) return null;

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  return {
    conversation: conversation as unknown as ConversationWithParties,
    messages: (messages ?? []) as Message[],
  };
}
