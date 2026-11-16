import { createFileRoute, Link } from "@tanstack/react-router";
import geometric from "@/assets/collection-geometric.jpg";
import minimalist from "@/assets/collection-minimalist.jpg";
import statement from "@/assets/collection-statement.jpg";
import loom from "@/assets/craft-loom.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Oriental Corner — Egyptian Hand-Woven Kilims, Cairo" },
      { name: "description", content: "Shop authentic handcrafted Egyptian kilims and artisanal rugs. Visit our Masaken Sheraton showroom or order with nationwide delivery." },
      { property: "og:title", content: "Oriental Corner — Egyptian Hand-Woven Kilims" },
      { property: "og:description", content: "Authentic handcrafted kilims, woven in Egypt. Showroom in Masaken Sheraton, Cairo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const collections = [
  { title: "Geometric Kilims", img: geometric, note: "Diamonds, steps & tribal motifs" },
  { title: "Modern Minimalist", img: minimalist, note: "Quiet lines in natural fibres" },
  { title: "Large Statement Rugs", img: statement, note: "Generous sizes for grand rooms" },
];

function Index() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl md:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col justify-center px-6 py-20 md:py-28 md:pr-16">
            <p className="eyebrow text-accent">White Friday · Up to 50% off</p>
            <h1 className="mt-6 text-5xl leading-[1.02] md:text-7xl">The Art of Egyptian <em className="font-normal">Hand-Woven</em> Kilims</h1>
            <p className="mt-6 max-w-md text-muted-foreground">Wool and cotton, woven slowly on wooden looms by Egyptian artisans — made to warm a room for generations.</p>
            <div className="mt-10">
              <Link to="/shop" className="inline-block rounded-sm bg-primary px-8 py-4 eyebrow text-primary-foreground transition-opacity hover:opacity-90">Explore the Collection</Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden md:aspect-auto md:min-h-[680px]">
            <img src={statement} alt="Handmade wool-cotton kilim OR 0561 in a warm living room" className="absolute inset-0 h-full w-full object-cover object-top" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex items-end justify-between border-b border-border pb-6">
          <h2 className="text-4xl md:text-5xl">Curated Collections</h2>
          <Link to="/shop" className="eyebrow text-muted-foreground hover:text-foreground">View all →</Link>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {collections.map((c) => (
            <Link key={c.title} to="/shop" className="group block">
              <div className="overflow-hidden rounded-sm border border-border">
                <img src={c.img} alt={c.title} loading="lazy" width={896} height={1152} className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <h3 className="mt-5 text-2xl">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.note}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary">
        <div className="mx-auto grid max-w-7xl md:grid-cols-2">
          <img src={loom} alt="Egyptian artisan weaving a kilim on a wooden loom" loading="lazy" width={1024} height={1280} className="aspect-[4/5] h-full w-full object-cover" />
          <div className="flex flex-col justify-center px-6 py-20 md:px-16">
            <p className="eyebrow text-muted-foreground">Our Craft</p>
            <h2 className="mt-5 text-4xl leading-tight md:text-5xl">Woven by hand, thread by thread, in Egypt.</h2>
            <p className="mt-6 text-muted-foreground">Every Oriental Corner kilim is flat-woven from a durable wool-cotton blend, its pattern built row by row by skilled Egyptian weavers. No two pieces are exactly alike.</p>
            <div className="mt-10 border-t border-border pt-8">
              <p className="eyebrow">Visit the Showroom</p>
              <p className="mt-3 font-serif text-2xl">40 Kamal Hassan Ali, Masaken Sheraton, Cairo</p>
              <Link to="/showroom" className="mt-6 inline-block rounded-sm border border-foreground px-7 py-3 eyebrow transition-colors hover:bg-foreground hover:text-background">Plan your visit</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}