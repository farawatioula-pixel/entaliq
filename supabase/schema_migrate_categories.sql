-- Run this ONCE in your live Supabase project's SQL Editor to move existing
-- profiles off the old SELL / CREATE / BUILD categories onto the new
-- Fiverr-style categories. Safe to run even if some profiles are empty.

-- 1. Drop the old constraint so we can update existing rows freely.
alter table public.profiles drop constraint if exists profiles_category_check;

-- 2. Remap existing values to their closest new category.
--    Adjust these mappings first if you disagree with the defaults below.
update public.profiles set category = 'ecommerce' where category = 'SELL';
update public.profiles set category = 'writing-translation' where category = 'CREATE';
update public.profiles set category = 'ai-services' where category = 'BUILD';

-- 3. Add the new constraint and default.
alter table public.profiles alter column category set default 'graphics-design';
alter table public.profiles add constraint profiles_category_check check (category in (
  'graphics-design', 'programming-tech', 'digital-marketing',
  'writing-translation', 'video-animation', 'ai-services',
  'business-consulting', 'ecommerce'
));
