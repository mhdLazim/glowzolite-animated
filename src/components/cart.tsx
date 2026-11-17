import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingBag, Plus, Minus, Trash2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { products } from "@/lib/products";
import { cartTotal, shippingCharge, orderTotal, setCartQuantity, whatsappOrderUrl, type CartItem } from "@/lib/cart";
import { CartContext } from "@/lib/cart-context";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  function add(slug: string) {
    setItems((current) => setCartQuantity(current, slug, (current.find((item) => item.slug === slug)?.quantity ?? 0) + 1));
    setOpen(true);
  }
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <CartContext.Provider value={{ items, add, openCart: () => setOpen(true) }}>
      {children}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex h-dvh w-full flex-col gap-6 p-5 sm:max-w-md sm:p-6">
          <SheetHeader className="pr-6 text-left">
            <SheetTitle className="font-display text-3xl">Your cart</SheetTitle>
            <SheetDescription>{count} {count === 1 ? "item" : "items"}</SheetDescription>
          </SheetHeader>
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
              <ShoppingBag className="h-10 w-10 text-accent" />
              <p className="text-muted-foreground">Your cart is empty.</p>
              <Button asChild onClick={() => setOpen(false)}><Link to="/shop">Shop products</Link></Button>
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 overflow-y-auto">
                {items.map((item) => {
                  const product = products.find((p) => p.slug === item.slug);
                  if (!product) return null;
                  return (
                    <div key={item.slug} className="flex gap-4 border-b border-border py-5">
                      <img src={product.smallImg} alt={product.name} width={80} height={104} className="h-26 w-20 shrink-0 object-contain" />
                      <div className="min-w-0 flex-1">
                        <Link to="/product/$slug" params={{ slug: item.slug }} onClick={() => setOpen(false)} className="font-display text-xl">{product.name}</Link>
                        <p className="mt-1 text-xs text-muted-foreground">{product.size} · ₹{product.price} each</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <Button variant="outline" size="icon" aria-label={`Decrease ${product.name} quantity`} onClick={() => setItems((current) => setCartQuantity(current, item.slug, item.quantity - 1))}><Minus /></Button>
                          <span className="w-6 text-center" aria-label={`${product.name} quantity`}>{item.quantity}</span>
                          <Button variant="outline" size="icon" aria-label={`Increase ${product.name} quantity`} onClick={() => setItems((current) => setCartQuantity(current, item.slug, item.quantity + 1))}><Plus /></Button>
                          <Button variant="ghost" size="icon" aria-label={`Remove ${product.name}`} onClick={() => setItems((current) => setCartQuantity(current, item.slug, 0))}><Trash2 /></Button>
                        </div>
                        <p className="mt-3 text-sm">₹{product.price * item.quantity}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-4 border-t border-border pt-5">
                <div className="flex justify-between text-lg"><span>Product total</span><span>₹{cartTotal(items)}</span></div>
                <div className="flex justify-between text-sm text-muted-foreground"><span>Shipping</span><span>₹{shippingCharge(items)}</span></div>
                <div className="flex justify-between text-lg font-medium"><span>Total</span><span>₹{orderTotal(items)}</span></div>
                <Button asChild className="h-12 w-full"><a href={whatsappOrderUrl(items)} target="_blank" rel="noreferrer"><MessageCircle />Buy on WhatsApp</a></Button>
                <Button variant="ghost" className="w-full" onClick={() => setOpen(false)}>Continue shopping</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </CartContext.Provider>
  );
}