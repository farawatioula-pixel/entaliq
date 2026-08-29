import { createClient } from "@/lib/supabase/server";
import type { Order, OrderFile } from "@/lib/marketplace-types";

export type OrderWithDetails = Order & {
  listing: { id: string; title: string; images: string[] } | null;
  buyer: { id: string; name: string; avatar_url: string } | null;
  seller: { id: string; name: string; avatar_url: string } | null;
};

export async function getOrdersForUser(userId: string, role: "buyer" | "seller") {
  const supabase = await createClient();
  const column = role === "buyer" ? "buyer_id" : "seller_id";

  const { data } = await supabase
    .from("orders")
    .select(
      "*, listing:listings(id, title, images), buyer:profiles!orders_buyer_id_fkey(id, name, avatar_url), seller:profiles!orders_seller_id_fkey(id, name, avatar_url)"
    )
    .eq(column, userId)
    .order("created_at", { ascending: false });

  return (data ?? []) as unknown as OrderWithDetails[];
}

export async function getOrderById(id: string) {
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select(
      "*, listing:listings(id, title, images), buyer:profiles!orders_buyer_id_fkey(id, name, avatar_url), seller:profiles!orders_seller_id_fkey(id, name, avatar_url)"
    )
    .eq("id", id)
    .single();

  if (!order) return null;

  const { data: files } = await supabase
    .from("order_files")
    .select("*")
    .eq("order_id", id)
    .order("created_at", { ascending: true });

  const { data: review } = await supabase
    .from("reviews")
    .select("*")
    .eq("order_id", id)
    .maybeSingle();

  return {
    order: order as unknown as OrderWithDetails,
    files: (files ?? []) as OrderFile[],
    review,
  };
}

export async function getSellerStats(sellerId: string) {
  const supabase = await createClient();

  const { data: listings } = await supabase
    .from("listings")
    .select("id, status, views, clicks, rating, review_count")
    .eq("seller_id", sellerId);

  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, price")
    .eq("seller_id", sellerId);

  const activeOrders = (orders ?? []).filter((o) =>
    ["pending", "accepted", "in_progress", "revision_requested"].includes(o.status)
  ).length;

  const completedOrders = (orders ?? []).filter((o) => o.status === "completed");
  const totalEarnings = completedOrders.reduce((sum, o) => sum + Number(o.price), 0);

  const totalViews = (listings ?? []).reduce((sum, l) => sum + l.views, 0);
  const totalReviews = (listings ?? []).reduce((sum, l) => sum + l.review_count, 0);
  const avgRating = (listings ?? []).length
    ? (listings ?? []).reduce((sum, l) => sum + l.rating, 0) / (listings ?? []).length
    : 0;

  return {
    totalListings: (listings ?? []).length,
    publishedListings: (listings ?? []).filter((l) => l.status === "published").length,
    activeOrders,
    completedOrders: completedOrders.length,
    totalEarnings,
    totalViews,
    totalReviews,
    avgRating,
  };
}
