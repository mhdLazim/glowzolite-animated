import { createFileRoute } from "@tanstack/react-router";
import { Page, WHATSAPP, meta } from "@/components/site";

export const Route = createFileRoute("/contact")({
  head: () => meta("Contact Us — Glowzo", "Get in touch with Glowzo on WhatsApp or email."),
  component: () => (
    <Page eyebrow="Contact" title="We'd love to hear from you.">
      <p>For orders, product questions or support, message us on WhatsApp — we usually reply within a few hours.</p>
      <h2>WhatsApp / Phone</h2>
      <p>+91 80759 81789</p>
      <h2>Email</h2>
      <p>glowzolite@gmail.com</p>
      <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="inline-block rounded-full bg-primary px-7 py-3 text-xs uppercase tracking-widest text-primary-foreground transition hover:bg-accent hover:text-accent-foreground">
        Chat on WhatsApp
      </a>
    </Page>
  ),
});
