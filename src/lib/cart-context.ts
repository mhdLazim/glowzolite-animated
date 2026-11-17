import { createContext, useContext } from "react";
import type { CartItem } from "@/lib/cart";

export type CartContextValue = {
  items: CartItem[];
  add: (slug: string) => void;
  openCart: () => void;
};

// Keep context identity separate from refreshed UI modules: the mounted provider
// and newly refreshed consumers must always use the same context object.
export const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("Cart controls must be inside CartProvider");
  return context;
}