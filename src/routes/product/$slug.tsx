import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Leaf, Sparkles, ShoppingBag, Check } from "lucide-react";
import { reviewsQuery } from "@/lib/reviews-query";
import { ProductReviews } from "@/components/ProductReviews";
import { reviewSchema } from "@/lib/reviews";
import { Header, Footer, products, meta } from "@/components/site";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params, context }) => {
    const product = products.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    await context.queryClient.ensureQueryData(reviewsQuery(reviewSchema.shape.productSlug.parse(product.slug)));
    return product;
  },
  head: ({ loaderData }) =>
    meta(
      loaderData ? `${loaderData.name} — Glowzo` : "Product — Glowzo",
      loaderData ? `${loaderData.line} ${loaderData.name} (${loaderData.size}) — ₹${loaderData.price}. ${loaderData.description}` : "Glowzo product"
    ),
  component: ProductPage,
  notFoundComponent: () => (
    <main className="min-h-screen bg-background font-sans text-foreground">
      <Header />
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="font-display text-4xl">Product not found</h1>
        <Link to="/shop" className="mt-6 inline-block rounded-full border border-accent px-6 py-3 text-xs uppercase tracking-widest text-accent hover:bg-accent hover:text-accent-foreground">
          Back to Shop
        </Link>
      </section>
      <Footer />
    </main>
  ),
});

function ProductPage() {
  const p = Route.useLoaderData();
  const { add } = useCart();

  return (
    <main className="min-h-screen bg-background font-sans text-foreground">
      <Header />
      <section className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 md:px-10">
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent">
          <ArrowLeft className="h-4 w-4" /> Back to Shop
        </Link>

        <div className="mt-8 grid items-start gap-10 md:grid-cols-2 md:gap-16">
          <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-t-full bg-gradient-to-b from-muted to-card p-10 sm:aspect-[3/4]">
            <img src={p.img} srcSet={`${p.smallImg} 360w, ${p.img} 700w`} sizes="(min-width: 768px) 450px, 300px" alt={`${p.line} ${p.name}`} width={700} height={700} fetchPriority="high" decoding="async" className="h-[80%] w-full object-contain drop-shadow-2xl" />
          </div>

          <div className="md:pt-8">
            <p className="text-xs uppercase tracking-widest text-accent">{p.line}</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">{p.name}</h1>
            <div className="mt-4 flex items-baseline gap-4">
              <span className="text-2xl">₹{p.price}</span>
              <span className="text-sm text-muted-foreground">{p.size}</span>
            </div>

            <p className="mt-6 leading-relaxed text-muted-foreground">{p.description}</p>

            <div className="mt-8 space-y-5 border-t border-border pt-8">
              <p className="flex gap-3 text-sm text-muted-foreground">
                <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span><span className="text-foreground">Key ingredients:</span> {p.ingredients}</span>
              </p>
              <p className="flex gap-3 text-sm text-muted-foreground">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span><span className="text-foreground">{p.slug === "hair-growth-serum" ? "Formula:" : "How to use:"}</span> {p.use}</span>
              </p>
            </div>

            <Button onClick={() => add(p.slug)} variant="outline" className="mt-10 h-12 w-full rounded-full border-accent px-8 text-xs uppercase text-accent hover:bg-accent hover:text-accent-foreground sm:w-auto">
              <ShoppingBag className="h-4 w-4" /> Add to cart
            </Button>
            <ul className="mt-6 space-y-2 text-xs text-muted-foreground">{p.highlights.map(highlight => <li key={highlight} className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent" />{highlight}</li>)}</ul>
          </div>
        </div>
        <section aria-labelledby="product-benefits" className="mt-16 grid gap-8 border-t border-border py-12 md:grid-cols-[1fr_2fr]">
          <div><p className="text-xs uppercase tracking-widest text-accent">Daily care</p><h2 id="product-benefits" className="mt-3 font-display text-3xl sm:text-4xl">Benefits</h2></div>
          <div className="grid gap-6 sm:grid-cols-3">{p.benefits.map((benefit, i) => <div key={benefit}><span className="font-display text-3xl text-accent">0{i + 1}</span><h3 className="mt-3 text-base leading-relaxed">{benefit}</h3></div>)}<p className="text-xs text-muted-foreground sm:col-span-3">Individual results vary.</p></div>
        </section>
        <section aria-labelledby="product-ingredients" className="grid gap-8 border-t border-border py-12 md:grid-cols-[1fr_2fr]">
          <div><p className="text-xs uppercase tracking-widest text-accent">The blend</p><h2 id="product-ingredients" className="mt-3 font-display text-3xl sm:text-4xl">Ingredients</h2></div>
          <ul className="grid gap-x-8 sm:grid-cols-2">{p.ingredients.split(", ").map(ingredient => <li key={ingredient} className="flex items-center gap-3 border-b border-border py-4 text-sm"><Leaf className="h-4 w-4 shrink-0 text-accent" />{ingredient}</li>)}</ul>
        </section>
        <section aria-labelledby="product-ritual" className="grid gap-8 border-t border-border py-12 md:grid-cols-[1fr_2fr]">
          <div><p className="text-xs uppercase tracking-widest text-accent">Your ritual</p><h2 id="product-ritual" className="mt-3 font-display text-3xl sm:text-4xl">How to use</h2></div>
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground"><p>{p.slug === "hair-growth-serum" ? "Follow the application directions on your bottle’s label." : p.use}</p><p>Patch test before first use. Avoid contact with eyes and stop using if irritation occurs.</p></div>
        </section>
        <ProductReviews key={p.slug} slug={reviewSchema.shape.productSlug.parse(p.slug)} />
      </section>
      <Footer />
    </main>
  );
}
