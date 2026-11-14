ALTER TABLE public.beauty_posts ADD COLUMN title text NOT NULL DEFAULT '', ADD COLUMN destination text NOT NULL DEFAULT 'Feed', ADD COLUMN product_ids text[] NOT NULL DEFAULT '{}', ADD COLUMN specialist_ids text[] NOT NULL DEFAULT '{}', ADD COLUMN people_tags jsonb NOT NULL DEFAULT '[]', ADD COLUMN service_credit text NOT NULL DEFAULT '';
ALTER TABLE public.beauty_posts DROP CONSTRAINT beauty_posts_media_type_check;
ALTER TABLE public.beauty_posts ADD CONSTRAINT beauty_posts_media_type_check CHECK (media_type IN ('image','video','text')), ADD CONSTRAINT beauty_posts_destination_check CHECK (destination IN ('Feed','Learn')), ADD CONSTRAINT beauty_posts_title_length CHECK (char_length(title) <= 120), ADD CONSTRAINT beauty_posts_credit_length CHECK (char_length(service_credit) <= 120);
UPDATE public.beauty_posts SET destination='Learn' WHERE kind='Tutorial';
GRANT SELECT ON public.beauty_posts TO anon, authenticated;
GRANT INSERT, DELETE ON public.beauty_posts TO authenticated;
GRANT ALL ON public.beauty_posts TO service_role;