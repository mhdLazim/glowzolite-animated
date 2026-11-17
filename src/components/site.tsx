import { Link } from "@tanstack/react-router";
import { ShoppingBag, Phone, Mail, MapPin, Leaf } from "lucide-react";
import type * as React from "react";
import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { BRAND, WHATSAPP, products, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
export { BRAND, WHATSAPP, products, type Product } from "@/lib/products";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { items, openCart } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:px-6 md:px-10">
      <Link to="/" className="shrink-0 font-display text-xl tracking-[0.2em] sm:text-2xl">{BRAND}</Link>
      <nav className="flex min-w-0 gap-4 text-[10px] uppercase tracking-widest sm:gap-8 sm:text-xs">
        {nav.map((n) => (
          <Link key={n.to} to={n.to} activeOptions={{ exact: true }} className="pb-1 transition-colors hover:text-accent" activeProps={{ className: "border-b border-accent text-accent" }}>
            {n.label}
          </Link>
        ))}
      </nav>
      <Button variant="outline" size="icon" onClick={openCart} aria-label={`Open cart (${count} items)`} className="relative shrink-0 rounded-full">
        <ShoppingBag className="h-4 w-4" />
        {count > 0 && <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] text-accent-foreground">{count}</span>}
      </Button>
    </header>
  );
}

export function ProductCard({ p, index = 0, imageRef, hideImage = false }: { p: Product; index?: number; imageRef?: React.Ref<HTMLAnchorElement>; hideImage?: boolean }) {
  const { add } = useCart();
  const cardRef = useRef<HTMLElement | null>(null);
  // Observe the stationary card, not the image displaced above its clipped frame.
  const entered = useInView(cardRef, { once: true, amount: 0.15 });
  const reduce = useReducedMotion();
  const landed = { y: 0, rotate: 0, opacity: 1 };
  return (
    <motion.article ref={cardRef} data-product-card={p.slug} initial={{ opacity: reduce ? 1 : 0 }} animate={{ opacity: entered || reduce ? 1 : 0 }} transition={{ duration: reduce ? 0 : 0.5 }} className="group flex flex-col">
      <Link ref={imageRef} to="/product/$slug" params={{ slug: p.slug }} className="relative flex aspect-[3/4] items-end justify-center overflow-hidden rounded-t-full bg-gradient-to-b from-muted to-card px-10 pb-10">
        <motion.img style={{ visibility: hideImage ? "hidden" : "visible" }} initial={reduce ? landed : { y: -240, rotate: index % 2 === 0 ? -8 : 8, opacity: 0 }} animate={entered || reduce ? landed : false} transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 32, mass: 0.35, delay: (index % 3) * 0.15 }} src={p.img} srcSet={`${p.smallImg} 360w, ${p.img} 700w`} sizes="(min-width: 768px) 260px, 300px" alt={`${p.line} ${p.name}`} loading="lazy" decoding="async" width={700} height={700} className="max-h-[80%] w-auto object-contain drop-shadow-2xl" />
      </Link>
      <p className="mt-5 text-xs uppercase tracking-widest text-accent">{p.line}</p>
      <div className="mt-1 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-2xl">
          <Link to="/product/$slug" params={{ slug: p.slug }} className="transition-colors hover:text-accent">{p.name}</Link>
        </h3>
        <span className="whitespace-nowrap text-lg">₹{p.price}</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{p.size}</p>
      <p className="mt-4 flex gap-2 text-sm text-muted-foreground"><Leaf className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{p.ingredients}</p>
      <p className="mt-2 text-sm text-muted-foreground/80">{p.use}</p>
      <Button variant="outline" onClick={() => add(p.slug)} className="mt-6 h-12 rounded-full border-accent text-xs uppercase text-accent hover:bg-accent hover:text-accent-foreground">
        <ShoppingBag /> Add to cart
      </Button>
    </motion.article>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:grid-cols-2 md:grid-cols-4 md:px-10">
        <div>
          <p className="font-display text-2xl tracking-[0.2em]">{BRAND}</p>
          <p className="mt-4 text-sm text-muted-foreground">Ayurvedic skin and hair care, rooted in tradition.</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-accent">Shop</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {products.map((p) => <li key={p.name}><Link to="/product/$slug" params={{ slug: p.slug }} className="hover:text-foreground">{p.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-accent">Help</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/contact" className="hover:text-foreground">Contact Us</Link></li>
            <li><Link to="/returns" className="hover:text-foreground">Return & Refund Policy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms & Conditions</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-accent">Contact</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><Phone className="h-4 w-4 text-accent" /><a href={`https://wa.me/${WHATSAPP}`} className="hover:text-foreground">+91 80759 81789</a></li>
            <li className="flex gap-2"><Mail className="h-4 w-4 text-accent" />glowzolite@gmail.com</li>
            <li className="flex gap-2"><MapPin className="h-4 w-4 text-accent" />India</li>
          </ul>
        </div>
      </div>
      <p className="border-t border-border py-6 text-center text-xs uppercase tracking-widest text-muted-foreground">
        © {new Date().getFullYear()} {BRAND}. All rights reserved.
      </p>
    </footer>
  );
}

export function Page({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background font-sans text-foreground">
      <Header />
      <section className="mx-auto max-w-4xl px-6 pb-24 pt-12 md:px-10">
        <p className="text-xs uppercase tracking-widest text-accent">{eyebrow}</p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">{title}</h1>
        <div className="mt-10 space-y-6 text-muted-foreground [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-foreground">{children}</div>
      </section>
      <Footer />
    </main>
  );
}

export function meta(title: string, description: string) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
