import { createFileRoute } from "@tanstack/react-router";
import { Page, meta } from "@/components/site";

export const Route = createFileRoute("/terms")({
  head: () => meta("Terms & Conditions — Glowzo", "Terms and conditions for using the Glowzo website and buying our products."),
  component: () => (
    <Page eyebrow="Legal" title="Terms & Conditions">
      <h2>Orders</h2>
      <p>Orders are placed via WhatsApp. An order is confirmed once we reply with confirmation and payment details.</p>
      <h2>Pricing</h2>
      <p>All prices are in Indian Rupees (₹) and inclusive of applicable taxes. Prices may change without notice.</p>
      <h2>Product use</h2>
      <p>Our products are for external use only. Please do a patch test before first use and stop use if irritation occurs. Results may vary from person to person.</p>
      <h2>Shipping</h2>
      <p>We ship across India. Delivery times depend on your location and will be shared when your order is confirmed.</p>
      <h2>Contact</h2>
      <p>For any questions about these terms, contact us on WhatsApp at +91 80759 81789.</p>
    </Page>
  ),
});
