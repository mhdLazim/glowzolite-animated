import { describe, expect, it } from "vitest";
import { cartTotal, setCartQuantity, whatsappOrderUrl } from "@/lib/cart";

describe("Multi-product cart", () => {
  it("combines repeated additions and keeps different products", () => {
    let cart = setCartQuantity([], "brightening-oil", 1);
    cart = setCartQuantity(cart, "hair-growth-serum", 1);
    cart = setCartQuantity(cart, "brightening-oil", 2);
    expect(cart).toEqual([{ slug: "brightening-oil", quantity: 2 }, { slug: "hair-growth-serum", quantity: 1 }]);
  });
  it("removes a product at zero quantity", () => {
    expect(setCartQuantity([{ slug: "skin-brightening-pack", quantity: 1 }], "skin-brightening-pack", 0)).toEqual([]);
  });
  it("totals two oils and one pack using their prices", () => {
    expect(cartTotal([{ slug: "brightening-oil", quantity: 2 }, { slug: "skin-brightening-pack", quantity: 1 }])).toBe(1378);
  });
  it("sends all three selected products and quantities to the requested WhatsApp number", () => {
    const url = new URL(whatsappOrderUrl([{ slug: "brightening-oil", quantity: 2 }, { slug: "hair-growth-serum", quantity: 1 }, { slug: "skin-brightening-pack", quantity: 1 }]));
    expect(url.pathname).toBe("/918075981789");
    const message = url.searchParams.get("text");
    expect(message).toContain("Ayurvedic Brightening Oil (30 ml)\nQuantity: 2");
    expect(message).toContain("Hair Growth Serum (30 ml)\nQuantity: 1");
    expect(message).toContain("Ayurvedic Skin Brightening Pack (100 g)\nQuantity: 1");
    expect(message).toContain("Product total: ₹1877");
    expect(message).toContain("Shipping: ₹50");
    expect(message).toContain("Order total: ₹1927");
  });
});