import { createFileRoute } from "@tanstack/react-router";
import { Page, meta } from "@/components/site";

export const Route = createFileRoute("/returns")({
  head: () => meta("Return & Refund Policy — Glowzo", "Glowzo's return, replacement and refund policy."),
  component: () => (
    <Page eyebrow="Policy" title="Return & Refund Policy">
      <h2>Damaged or wrong product</h2>
      <p>If your product arrives damaged, leaking or incorrect, message us on WhatsApp within 48 hours of delivery with an unboxing photo or video. We will send a free replacement or a full refund.</p>
      <h2>Opened products</h2>
      <p>For hygiene reasons, opened or used products cannot be returned.</p>
      <h2>Refunds</h2>
      <p>Approved refunds are processed to the original payment method within 5–7 working days.</p>
      <h2>Cancellations</h2>
      <p>Orders can be cancelled before they are shipped by messaging us on WhatsApp.</p>
    </Page>
  ),
});
