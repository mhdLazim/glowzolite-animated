import { describe, expect, it } from "vitest";
import { reviewSchema } from "@/lib/reviews";

const valid = { productSlug: "hair-growth-serum", displayName: "Shopper", rating: 4, title: "My experience", body: "Sharing my experience using the serum." };
describe("Customer review validation", () => {
  it("accepts a genuine customer submission", () => expect(reviewSchema.safeParse(valid).success).toBe(true));
  it("rejects ratings outside the five-star scale", () => {
    expect(reviewSchema.safeParse({ ...valid, rating: 0 }).success).toBe(false);
    expect(reviewSchema.safeParse({ ...valid, rating: 6 }).success).toBe(false);
  });
  it("rejects products outside the catalog", () => expect(reviewSchema.safeParse({ ...valid, productSlug: "unknown" }).success).toBe(false));
  it("does not accept shopper-controlled publication status", () => expect(reviewSchema.parse({ ...valid, status: "approved" })).not.toHaveProperty("status"));
});