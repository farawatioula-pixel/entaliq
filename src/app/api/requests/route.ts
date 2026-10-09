import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  let body: {
    conversation_id?: string;
    description?: string;
    images?: string[];
    desired_delivery?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { conversation_id, description, images, desired_delivery } = body;

  if (!conversation_id || !description || !description.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, buyer_id, seller_id, listing_id")
    .eq("id", conversation_id)
    .single();

  if (!conversation || conversation.buyer_id !== user.id) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  const { data: request, error } = await supabase
    .from("requests")
    .insert({
      conversation_id,
      buyer_id: user.id,
      seller_id: conversation.seller_id,
      listing_id: conversation.listing_id,
      description: description.trim(),
      images: (images ?? []).filter(Boolean),
      desired_delivery: desired_delivery?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ request });
}
