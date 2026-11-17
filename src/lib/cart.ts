import { products, SHIPPING, WHATSAPP } from "@/lib/products";

export type CartItem = { slug: string; quantity: number };

export function setCartQuantity(items: CartItem[], slug: string, quantity: number): CartItem[] {
  if (!products.some((p) => p.slug === slug) || !Number.isFinite(quantity)) return items;
  const next = Math.max(0, Math.floor(quantity));
  if (next === 0) return items.filter((item) => item.slug !== slug);
  return items.some((item) => item.slug === slug)
    ? items.map((item) => item.slug === slug ? { ...item, quantity: next } : item)
    : [...items, { slug, quantity: next }];
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + (products.find((p) => p.slug === item.slug)?.price ?? 0) * item.quantity, 0);
}

export function shippingCharge(items: CartItem[]) {
  return items.length > 0 ? SHIPPING : 0;
}

export function orderTotal(items: CartItem[]) {
  return cartTotal(items) + shippingCharge(items);
}

export function whatsappOrderUrl(items: CartItem[]) {
  const lines = items.flatMap((item) => {
    const product = products.find((p) => p.slug === item.slug);
    return product ? [`${product.line} ${product.name} (${product.size})\nQuantity: ${item.quantity}\nPrice: ₹${product.price} each\nSubtotal: ₹${product.price * item.quantity}`] : [];
  });
  const message = `Hello Glowzo! I would like to order:\n\n${lines.join("\n\n")}\n\nProduct total: ₹${cartTotal(items)}\nShipping: ₹${shippingCharge(items)}\nOrder total: ₹${orderTotal(items)}\nPlease confirm availability.\n\nName:\nAddress:`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}