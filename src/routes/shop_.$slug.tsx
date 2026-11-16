import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { KilimImage } from "@/components/site/KilimImage";
import { AlsoLike } from "@/components/site/AlsoLike";
import { discount, formatEGP, MATERIAL, products, sizeLabel, whatsappInquiry } from "@/lib/products";

export const Route = createFileRoute("/shop_/$slug")({
  loader: ({ params }) => {
    const product = products.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `Kilim ${p.code} — ${sizeLabel(p.size)} | Oriental Corner` : "Kilim not found | Oriental Corner";
    const desc = p ? `${MATERIAL}, ${sizeLabel(p.size)}. Now ${formatEGP(p.price)} instead of ${formatEGP(p.was)}.` : "This kilim is unavailable.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(p ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="py-32 text-center">
      <h1 className="text-4xl">This kilim isn't available</h1>
      <Link to="/shop" className="mt-6 inline-block eyebrow underline">Back to the collection</Link>
    </div>
  ),
  component: Detail,
});

function Detail() {
  const { product: p } = Route.useLoaderData();
  const { add } = useCart();
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <Link to="/shop" className="eyebrow text-muted-foreground hover:text-foreground">← Back to collection</Link>
      <div className="mt-8 grid gap-12 md:grid-cols-2">
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-border">
          <span className="absolute left-4 top-4 z-10 rounded-sm bg-accent px-2 py-1 text-xs font-medium tracking-widest text-accent-foreground">SALE −{discount(p)}%</span>
          <KilimImage p={p} />
        </div>
        <div className="md:py-6">
          <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">{p.code}</p>
          <h1 className="mt-3 text-4xl leading-tight md:text-5xl">{MATERIAL}</h1>
          <p className="mt-6 text-lg"><s className="mr-3 text-muted-foreground">{formatEGP(p.was)}</s><span className="font-medium">{formatEGP(p.price)}</span></p>

          <dl className="mt-10 divide-y divide-border border-y border-border text-sm">
            <div className="flex justify-between py-3"><dt className="eyebrow text-muted-foreground">Dimensions</dt><dd>{sizeLabel(p.size)}</dd></div>
            <div className="flex justify-between py-3"><dt className="eyebrow text-muted-foreground">Material</dt><dd>Wool & cotton</dd></div>
            <div className="flex justify-between py-3"><dt className="eyebrow text-muted-foreground">Technique</dt><dd>Hand-woven flatweave</dd></div>
            {p.style && <div className="flex justify-between py-3"><dt className="eyebrow text-muted-foreground">Style</dt><dd>{p.style}</dd></div>}
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => add(p)} className="flex-1 rounded-sm bg-primary py-4 eyebrow text-primary-foreground transition-opacity hover:opacity-90">Add to Cart</button>
            <a href={whatsappInquiry(p)} target="_blank" rel="noreferrer" className="flex-1 rounded-sm border border-foreground py-4 text-center eyebrow transition-colors hover:bg-foreground hover:text-background">Inquire via WhatsApp</a>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl">Care guide</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Vacuum gently without the beater bar, on both sides, every week or two.</li>
              <li>Blot spills straight away with a clean, damp cloth — never rub.</li>
              <li>Rotate every few months so it wears and fades evenly.</li>
              <li>Avoid long hours of direct sunlight to keep the colours rich.</li>
              <li>For a deep clean, use a professional rug cleaner; do not machine wash.</li>
            </ul>
          </div>
        </div>
      </div>
      <AlsoLike slug={p.slug} />
    </section>
  );
}
