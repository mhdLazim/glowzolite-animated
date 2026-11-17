import { createFileRoute } from "@tanstack/react-router";
import combo from "@/assets/glowzo-lite-combo.jpg.asset.json";
import { Footer, Header, ProductCard, products, meta } from "@/components/site";

export const Route = createFileRoute("/shop")({
  head: () => meta("Shop — Glowzo", "Shop Glowzo Ayurvedic brightening oil, hair growth serum and skin brightening pack."),
  component: Shop,
});

function Shop() {
  return (
    <main className="min-h-screen bg-background font-sans text-foreground">
      <Header />
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-12 md:px-10">
        <p className="text-xs uppercase tracking-widest text-accent">Shop</p>
        <h1 className="mb-4 mt-3 font-display text-5xl md:text-6xl">All Products</h1>
        <figure className="mx-auto mb-16 max-w-3xl overflow-hidden rounded-3xl border border-border shadow-2xl"><img src={combo.url} alt="Glowzo Lite Brightening Oil and Skin Brightening Pack together for ₹879, with benefits and key ingredients" width={1254} height={1254} className="h-auto w-full" /></figure>
        <div className="grid gap-10 md:grid-cols-3">
          {products.map((p, i) => <ProductCard key={p.name} p={p} index={i} />)}
        </div>
      </section>
      <Footer />
    </main>
  );
}
