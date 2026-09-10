-- Run this ONCE in your Supabase SQL Editor to fix the marketplace
-- categories table on your LIVE project. It was originally seeded with
-- Sell / Create / Build categories (from schema_marketplace.sql); this
-- replaces them with the 8 real Fiverr-style categories used everywhere
-- else on the site, and removes the old rows.
-- Safe to re-run.

-- 1. Upsert the 8 real top-level categories.
insert into public.categories (name, slug, icon, sort_order) values
  ('Graphics & Design', 'graphics-design', 'palette', 1),
  ('Programming & Tech', 'programming-tech', 'code', 2),
  ('Digital Marketing', 'digital-marketing', 'megaphone', 3),
  ('Writing & Translation', 'writing-translation', 'pen', 4),
  ('Video & Animation', 'video-animation', 'video', 5),
  ('AI Services', 'ai-services', 'sparkles', 6),
  ('Business & Consulting', 'business-consulting', 'briefcase', 7),
  ('E-commerce', 'ecommerce', 'shopping-bag', 8)
on conflict (slug) do update set name = excluded.name, sort_order = excluded.sort_order;

-- 2. Upsert their subcategories. Two old slugs ('translation',
--    'video-editing') get repointed to their new parent here automatically.
insert into public.categories (name, slug, parent_id, sort_order)
select v.name, v.slug, p.id, v.sort_order
from (values
  ('Logo Design', 'logo-design', 'graphics-design', 1),
  ('Social Media Graphics', 'social-media-graphics', 'graphics-design', 2),
  ('Illustration', 'illustration', 'graphics-design', 3),
  ('Website Development', 'website-development', 'programming-tech', 1),
  ('App Development', 'app-development', 'programming-tech', 2),
  ('Automation & No-Code', 'automation-no-code', 'programming-tech', 3),
  ('Social Media Marketing', 'social-media-marketing', 'digital-marketing', 1),
  ('SEO', 'seo', 'digital-marketing', 2),
  ('Affiliate Marketing', 'affiliate-marketing', 'digital-marketing', 3),
  ('Content Writing', 'content-writing', 'writing-translation', 1),
  ('Translation', 'translation', 'writing-translation', 2),
  ('Proofreading & Editing', 'proofreading-editing', 'writing-translation', 3),
  ('Video Editing', 'video-editing', 'video-animation', 1),
  ('Short-Form Video', 'short-form-video', 'video-animation', 2),
  ('Motion Graphics', 'motion-graphics', 'video-animation', 3),
  ('AI Automation', 'ai-automation', 'ai-services', 1),
  ('AI Content Generation', 'ai-content-generation', 'ai-services', 2),
  ('AI Chat Support Setup', 'ai-chat-support', 'ai-services', 3),
  ('Virtual Assistance', 'virtual-assistance', 'business-consulting', 1),
  ('Business Planning', 'business-planning', 'business-consulting', 2),
  ('Online Store Setup', 'online-store-setup', 'ecommerce', 1),
  ('Dropshipping', 'dropshipping', 'ecommerce', 2)
) as v(name, slug, parent_slug, sort_order)
join public.categories p on p.slug = v.parent_slug
on conflict (slug) do update set name = excluded.name, parent_id = excluded.parent_id, sort_order = excluded.sort_order;

-- 3. Remove the old top-level Sell / Create / Build categories. Any listing
--    still pointing at them falls back to no category (category_id is
--    "on delete set null"), so re-assign affected listings afterward if needed.
delete from public.categories where slug in ('sell', 'create', 'build');

-- 4. Remove the old subcategories that have no equivalent in the new list.
--    ('translation' and 'video-editing' are NOT here, they were repointed above.)
delete from public.categories where slug in (
  'copywriting', 'social-media-management', 'graphic-design',
  'photography', '3d-modeling', 'web-development', 'ui-ux-design', 'mobile-apps'
);
