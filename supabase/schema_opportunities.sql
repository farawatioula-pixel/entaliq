-- Buyer requests ("أحتاج خدمة" / RFP).
-- A buyer posts one opportunity; every freelancer with a published listing in
-- that category (or that category on their profile) receives it as a request
-- card + message in a Mountaliq chat with the buyer, and a bell notification.
-- Emails are sent by the API route afterwards.

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 120),
  description text not null check (char_length(description) between 10 and 4000),
  category_id uuid references public.categories(id) on delete set null,
  budget text,
  deadline text,
  status text not null default 'open' check (status in ('open', 'closed')),
  matched_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists opportunities_status_created_idx on public.opportunities (status, created_at desc);
create index if not exists opportunities_buyer_idx on public.opportunities (buyer_id);

alter table public.opportunities enable row level security;

drop policy if exists "Signed-in users can read open opportunities" on public.opportunities;
create policy "Signed-in users can read open opportunities" on public.opportunities
  for select to authenticated
  using (status = 'open' or buyer_id = (select auth.uid()));

drop policy if exists "Buyers can close their opportunities" on public.opportunities;
create policy "Buyers can close their opportunities" on public.opportunities
  for update to authenticated
  using (buyer_id = (select auth.uid()))
  with check (buyer_id = (select auth.uid()));

alter table public.requests add column if not exists opportunity_id uuid references public.opportunities(id) on delete set null;

-- Post an opportunity and fan it out. Runs as the table owner so it can create
-- the notification rows; every row it writes is on behalf of auth.uid().
create or replace function public.post_opportunity(
  p_title text,
  p_description text,
  p_category_slug text,
  p_budget text,
  p_deadline text,
  p_max_recipients integer default 40
)
returns table (opportunity_id uuid, seller_id uuid, conversation_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_buyer uuid := auth.uid();
  v_cat uuid;
  v_opp uuid;
  v_conv uuid;
  v_body text;
  r record;
  n integer := 0;
begin
  if v_buyer is null then
    raise exception 'not signed in';
  end if;

  -- At most 5 requests per buyer per day.
  if (select count(*) from opportunities o where o.buyer_id = v_buyer and o.created_at > now() - interval '1 day') >= 5 then
    raise exception 'daily limit reached';
  end if;

  select c.id into v_cat from categories c where c.slug = p_category_slug and c.parent_id is null;

  insert into opportunities (buyer_id, title, description, category_id, budget, deadline)
  values (v_buyer, trim(p_title), trim(p_description), v_cat, nullif(trim(p_budget), ''), nullif(trim(p_deadline), ''))
  returning id into v_opp;

  v_body := '📣 ' || trim(p_title) || E'\n\n' || trim(p_description)
    || coalesce(E'\n\n💰 ' || nullif(trim(p_budget), ''), '')
    || coalesce(E'\n⏱ ' || nullif(trim(p_deadline), ''), '');

  for r in
    select s.seller, (
      select l.id from listings l
      where l.seller_id = s.seller and l.status = 'published' and (v_cat is null or l.category_id = v_cat)
      order by l.rating desc nulls last, l.created_at desc limit 1
    ) as listing
    from (
      select distinct l.seller_id as seller from listings l
      where l.status = 'published' and (v_cat is null or l.category_id = v_cat)
      union
      select p.id from profiles p where p_category_slug is not null and p.category = p_category_slug
    ) s
    where s.seller <> v_buyer
    limit greatest(1, least(p_max_recipients, 60))
  loop
    select c.id into v_conv from conversations c
      where c.buyer_id = v_buyer and c.seller_id = r.seller
        and c.listing_id is not distinct from r.listing
      limit 1;
    if v_conv is null then
      insert into conversations (buyer_id, seller_id, listing_id)
      values (v_buyer, r.seller, r.listing) returning id into v_conv;
    end if;

    insert into requests (conversation_id, buyer_id, seller_id, listing_id, description, images, desired_delivery, opportunity_id)
    values (v_conv, v_buyer, r.seller, r.listing, trim(p_title) || E'\n\n' || trim(p_description), '{}', nullif(trim(p_deadline), ''), v_opp);

    insert into messages (conversation_id, sender_id, content) values (v_conv, v_buyer, v_body);

    -- The message trigger just added a 'new_message' bell item; label it as a new opportunity instead.
    update notifications nt
      set type = 'new_opportunity',
          payload = jsonb_build_object('conversation_id', v_conv, 'opportunity_id', v_opp, 'title', trim(p_title))
      where nt.user_id = r.seller and nt.type = 'new_message' and nt.read_at is null
        and nt.payload->>'conversation_id' = v_conv::text and nt.created_at = now();

    n := n + 1;
    opportunity_id := v_opp; seller_id := r.seller; conversation_id := v_conv;
    return next;
    v_conv := null;
  end loop;

  update opportunities set matched_count = n where id = v_opp;

  if n = 0 then
    opportunity_id := v_opp; seller_id := null; conversation_id := null;
    return next;
  end if;
end;
$$;

revoke all on function public.post_opportunity(text, text, text, text, text, integer) from public, anon;
grant execute on function public.post_opportunity(text, text, text, text, text, integer) to authenticated;
