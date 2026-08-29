import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be logged in to order." }, { status: 401 });
  }

  let body: { listing_id?: string; package_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { listing_id, package_id } = body;
  if (!listing_id) {
    return NextResponse.json({ error: "Missing listing_id" }, { status: 400 });
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("id, seller_id, starting_price, status")
    .eq("id", listing_id)
    .single();

  if (!listing || listing.status !== "published") {
    return NextResponse.json({ error: "Listing is not available" }, { status: 404 });
  }

  if (listing.seller_id === user.id) {
    return NextResponse.json({ error: "You cannot order your own listing" }, { status: 400 });
  }

  let price = listing.starting_price;
  let deliveryDays = 1;

  if (package_id) {
    const { data: pkg } = await supabase
      .from("listing_packages")
      .select("price, delivery_days")
      .eq("id", package_id)
      .eq("listing_id", listing_id)
      .single();
    if (!pkg) {
      return NextResponse.json({ error: "Package not found for this listing" }, { status: 404 });
    }
    price = pkg.price;
    deliveryDays = pkg.delivery_days;
  }

  const deadline = new Date();
  deadline.setDate(deadline.getDate() + deliveryDays);

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      listing_id,
      package_id: package_id ?? null,
      buyer_id: user.id,
      seller_id: listing.seller_id,
      price,
      status: "pending",
      delivery_deadline: deadline.toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ order });
}
