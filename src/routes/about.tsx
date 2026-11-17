import { createFileRoute } from "@tanstack/react-router";
import { Page, meta } from "@/components/site";

export const Route = createFileRoute("/about")({
  head: () => meta("About Us — Glowzo", "The story behind Glowzo's Ayurvedic skin and hair care."),
  component: () => (
    <Page eyebrow="Our Story" title="Rooted in Ayurveda, made for today.">
      <p>Every Glowzo blend begins with time-honoured herbs like saffron (kumkuma), manjishtha, amla and bhringraj — ingredients trusted in Ayurveda for generations.</p>
      <p>We craft our oils, serums and packs gently, free from parabens and sulphates, with no added colours or artificial fragrance — so your skin and hair can glow naturally.</p>
    </Page>
  ),
});
