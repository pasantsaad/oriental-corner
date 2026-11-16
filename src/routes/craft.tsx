import { createFileRoute, Link } from "@tanstack/react-router";
import loom from "@/assets/craft-loom.jpg";
import geometric from "@/assets/collection-geometric.jpg";
import statement from "@/assets/collection-statement.jpg";

export const Route = createFileRoute("/craft")({
  head: () => ({
    meta: [
      { title: "Our Craft — Egyptian Hand-Woven Kilims | Oriental Corner" },
      { name: "description", content: "The heritage of Egyptian flat-weaving: wool and cotton kilims made by hand on wooden looms." },
      { property: "og:title", content: "Our Craft — Oriental Corner" },
      { property: "og:description", content: "The heritage of hand-woven Egyptian wool & cotton kilims." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Craft,
});

const steps = [
  { n: "01", t: "The yarn", d: "Wool gives a kilim its warmth, body and depth of colour; cotton warps give it strength and keep it flat and true." },
  { n: "02", t: "The loom", d: "Warp threads are stretched tight across a wooden frame. Everything that follows is built over them, one pass at a time." },
  { n: "03", t: "The weave", d: "Coloured wefts are passed by hand and beaten down firmly, building the pattern row by row — no pile, no knots, no glue." },
  { n: "04", t: "The finish", d: "Ends are knotted into fringes or tassels, then each piece is washed, checked and measured before it reaches you." },
];

function Craft() {
  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-14 px-6 py-20 md:grid-cols-2 md:items-center">
        <div>
          <p className="eyebrow text-muted-foreground">Our Craft</p>
          <h1 className="mt-5 text-5xl leading-[1.05] md:text-6xl">A heritage woven by hand, <em className="font-normal">row by row.</em></h1>
          <p className="mt-6 max-w-md text-muted-foreground">Flat-weaving has lived in Egyptian homes for generations — practical, colourful textiles made to be walked on, sat on and handed down. Our kilims continue that tradition in a premium blend of wool and cotton.</p>
        </div>
        <img src={loom} alt="Hands weaving a kilim on a wooden loom" width={1024} height={1280} className="aspect-[4/5] w-full rounded-sm border border-border object-cover" />
      </section>

      <section className="border-y border-border bg-secondary">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-4xl md:text-5xl">From thread to floor</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="border-t border-foreground/20 pt-6">
                <span className="font-mono text-xs text-accent">{s.n}</span>
                <h3 className="mt-3 text-2xl">{s.t}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-20 md:grid-cols-[1fr_1fr_1.2fr] md:items-end">
        <img src={geometric} alt="Geometric kilim detail" loading="lazy" className="aspect-[3/4] w-full rounded-sm object-cover" />
        <img src={statement} alt="Kilim in a dining room" loading="lazy" className="aspect-[3/4] w-full rounded-sm object-cover md:mb-16" />
        <div className="md:pb-4">
          <h2 className="text-4xl">Why a flatweave lasts</h2>
          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            <li>— Reversible: turn it over to double its life.</li>
            <li>— Light and flat: easy to lift, clean and move between rooms.</li>
            <li>— Hand-made: the small irregularities are the mark of a real weaver.</li>
          </ul>
          <Link to="/shop" className="mt-8 inline-block rounded-sm bg-primary px-8 py-4 eyebrow text-primary-foreground">Shop the collection</Link>
        </div>
      </section>
    </>
  );
}
