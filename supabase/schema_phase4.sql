-- ============================================================================
-- PHASE 4 ADDENDUM
-- Run this after schema_marketplace.sql. Adds the missing policy that lets
-- conversation participants mark messages as read.
-- ============================================================================

create policy "Participants can mark messages as read"
  on public.messages for update
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );
