import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CartContext, useCart, type CartContextValue } from "@/lib/cart-context";

function CartConsumer() {
  const { items } = useCart();
  return <output aria-label="Cart quantity">{items.reduce((sum, item) => sum + item.quantity, 0)}</output>;
}

describe("Shared cart context", () => {
  it("keeps refreshed consumers connected to the existing cart provider", () => {
    const value: CartContextValue = { items: [{ slug: "brightening-oil", quantity: 2 }], add: () => {}, openCart: () => {} };
    const { rerender } = render(<CartContext.Provider value={value}><CartConsumer key="before" /></CartContext.Provider>);
    expect(screen.getByLabelText("Cart quantity").textContent).toBe("2");
    rerender(<CartContext.Provider value={value}><CartConsumer key="after" /></CartContext.Provider>);
    expect(screen.getByLabelText("Cart quantity").textContent).toBe("2");
  });
});