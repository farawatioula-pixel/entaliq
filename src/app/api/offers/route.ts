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
    listing_id?: string;
    title?: string;
    description?: string;
    price?: number;
    delivery_days?: number;
    request_id?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { conversation_id, listing_id, title, description, price, delivery_days, request_id } = body;

  if (!conversation_id || !listing_id || !title || !price || !delivery_days) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, buyer_id, seller_id")
    .eq("id", conversation_id)
    .single();

  if (!conversation || conversation.seller_id !== user.id) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("id, seller_id")
    .eq("id", listing_id)
    .eq("seller_id", user.id)
    .single();

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  let requestId: string | null = null;
  if (request_id) {
    const { data: requestRow } = await supabase
      .from("requests")
      .select("id, conversation_id, seller_id, status")
      .eq("id", request_id)
      .single();

    if (!requestRow || requestRow.conversation_id !== conversation_id || requestRow.seller_id !== user.id) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }
    requestId = requestRow.id;
  }

  const { data: offer, error } = await supabase
    .from("offers")
    .insert({
      conversation_id,
      seller_id: user.id,
      buyer_id: conversation.buyer_id,
      listing_id,
      request_id: requestId,
      title,
      description: description ?? "",
      price,
      delivery_days,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (requestId) {
    await supabase.from("requests").update({ status: "quoted", offer_id: offer.id }).eq("id", requestId);
  }

  return NextResponse.json({ offer });
}
