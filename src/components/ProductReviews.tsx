import { useState, type FormEvent } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { reviewSchema, type ReviewInput } from "@/lib/reviews";
import { reviewsQuery } from "@/lib/reviews-query";
import { submitReview } from "@/lib/reviews.functions";

export function ProductReviews({ slug }: { slug: ReviewInput["productSlug"] }) {
  const { data } = useSuspenseQuery(reviewsQuery(slug));
  const submit = useServerFn(submitReview);
  const [rating, setRating] = useState(0);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const parsed = reviewSchema.safeParse({ productSlug: slug, rating, displayName: values.get('name'), title: values.get('title'), body: values.get('body') });
    if (!parsed.success) { setMessage("Choose a rating and complete all fields; your review needs at least 10 characters."); return; }
    setBusy(true); setMessage("");
    try {
      const result = await submit({ data: parsed.data });
      if (!result.success) { setMessage("Your review couldn’t be saved. Please try again."); return; }
      setSent(true); form.reset();
    } catch { setMessage("Your review couldn’t be saved. Please try again."); }
    finally { setBusy(false); }
  }
  return <section aria-labelledby="customer-reviews" className="border-t border-border py-12 sm:py-16">
    <div className="flex flex-wrap items-center justify-between gap-5">
      <div><p className="text-xs uppercase tracking-widest text-accent">Your experience</p><h2 id="customer-reviews" className="mt-3 font-display text-3xl sm:text-4xl">Customer reviews</h2></div>
      <Button variant="outline" onClick={() => setOpen(!open)}><Star />{open ? "Close review form" : "Write a review"}</Button>
    </div>
    <div className="mt-8 grid gap-10 md:grid-cols-2">
      <div>
        {data.unavailable ? <p role="status" className="text-muted-foreground">Reviews are temporarily unavailable. Please try again later.</p> : data.reviews.length === 0 ? <p className="text-muted-foreground">No customer reviews yet.</p> : <div className="divide-y divide-border">{data.reviews.map(review => <article key={review.id} className="py-6 first:pt-0">
          <div className="flex items-center gap-1 text-accent" aria-label={`${review.rating} out of 5 stars`}>{[1,2,3,4,5].map(n => <Star key={n} className={`h-4 w-4 ${n <= review.rating ? "fill-accent" : "text-muted-foreground"}`} />)}</div>
          <h3 className="mt-3 font-medium">{review.title}</h3><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">{review.body}</p><p className="mt-4 text-xs text-muted-foreground">{review.display_name} · {review.created_at.slice(0,10)}</p>
        </article>)}</div>}
      </div>
      {open && (sent ? <p role="status" className="text-accent">Thank you. Your review has been saved and is awaiting moderation.</p> : <form onSubmit={onSubmit} className="space-y-5">
        <fieldset><legend className="mb-2 text-sm">Your rating</legend><div className="flex gap-2">{[1,2,3,4,5].map(n => <Button key={n} type="button" size="icon" variant="ghost" aria-label={`Rate ${n} out of 5`} aria-pressed={rating === n} onClick={() => setRating(n)}><Star className={n <= rating ? "fill-accent text-accent" : "text-muted-foreground"} /></Button>)}</div></fieldset>
        <label className="block space-y-2 text-sm"><span>Display name</span><Input name="name" required minLength={2} maxLength={60} autoComplete="nickname" /></label>
        <label className="block space-y-2 text-sm"><span>Review title</span><Input name="title" required minLength={3} maxLength={100} /></label>
        <label className="block space-y-2 text-sm"><span>Your experience</span><Textarea name="body" required minLength={10} maxLength={2000} rows={5} /></label>
        <p className="text-xs text-muted-foreground">Your name and review will be public after moderation. Please leave out personal contact details.</p>
        {message && <p role="alert" className="text-sm text-destructive">{message}</p>}
        <Button type="submit" disabled={busy}><Send />{busy ? "Submitting…" : "Submit review"}</Button>
      </form>)}
    </div>
  </section>;
}