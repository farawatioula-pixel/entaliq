export type Category = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  icon: string;
  sort_order: number;
};

export type ListingStatus = "draft" | "published" | "unpublished";

export type FaqItem = { question: string; answer: string };

export type Listing = {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  category_id: string | null;
  subcategory_id: string | null;
  tags: string[];
  images: string[];
  starting_price: number;
  delivery_days: number;
  revisions: number;
  requirements: string;
  faq: FaqItem[];
  status: ListingStatus;
  views: number;
  clicks: number;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
};

export type PackageTier = "basic" | "standard" | "premium";

export type ListingPackage = {
  id: string;
  listing_id: string;
  tier: PackageTier;
  name: string;
  description: string;
  price: number;
  delivery_days: number;
  revisions: number;
  features: string[];
};

export type OrderStatus =
  | "pending"
  | "accepted"
  | "in_progress"
  | "delivered"
  | "revision_requested"
  | "completed"
  | "cancelled";

export type Order = {
  id: string;
  listing_id: string;
  package_id: string | null;
  buyer_id: string;
  seller_id: string;
  price: number;
  status: OrderStatus;
  requirements: string;
  delivery_deadline: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderFile = {
  id: string;
  order_id: string;
  uploader_id: string;
  file_url: string;
  file_type: "requirement" | "delivery";
  created_at: string;
};

export type Conversation = {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string | null;
  last_message_at: string;
  created_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  file_url: string | null;
  read_at: string | null;
  created_at: string;
};

export type Review = {
  id: string;
  order_id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type Favorite = {
  user_id: string;
  listing_id: string;
  created_at: string;
};

export type NotificationType =
  | "new_order"
  | "order_status_changed"
  | "new_message";

export type AppNotification = {
  id: string;
  user_id: string;
  type: NotificationType;
  payload: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
};
