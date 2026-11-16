import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { KilimImage } from "@/components/site/KilimImage";
import { filterProducts, formatEGP, MATERIAL, products, sizeLabel, SIZES, SORTS, STYLES, discount, type Sort } from "@/lib/products";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Kilims — Special Collection | Oriental Corner" },
      { name: "description", content: "Handmade premium wool-cotton kilims on sale. Filter by size and style, with Cairo & nationwide delivery." },
      { property: "og:title", content: "Shop Kilims — Oriental Corner Special Collection" },
      { property: "og:description", content: "Handmade premium wool-cotton kilims, up to 50% off." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

function FilterGroup({ label, options, value, onChange }: { label: string; options: readonly string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className="eyebrow text-muted-foreground">{label}</span>
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} className={`border-b pb-0.5 text-sm transition-colors ${value === o ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
          {o === "All" || label !== "Size" ? o : sizeLabel(o)}
        </button>
      ))}
    </div>
  );
}

function Shop() {
  const { add } = useCart();
  const [size, setSize] = useState("All");
  const [style, setStyle] = useState("All");
  const [sort, setSort] = useState<Sort>("Featured");
  const list = filterProducts(products, size, style, sort);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <p className="eyebrow text-accent">White Friday · Special Collection</p>
      <h1 className="mt-3 text-5xl md:text-6xl">Shop Kilims</h1>

      <div className="mt-10 flex flex-col gap-5 border-y border-border py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4">
          <FilterGroup label="Size" options={SIZES} value={size} onChange={setSize} />
          <FilterGroup label="Style" options={STYLES} value={style} onChange={setStyle} />
        </div>
        <label className="flex items-center gap-3">
          <span className="eyebrow text-muted-foreground">Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="rounded-sm border border-border bg-background px-3 py-2 text-sm">
            {SORTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">{list.length} {list.length === 1 ? "piece" : "pieces"}</p>

      {list.length === 0 && <p className="py-24 text-center font-serif text-2xl text-muted-foreground">No kilims match these filters yet.</p>}

      <div className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p) => (
          <article key={p.code} className="group flex flex-col">
            <Link to="/shop/$slug" params={{ slug: p.slug }} className="block">
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-border">
                <span className="absolute left-3 top-3 z-10 rounded-sm bg-accent px-2 py-1 text-[0.65rem] font-medium tracking-widest text-accent-foreground">SALE −{discount(p)}%</span>
                <KilimImage p={p} className="transition-transform duration-700 group-hover:scale-105" />
              </div>
              <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">{p.code}</p>
              <h2 className="mt-1 text-xl leading-snug">{MATERIAL}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{sizeLabel(p.size)}</p>
              <p className="mt-2 text-sm"><s className="mr-2 text-muted-foreground">{formatEGP(p.was)}</s><span className="font-medium">{formatEGP(p.price)}</span></p>
            </Link>
            <button onClick={() => add(p)} className="mt-4 w-full rounded-sm border border-primary py-3 eyebrow text-primary transition-colors hover:bg-primary hover:text-primary-foreground">Add to Cart</button>
          </article>
        ))}
      </div>
    </section>
  );
}
