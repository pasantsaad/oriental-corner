import type { Product } from "@/lib/products";

export function KilimImage({ p, className = "" }: { p: Product; className?: string }) {
  if (p.image) return <img src={p.image} alt={`Kilim ${p.code}`} loading="lazy" className={`h-full w-full object-cover ${className}`} />;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-secondary text-muted-foreground">
      <span className="font-serif text-3xl text-foreground">{p.code}</span>
      <span className="eyebrow text-[0.6rem]">Photo coming soon</span>
    </div>
  );
}
