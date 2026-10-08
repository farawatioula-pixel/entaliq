import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  }

  let body: { action?: "accept" | "decline" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (body.action !== "accept" && body.action !== "decline") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const { data: offer } = await supabase.from("offers").select("*").eq("id", id).single();

  if (!offer || offer.buyer_id !== user.id) {
    return NextResponse.json({ error: "Offer not found" }, { status: 404 });
  }

  if (offer.status !== "pending") {
    return NextResponse.json({ error: "This offer has already been responded to." }, { status: 400 });
  }

  if (body.action === "decline") {
    await supabase.from("offers").update({ status: "declined" }).eq("id", id);
    return NextResponse.json({ ok: true });
  }

  const deadline = new Date();
  deadline.setDate(deadline.getDate() + offer.delivery_days);

  const platformFeePercent = 5;
  const platformFeeAmount = Math.round(offer.price * (platformFeePercent / 100) * 100) / 100;
  const totalAmount = Math.round((offer.price + platformFeeAmount) * 100) / 100;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      listing_id: offer.listing_id,
      package_id: null,
      buyer_id: offer.buyer_id,
      seller_id: offer.seller_id,
      price: offer.price,
      status: "pending",
      delivery_deadline: deadline.toISOString(),
      platform_fee_percent: platformFeePercent,
      platform_fee_amount: platformFeeAmount,
      total_amount: totalAmount,
    })
    .select()
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: orderError?.message ?? "Could not create order" }, { status: 500 });
  }

  await supabase.from("offers").update({ status: "accepted", order_id: order.id }).eq("id", id);

  // Carry the buyer's original requirements (text + images) over to the order.
  if (offer.request_id) {
    const { data: requestRow } = await supabase
      .from("requests")
      .select("description, images")
      .eq("id", offer.request_id)
      .single();

    if (requestRow) {
      await supabase
        .from("orders")
        .update({ requirements: requestRow.description })
        .eq("id", order.id);

      const images: string[] = requestRow.images ?? [];
      if (images.length > 0) {
        await supabase.from("order_files").insert(
          images.map((url) => ({
            order_id: order.id,
            uploader_id: offer.buyer_id,
            file_url: url,
            file_type: "requirement" as const,
          }))
        );
      }
    }
  }

  return NextResponse.json({ order });
}
