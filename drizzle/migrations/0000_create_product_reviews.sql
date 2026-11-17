CREATE TABLE public.product_reviews (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 product_slug text NOT NULL CHECK (product_slug IN ('brightening-oil','hair-growth-serum','skin-brightening-pack')),
 display_name text NOT NULL CHECK (char_length(trim(display_name)) BETWEEN 2 AND 60),
 rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
 title text NOT NULL CHECK (char_length(trim(title)) BETWEEN 3 AND 100),
 body text NOT NULL CHECK (char_length(trim(body)) BETWEEN 10 AND 2000),
 status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.product_reviews TO anon, authenticated;
GRANT INSERT (product_slug,display_name,rating,title,body) ON public.product_reviews TO anon, authenticated;
GRANT ALL ON public.product_reviews TO service_role;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read approved customer reviews" ON public.product_reviews FOR SELECT TO anon, authenticated USING (status = 'approved');
CREATE POLICY "Submit customer reviews for moderation" ON public.product_reviews FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending');
CREATE INDEX product_reviews_public_idx ON public.product_reviews(product_slug, created_at DESC) WHERE status = 'approved';