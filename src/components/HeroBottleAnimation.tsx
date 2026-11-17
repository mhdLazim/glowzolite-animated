import { useEffect, useState, type RefObject } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import treeBottle from "@/assets/tree-bottle-fixed.webp.asset.json";

type Geo = { sx: number; sy: number; width: number; height: number; ex: number; ey: number; endSize: number; endScroll: number; midSize: number; midHeight: number; my: number; a: number; b: number; midX: number; viewportHeight: number; viewportWidth: number };

/** One bottle: the exact photographic cut-out leaves the tree and settles into the catalog. */
export function HeroBottleAnimation({ src, heroRef, stageRef, slotRef, targetRef, contentOpacity, onActive }: { src: string; heroRef: RefObject<HTMLElement | null>; stageRef: RefObject<HTMLElement | null>; slotRef: RefObject<HTMLElement | null>; targetRef: RefObject<HTMLElement | null>; contentOpacity: MotionValue<number>; onActive: (active: boolean) => void }) {
  const reduce = useReducedMotion();
  const [geo, setGeo] = useState<Geo | null>(null);
  const { scrollY: rawY } = useScroll();
  // Critically damped smoothing: glides without overshooting the card.
  const scrollY = useSpring(rawY, { stiffness: 140, damping: 32, mass: 0.35, restDelta: 0.5 });

  useEffect(() => {
    if (reduce) return;
    const calc = () => {
      const h = heroRef.current, t = targetRef.current, st = stageRef.current, slot = slotRef.current;
      if (!h || !t || !st || !slot) return;
      const hr = h.getBoundingClientRect();
      // Offset coordinates ignore the product card's entrance transforms.
      let top = 0, left = 0;
      let el: HTMLElement | null = t;
      while (el) { top += el.offsetTop; left += el.offsetLeft; el = el.offsetParent instanceof HTMLElement ? el.offsetParent : null; }
      const cover = Math.max(hr.width / 1200, hr.height / 896);
      const imageLeft = hr.left + (hr.width - 1200 * cover) * 0.35;
      const imageTop = hr.top + window.scrollY + (hr.height - 896 * cover) / 2;
      let stTop = 0; let se: HTMLElement | null = st;
      while (se) { stTop += se.offsetTop; se = se.offsetParent instanceof HTMLElement ? se.offsetParent : null; }
      let slotTop = 0, slotLeft = 0; let sl: HTMLElement | null = slot;
      while (sl) { slotTop += sl.offsetTop; slotLeft += sl.offsetLeft; sl = sl.offsetParent instanceof HTMLElement ? sl.offsetParent : null; }
      const midSize = Math.min(slot.offsetWidth, 320, window.innerHeight * 0.35);
      // Preserve a tall silhouette instead of squeezing the serum into a small square.
      const midHeight = Math.min(slot.offsetHeight * 0.85, 440, window.innerHeight * 0.4);
      const arrival = stTop;
      const departure = stTop + st.offsetHeight - window.innerHeight;
      const endSize = Math.min(t.offsetWidth - 80, t.offsetHeight * 0.8);
      setGeo({ sx: imageLeft + 376 * cover, sy: imageTop + 215 * cover, width: 353 * cover, height: 497 * cover,
        ex: left + (t.offsetWidth - endSize) / 2, ey: top + t.offsetHeight - 40 - endSize, endSize,
        endScroll: Math.max(departure + window.innerHeight * 0.3, top + t.offsetHeight - window.innerHeight * 0.8),
        midSize, midHeight, my: slotTop - stTop + (slot.offsetHeight - midHeight) / 2, a: Math.max(1, arrival), b: departure, midX: slotLeft + slot.offsetWidth / 2, viewportHeight: window.innerHeight, viewportWidth: window.innerWidth });
    };
    const image = new Image();
    image.src = treeBottle.url;
    image.onload = calc;
    if (image.complete) calc();
    const observer = new ResizeObserver(calc);
    if (heroRef.current) observer.observe(heroRef.current);
    if (targetRef.current) observer.observe(targetRef.current);
    if (stageRef.current) observer.observe(stageRef.current);
    if (slotRef.current) observer.observe(slotRef.current);
    window.addEventListener("resize", calc);
    return () => { image.onload = null; observer.disconnect(); window.removeEventListener("resize", calc); };
  }, [reduce, heroRef, stageRef, slotRef, targetRef]);
  useEffect(() => { onActive(!reduce && !!geo); return () => onActive(false); }, [reduce, geo, onActive]);

  const g = geo ?? { sx: 0, sy: 0, width: 0, height: 0, ex: 0, ey: 0, endSize: 0, endScroll: 3, midSize: 0, midHeight: 0, midX: 0, my: 0, a: 1, b: 2, viewportHeight: 0, viewportWidth: 0 };
  const k = [0, g.a, g.b, g.endScroll];
  const mx = g.midX - g.midSize / 2;
  const left = useTransform(scrollY, k, [g.sx, mx, mx, g.ex]);
  const top = useTransform(scrollY, k, [g.sy, g.a + g.my, g.b + g.my, g.ey]);
  const width = useTransform(scrollY, k, [g.width, g.midSize, g.midSize, g.endSize]);
  const height = useTransform(scrollY, k, [g.height, g.midHeight, g.midHeight, g.endSize]);
  const half = g.a / 2;
  const rotate = useTransform(scrollY, [0, half, g.a, g.b, (g.b + g.endScroll) / 2, g.endScroll], [0, 8, 0, 0, -4, 0]);
  const rotateY = useTransform(scrollY, [0, half, g.a, g.b, g.endScroll], [0, -22, 0, 0, 0]);
  const glint = useTransform(scrollY, [0, g.a, g.b, g.endScroll], [-60, 40, 160, 260]);
  const shadowOpacity = useTransform(scrollY, [0, g.a, g.b, g.endScroll], [0, 0.6, 0.6, 0.3]);
  // Crossfade on arrival: never abruptly replace the tree bottle mid-descent.
  const originalOpacity = useTransform(scrollY, [g.a * 0.75, g.a], [1, 0]);
  const catalogOpacity = useTransform(scrollY, [g.a * 0.75, g.a], [0, 1]);
  const d = (g.b - g.a) / 4;
  const ok = [0, g.a, g.a + d, g.b - d, g.b, g.endScroll + 1];
  const capLift = g.midHeight * (g.viewportWidth < 640 ? 0.12 : 0.28);
  const capY = useTransform(scrollY, ok, [0, 0, -capLift, -capLift, 0, 0]);
  const capRotate = useTransform(scrollY, ok, [0, 0, -6, -6, 0, 0]);
  const reveal = useTransform(scrollY, ok, [0, 0, 1, 1, 0, 0]);
  // All section copy follows the same smoothed clock as the bottle, never viewport entrance triggers.
  const sectionReveal = useTransform(scrollY, [0, g.a, g.a + Math.min(80, d * 0.3), g.b - d, g.b - d * 0.3, g.endScroll + 1], [0, 0, 1, 1, 0, 0]);
  useEffect(() => {
    contentOpacity.set(reduce ? 1 : sectionReveal.get());
    if (reduce) return;
    return sectionReveal.on("change", value => contentOpacity.set(value));
  }, [reduce, sectionReveal, contentOpacity]);
  const glintLeft = useTransform(glint, v => `${v}%`);
  if (reduce || !geo) return null;
  return (
    <>
    <motion.div data-moving-bottle aria-hidden className="pointer-events-none absolute z-10" style={{ left, top, width, height, rotate, rotateY, transformPerspective: 1000 }}>
      <motion.div className="absolute -bottom-[6%] left-[15%] h-[8%] w-[70%] rounded-[50%] bg-foreground/0 shadow-[0_20px_40px_10px_hsl(0_0%_0%/0.7)]" style={{ opacity: shadowOpacity }} />
      <motion.img src={treeBottle.url} alt="" className="absolute inset-0 h-full w-full object-fill" style={{ opacity: originalOpacity }} />
      <motion.div className="absolute inset-0" style={{ opacity: catalogOpacity }}>
        <img src={src} alt="" className="absolute inset-0 h-full w-full object-contain drop-shadow-2xl" style={{ clipPath: "inset(33.5% 0 0 0)" }} />
        <motion.div className="absolute inset-0 overflow-hidden" style={{ clipPath: "inset(33.5% 22% 2% 22% round 12%)" }}>
          <motion.div className="absolute top-0 h-full w-[25%] -skew-x-12 bg-gradient-to-r from-transparent via-background/35 to-transparent" style={{ left: glintLeft }} />
        </motion.div>
        <motion.div data-bottle-neck className="absolute left-[41%] top-[33%] h-[3%] w-[18%] rounded-[50%] border border-accent/60 bg-foreground/20" style={{ opacity: reveal }} />
        <motion.div className="absolute inset-0" style={{ y: capY, rotate: capRotate, transformOrigin: "50% 33%" }}>
          <motion.div data-dropper-tube className="absolute left-[47%] top-[31%] h-[54%] w-[6%]" style={{ opacity: reveal }}>
            <div className="absolute inset-0 overflow-hidden border border-foreground/30 bg-gradient-to-r from-foreground/10 via-background/50 to-foreground/20 shadow-[inset_0_0_6px_hsl(0_0%_100%/0.25)]" style={{ clipPath: "polygon(0 0,100% 0,100% 80%,62% 100%,38% 100%,0 80%)" }}>
              <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-b from-accent/50 via-accent/80 to-accent" />
              <div className="absolute left-[16%] top-[3%] h-[80%] w-[14%] rounded-full bg-background/70" />
              {[20, 40, 60].map(t => <div key={t} className="absolute right-0 h-px w-[35%] bg-foreground/40" style={{ top: `${t}%` }} />)}
            </div>
            <motion.div className="absolute left-1/2 top-full h-[4%] w-[60%] -translate-x-1/2 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-accent" animate={{ y: [0, 0, 26], opacity: [0, 1, 0], scale: [0.4, 1, 0.8] }} transition={{ duration: 1.8, repeat: Infinity, times: [0, 0.6, 1], ease: "easeIn" }} />
          </motion.div>
          <img data-bottle-cap src={src} alt="" className="absolute inset-0 h-full w-full object-contain" style={{ clipPath: "inset(0 0 66.5% 0)" }} />
        </motion.div>
      </motion.div>
    </motion.div>
    </>
  );
}
