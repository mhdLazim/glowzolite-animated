import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { reviewSchema } from "./reviews";
import { z } from "zod";

export const listReviews = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: reviewSchema.shape.productSlug }).parse(input))
  .handler(async ({ data }) => {
    const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
    const url = process.env['SUPABASE_URL'];
    if (!key || !url) return { reviews: [], unavailable: true };
    const client = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
        headers.set('apikey', key);
        return fetch(input, { ...init, headers });
      } },
    });
    const result = await client.from('product_reviews').select('id, display_name, rating, title, body, created_at').eq('product_slug', data.slug).eq('status', 'approved').order('created_at', { ascending: false }).limit(100);
    return { reviews: result.data ?? [], unavailable: !!result.error };
  });

export const submitReview = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => reviewSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
    const url = process.env['SUPABASE_URL'];
    if (!key || !url) return { success: false };
    const client = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
        headers.set('apikey', key);
        return fetch(input, { ...init, headers });
      } },
    });
    const { error } = await client.from('product_reviews').insert({ product_slug: data.productSlug, display_name: data.displayName, rating: data.rating, title: data.title, body: data.body });
    return { success: !error };
  });