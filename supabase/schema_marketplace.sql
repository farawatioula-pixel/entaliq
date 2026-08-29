-- ============================================================================
-- INTALEQ MARKETPLACE SCHEMA (Phase 1)
-- Run this in Supabase SQL Editor AFTER schema.sql.
-- Adds Fiverr-style marketplace tables on top of the existing `profiles`
-- table. Does not modify or drop anything that already exists.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- CATEGORIES (self-referencing for category -> subcategory)
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  parent_id uuid references public.categories(id) on delete set null,
  icon text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Categories are publicly readable"
  on public.categories for select
  using (true);

-- ---------------------------------------------------------------------------
-- LISTINGS
-- ---------------------------------------------------------------------------
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null default '',
  category_id uuid references public.categories(id) on delete set null,
  subcategory_id uuid references public.categories(id) on delete set null,
  tags text[] not null default '{}',
  images jsonb not null default '[]'::jsonb,
  starting_price numeric(10,2) not null default 0,
  delivery_days int not null default 1,
  revisions int not null default 1,
  requirements text not null default '',
  faq jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'unpublished')),
  views int not null default 0,
  clicks int not null default 0,
  rating numeric(3,2) not null default 0,
  review_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_seller_id_idx on public.listings(seller_id);
create index if not exists listings_status_idx on public.listings(status);
create index if not exists listings_category_id_idx on public.listings(category_id);

alter table public.listings enable row level security;

create policy "Published listings are publicly readable"
  on public.listings for select
  using (status = 'published' or auth.uid() = seller_id);

create policy "Sellers can insert their own listings"
  on public.listings for insert
  with check (auth.uid() = seller_id);

create policy "Sellers can update their own listings"
  on public.listings for update
  using (auth.uid() = seller_id);

create policy "Sellers can delete their own listings"
  on public.listings for delete
  using (auth.uid() = seller_id);

-- ---------------------------------------------------------------------------
-- LISTING PACKAGES (Basic / Standard / Premium tiers)
-- ---------------------------------------------------------------------------
create table if not exists public.listing_packages (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  tier text not null check (tier in ('basic', 'standard', 'premium')),
  name text not null default '',
  description text not null default '',
  price numeric(10,2) not null default 0,
  delivery_days int not null default 1,
  revisions int not null default 1,
  features jsonb not null default '[]'::jsonb,
  unique (listing_id, tier)
);

alter table public.listing_packages enable row level security;

create policy "Packages readable when listing is readable"
  on public.listing_packages for select
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (l.status = 'published' or l.seller_id = auth.uid())
    )
  );

create policy "Sellers manage packages on their own listings"
  on public.listing_packages for all
  using (
    exists (select 1 from public.listings l where l.id = listing_id and l.seller_id = auth.uid())
  )
  with check (
    exists (select 1 from public.listings l where l.id = listing_id and l.seller_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- ORDERS
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete restrict,
  package_id uuid references public.listing_packages(id) on delete set null,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  price numeric(10,2) not null,
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'in_progress', 'delivered', 'revision_requested', 'completed', 'cancelled')
  ),
  requirements text not null default '',
  delivery_deadline timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_buyer_id_idx on public.orders(buyer_id);
create index if not exists orders_seller_id_idx on public.orders(seller_id);
create index if not exists orders_listing_id_idx on public.orders(listing_id);

alter table public.orders enable row level security;

create policy "Buyers and sellers can read their own orders"
  on public.orders for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Buyers can create orders"
  on public.orders for insert
  with check (auth.uid() = buyer_id);

create policy "Buyers and sellers can update their own orders"
  on public.orders for update
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

-- ---------------------------------------------------------------------------
-- ORDER FILES (requirement uploads + delivered work)
-- ---------------------------------------------------------------------------
create table if not exists public.order_files (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  uploader_id uuid not null references public.profiles(id) on delete cascade,
  file_url text not null,
  file_type text not null default 'requirement' check (file_type in ('requirement', 'delivery')),
  created_at timestamptz not null default now()
);

alter table public.order_files enable row level security;

create policy "Order participants can read order files"
  on public.order_files for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.buyer_id = auth.uid() or o.seller_id = auth.uid())
    )
  );

create policy "Order participants can upload order files"
  on public.order_files for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.buyer_id = auth.uid() or o.seller_id = auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- CONVERSATIONS + MESSAGES
-- ---------------------------------------------------------------------------
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete set null,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (buyer_id, seller_id, listing_id)
);

alter table public.conversations enable row level security;

create policy "Participants can read their conversations"
  on public.conversations for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Participants can create conversations"
  on public.conversations for insert
  with check (auth.uid() = buyer_id or auth.uid() = seller_id);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null default '',
  file_url text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_id_idx on public.messages(conversation_id);

alter table public.messages enable row level security;

create policy "Participants can read messages in their conversations"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );

create policy "Participants can send messages in their conversations"
  on public.messages for insert
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- REVIEWS
-- ---------------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text not null default '',
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "Reviews are publicly readable"
  on public.reviews for select
  using (true);

-- A buyer may only review an order that is completed and belongs to them,
-- and only once (enforced by the unique constraint on order_id).
create policy "Buyers can review their own completed orders"
  on public.reviews for insert
  with check (
    auth.uid() = buyer_id and
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.buyer_id = auth.uid() and o.status = 'completed'
    )
  );

-- Keep listing.rating / listing.review_count and profile aggregates in sync.
create or replace function public.handle_new_review()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.listings
  set review_count = review_count + 1,
      rating = (
        select coalesce(avg(rating), 0) from public.reviews where listing_id = new.listing_id
      )
  where id = new.listing_id;
  return new;
end;
$$;

drop trigger if exists on_review_created on public.reviews;
create trigger on_review_created
  after insert on public.reviews
  for each row execute function public.handle_new_review();

-- ---------------------------------------------------------------------------
-- FAVORITES
-- ---------------------------------------------------------------------------
create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

alter table public.favorites enable row level security;

create policy "Users manage their own favorites"
  on public.favorites for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- NOTIFICATIONS
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_idx on public.notifications(user_id);

alter table public.notifications enable row level security;

create policy "Users can read their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update (mark read) their own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

-- Notifications are inserted by trigger functions (security definer) below,
-- not directly by clients, so there is intentionally no client-side insert policy.

-- ---------------------------------------------------------------------------
-- TRIGGERS: notify on order status changes and new messages
-- ---------------------------------------------------------------------------
create or replace function public.handle_order_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.notifications (user_id, type, payload)
    values (new.seller_id, 'new_order', jsonb_build_object('order_id', new.id, 'listing_id', new.listing_id));
  elsif tg_op = 'UPDATE' and new.status is distinct from old.status then
    insert into public.notifications (user_id, type, payload)
    values (
      case when auth.uid() = new.seller_id then new.buyer_id else new.seller_id end,
      'order_status_changed',
      jsonb_build_object('order_id', new.id, 'status', new.status)
    );
  end if;
  return new;
end;
$$;

drop trigger if exists on_order_change on public.orders;
create trigger on_order_change
  after insert or update on public.orders
  for each row execute function public.handle_order_change();

create or replace function public.handle_new_message()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  recipient uuid;
begin
  select case when buyer_id = new.sender_id then seller_id else buyer_id end
  into recipient
  from public.conversations where id = new.conversation_id;

  insert into public.notifications (user_id, type, payload)
  values (recipient, 'new_message', jsonb_build_object('conversation_id', new.conversation_id));

  update public.conversations set last_message_at = now() where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists on_message_created on public.messages;
create trigger on_message_created
  after insert on public.messages
  for each row execute function public.handle_new_message();

-- ---------------------------------------------------------------------------
-- SEED CATEGORIES (matches the SELL / CREATE / BUILD tracks already used
-- on profiles, broken into Fiverr-style subcategories)
-- ---------------------------------------------------------------------------
insert into public.categories (name, slug, icon, sort_order) values
  ('Sell', 'sell', 'shopping-bag', 1),
  ('Create', 'create', 'palette', 2),
  ('Build', 'build', 'code', 3)
on conflict (slug) do nothing;

insert into public.categories (name, slug, parent_id, sort_order)
select sub.name, sub.slug, c.id, sub.sort_order
from (values
  ('Copywriting', 'copywriting', 'sell', 1),
  ('Social Media Management', 'social-media-management', 'sell', 2),
  ('Translation', 'translation', 'sell', 3),
  ('Graphic Design', 'graphic-design', 'create', 1),
  ('Video Editing', 'video-editing', 'create', 2),
  ('Photography', 'photography', 'create', 3),
  ('3D Modeling', '3d-modeling', 'create', 4),
  ('Web Development', 'web-development', 'build', 1),
  ('UI/UX Design', 'ui-ux-design', 'build', 2),
  ('Mobile Apps', 'mobile-apps', 'build', 3)
) as sub(name, slug, parent_slug, sort_order)
join public.categories c on c.slug = sub.parent_slug
on conflict (slug) do nothing;
