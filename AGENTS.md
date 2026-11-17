<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep product data in `src/lib/products.ts` so detail pages, cards, and order calculations use one catalog.
- Keep the temporary shopping cart in a root React provider so selections survive navigation without storing customer data or requiring accounts.
- Define the cart context and hook outside UI modules so live component refreshes cannot create a second context and disconnect consumers from the mounted provider.
- Serve responsive WebP product and homepage images through asset pointers; preserve transparent cut-outs and prioritize the homepage cover to reduce loading time.
- The homepage bottle transfer aligns a photographic cut-out to the cleaned cover, crossfades into a tall catalog silhouette on arrival, pauses in a sticky ingredient section, and drives its cap and section-copy fades from one smoothed scroll clock; measure the reserved bottle slot and landing without entrance transforms so text stays clear and appears only after arrival.
- Trigger shared product drops from the stationary card rather than its displaced image, using an overdamped spring and a reduced-motion fallback so clipped images always enter and land without overshooting.
- Store genuine product reviews in Cloud; public clients may submit only pending rows and read only approved rows, with moderation performed through the trusted Cloud data editor rather than shopper controls.
- Keep product benefits and formula highlights in the shared catalog; route loaders prefetch public review queries for product pages.
