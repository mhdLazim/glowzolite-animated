import { queryOptions } from "@tanstack/react-query";
import { listReviews } from "./reviews.functions";
import type { ReviewInput } from "./reviews";

export const reviewsQuery = (slug: ReviewInput["productSlug"]) => queryOptions({
  queryKey: ["product-reviews", slug],
  queryFn: () => listReviews({ data: { slug } }),
});