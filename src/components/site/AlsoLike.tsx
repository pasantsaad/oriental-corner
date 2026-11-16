import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getRecommendations } from "@/lib/recommendations.functions";
import { discount, formatEGP, products, sizeLabel } from "@/lib/products";
import { KilimImage } from "./KilimImage";

export function AlsoLike({ slug }: { slug: string }) {
  const { data, isPending } = useQuery({
    queryKey: ["recommendations", slug],
    queryFn: () => getRecommendations({ data: { slug } }),
    staleTime: 1000 * 60 * 30,
  });
  const picks = (data?.slugs ?? []).map((s) => products.find((p) => p.slug === s)).filter((p) => !!p);

  return (
    <section className="mt-24 border-t border-border pt-12">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="text-3xl md:text-4xl">You may also like</h2>
        <span className="eyebrow text-muted-foreground">Picked for this kilim</span>
      </div>
      <div className="grid gap-8 sm:grid-cols-3">
        {isPending
          ? [0, 1, 2].map((i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-sm bg-secondary" />)
          : picks.map((p) => (
              <Link key={p.slug} to="/shop/$slug" params={{ slug: p.slug }} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-border">
                  <span className="absolute left-3 top-3 z-10 rounded-sm bg-accent px-2 py-1 text-[0.65rem] font-medium tracking-widest text-accent-foreground">SALE −{discount(p)}%</span>
                  <KilimImage p={p} className="transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">{p.code} · {sizeLabel(p.size)}</p>
                <p className="mt-1 text-sm"><s className="mr-2 text-muted-foreground">{formatEGP(p.was)}</s>{formatEGP(p.price)}</p>
              </Link>
            ))}
      </div>
    </section>
  );
}
