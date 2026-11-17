import { z } from "zod";

export const reviewSchema = z.object({
  productSlug: z.enum(["brightening-oil", "hair-growth-serum", "skin-brightening-pack"]),
  displayName: z.string().trim().min(2).max(60),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().min(3).max(100),
  body: z.string().trim().min(10).max(2000),
});
export type ReviewInput = z.infer<typeof reviewSchema>;