import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, Sparkle, Play, Pause, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { useCallback, useRef, useState } from "react";
import { HeroBottleAnimation } from "@/components/HeroBottleAnimation";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import hero from "@/assets/hero-product-1600.webp.asset.json";
import heroSmall from "@/assets/hero-product-800.webp.asset.json";
import tree from "@/assets/hero-tree-clean-1600.webp.asset.json";
import treeSmall from "@/assets/hero-tree-clean-800.webp.asset.json";
import launch from "@/assets/launch.mp4.asset.json";
import skintone from "@/assets/skintone.mp4.asset.json";
import brighten from "@/assets/brighten.mp4.asset.json";
import combo from "@/assets/glowzo-lite-combo.jpg.asset.json";
import { BRAND, Footer, Header, ProductCard, products, meta } from "@/components/site";

export const Route = createFileRoute("/")({
   head: () => ({
     ...meta("Glowzo — Ayurvedic Skin & Hair Care", "Glowzo Lite brightening oil, hair growth serum and skin brightening pack, made with Ayurvedic herbs."),
     links: [{ rel: "preload", as: "image", href: hero.url, imageSrcSet: `${heroSmall.url} 800w, ${hero.url} 1200w`, imageSizes: "100vw", fetchPriority: "high" }],
   }),
  component: Index,
});

const videos = [
  { src: brighten.url, label: "Reduce fine lines" },
  { src: skintone.url, label: "Even skin tone" },
  { src: launch.url, label: "Now launching" },
];

function RitualVideo({ src, label, playing, videoRef, onToggle }: { src: string; label: string; playing: boolean; videoRef: (el: HTMLVideoElement | null) => void; onToggle: () => void }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border">
      <button type="button" onClick={onToggle} aria-label={playing ? `Pause ${label}` : `Play ${label}`} className="relative block w-full cursor-pointer">
        <video ref={videoRef} src={`${src}#t=0.1`} loop playsInline preload="metadata" className="aspect-[9/16] w-full object-cover" />
        <span className={`absolute inset-0 flex items-center justify-center bg-background/30 transition-opacity ${playing ? "opacity-0 hover:opacity-100" : "opacity-100"}`}>
          <span className="grid h-16 w-16 place-items-center rounded-full border border-border bg-background/70 backdrop-blur">
            {playing ? <Pause className="h-6 w-6 text-foreground" /> : <Play className="ml-1 h-6 w-6 text-foreground" />}
          </span>
        </span>
      </button>
      <p className="px-5 py-4 text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}

function Rituals() {
  const [active, setActive] = useState<number | null>(null);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  const toggle = (i: number) => {
    const v = refs.current[i];
    if (!v) return;
    if (active === i) {
      v.pause();
      setActive(null);
      return;
    }
    // Pause whichever video is currently playing so only one plays at a time.
    refs.current.forEach((el) => el?.pause());
    v.muted = false;
    v.play().catch(() => {});
    setActive(i);
  };

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {videos.map((v, i) => (
        <motion.div key={v.label} initial={{ opacity: 0, y: 60, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}>
        <RitualVideo
          key={v.label}
          src={v.src}
          label={v.label}
          playing={active === i}
          videoRef={(el) => { refs.current[i] = el; }}
          onToggle={() => toggle(i)}
        />
        </motion.div>
      ))}
    </div>
  );
}

const fadeUp = { initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.3 }, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const } };

const oilIngredients = products.find(p => p.slug === "brightening-oil")?.ingredients.split(", ") ?? [];

function ComboBuyButton() {
  const { add, openCart } = useCart();
  return (
    <Button
      variant="outline"
      onClick={() => { add("brightening-oil"); add("skin-brightening-pack"); openCart(); }}
      className="h-12 rounded-full border-accent px-8 text-xs uppercase text-accent hover:bg-accent hover:text-accent-foreground"
    >
      <ShoppingBag /> Add combo to cart — ₹879
    </Button>
  );
}

function Index() {
  const heroRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLElement | null>(null);
  const slotRef = useRef<HTMLDivElement | null>(null);
  const contentOpacity = useMotionValue(0);
  const reduce = useReducedMotion();
  const oilRef = useRef<HTMLAnchorElement | null>(null);
  const [bottleActive, setBottleActive] = useState(false);
  const onActive = useCallback((a: boolean) => setBottleActive(a), []);
  return (
    <main className="relative isolate min-h-screen bg-background font-sans text-foreground">
      <section ref={heroRef} className="relative overflow-hidden">
        <img src={bottleActive ? tree.url : hero.url} srcSet={bottleActive ? `${treeSmall.url} 800w, ${tree.url} 1200w` : `${heroSmall.url} 800w, ${hero.url} 1200w`} sizes="100vw" fetchPriority="high" decoding="async" alt="Glowzo Lite Brightening Oil resting on driftwood" width={1200} height={896} className="absolute inset-0 -z-10 h-full w-full object-cover object-[35%_center]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background/30 via-transparent to-background/80" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-background" />
        <Header />
        <div className="relative z-20 mx-auto flex min-h-[62vh] max-w-7xl flex-col justify-between gap-10 px-4 pb-12 sm:px-6 md:px-10 lg:min-h-[70vh]">
          <motion.h1 initial={{ opacity: 0, y: 60, letterSpacing: "0.3em" }} animate={{ opacity: 1, y: 0, letterSpacing: "0em" }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} className="select-none text-right font-display text-[13vw] leading-none text-secondary/90 lg:text-[10rem]">{BRAND}</motion.h1>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }} className="ml-auto max-w-sm space-y-6 text-right">
            <p className="text-base text-secondary sm:text-lg">Where ancient Ayurveda meets your everyday glow.</p>
            <Link to="/shop" className="inline-block rounded-full bg-primary px-7 py-3 text-xs uppercase tracking-widest text-primary-foreground transition hover:bg-accent hover:text-accent-foreground">
              Shop Now
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-border bg-band py-3 sm:py-4">
        <div className="flex w-max animate-marquee gap-8 whitespace-nowrap font-display text-base tracking-[0.15em] text-secondary sm:text-xl">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8">The Art of Ayurveda <Sparkle className="h-3.5 w-3.5 text-accent" /></span>
          ))}
        </div>
      </div>

      <section ref={stageRef} data-bottle-reveal-stage className={reduce ? "relative" : "relative h-[170svh]"}>
        <div className="sticky top-0 mx-auto flex h-svh min-h-[650px] max-w-5xl flex-col justify-center px-4 py-6 sm:px-6">
        <motion.div data-reveal-copy style={{ opacity: contentOpacity }} className="relative z-20 mb-3 text-center"><p className="text-xs uppercase tracking-widest text-accent">Inside every drop</p>
        <h2 className="mt-2 font-display text-4xl sm:text-5xl">What's inside</h2></motion.div>
        <div className="grid grid-cols-[1fr_38%_1fr] items-center gap-2 sm:gap-6">
          {[oilIngredients.slice(0, 4), oilIngredients.slice(4)].map((group, side) => (
            <motion.div key={side} style={{ opacity: contentOpacity }} className={side === 0 ? "relative z-20 space-y-5 text-right" : "relative z-20 col-start-3 space-y-5 text-left"}>
              {group.map((name) => (
                <div key={name} className="break-words text-xs text-foreground sm:text-sm">
                  <div className={`flex items-center gap-1.5 ${side === 0 ? "justify-end" : ""}`}><Leaf className="h-3 w-3 shrink-0 text-accent" /><span>{name}</span></div>
                  <div className={`mt-2 h-px w-3/4 bg-accent/60 ${side === 0 ? "ml-auto" : ""}`} />
                </div>
              ))}
            </motion.div>
          ))}
          <div ref={slotRef} className="col-start-2 row-start-1 h-[38svh] min-h-[260px]">
            {reduce && <img src={products[0]?.img} alt="Glowzo Ayurvedic Brightening Oil" className="h-full w-full object-contain" />}
          </div>
        </div>
        <motion.div data-usage-guide style={{ opacity: contentOpacity }} className="mx-auto mt-3 w-full max-w-2xl border-t border-border pt-5">
          <h3 className="relative z-20 w-fit text-left text-xs uppercase tracking-widest text-accent">How to use</h3>
          <ol className="mt-4 grid gap-3 text-xs sm:grid-cols-3 sm:text-sm">
            {["Squeeze the dropper bulb and fill the glass tube with oil.", "Warm 3 drops between your fingertips.", "Press gently onto clean face 25 min before bath, or before sleep and rinse in the morning."].map((step, i) => (
              <li key={i} className="flex gap-3 sm:flex-col"><span className="font-display text-3xl text-accent">0{i + 1}</span><span className="text-muted-foreground">{step}</span></li>
            ))}
          </ol>
        </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 md:px-10">
        <div className="mb-10 flex items-end justify-between sm:mb-12">
          <motion.h2 {...fadeUp} className="font-display text-4xl sm:text-5xl md:text-6xl">The Collection</motion.h2>
          <Link to="/shop" className="shrink-0 text-xs uppercase tracking-widest text-accent">View all</Link>
        </div>
        <div className="grid gap-10 md:grid-cols-3">
          {products.map((p, i) => p.slug === "brightening-oil" ? <ProductCard key={p.name} p={p} index={i} imageRef={oilRef} hideImage={bottleActive} /> : <ProductCard key={p.name} p={p} index={i} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 md:px-10">
        <motion.div {...fadeUp} className="mb-10 text-center sm:mb-12">
          <p className="text-xs uppercase tracking-widest text-accent">Better together</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">The Glowzo Lite combo — ₹879</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">Brightening oil and skin brightening pack, handcrafted with Ayurvedic herbs.</p>
        </motion.div>
        <motion.figure {...fadeUp} className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border shadow-2xl">
          <img src={combo.url} alt="Glowzo Lite Brightening Oil and Skin Brightening Pack together for ₹879, with benefits and key ingredients" width={1254} height={1254} loading="lazy" decoding="async" className="h-auto w-full" />
        </motion.figure>
        <motion.div {...fadeUp} className="mt-8 text-center">
          <ComboBuyButton />
        </motion.div>
      </section>

      <section className="bg-card py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
          <motion.div {...fadeUp}><p className="text-xs uppercase tracking-widest text-accent">Glowzo Rituals</p>
          <h2 className="mb-4 mt-3 font-display text-4xl sm:text-5xl">See the glow.</h2></motion.div>
          <p className="mb-10 text-sm text-muted-foreground sm:mb-12">Tap a video to play it with sound. Tap again to pause.</p>
          <Rituals />
        </div>
      </section>

      <Footer />
      <HeroBottleAnimation src={products[0]?.img ?? ""} heroRef={heroRef} stageRef={stageRef} slotRef={slotRef} targetRef={oilRef} contentOpacity={contentOpacity} onActive={onActive} />
    </main>
  );
}
