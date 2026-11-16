import { createServerFn } from "@tanstack/react-start";
import { products } from "./products";

function fallback(slug: string) {
  const cur = products.find((p) => p.slug === slug);
  return products
    .filter((p) => p.slug !== slug)
    .sort(
      (a, b) =>
        Number(b.style === cur?.style) - Number(a.style === cur?.style) ||
        Math.abs(a.price - (cur?.price ?? 0)) - Math.abs(b.price - (cur?.price ?? 0))
    )
    .slice(0, 3)
    .map((p) => p.slug);
}

export const getRecommendations = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => {
    if (!products.some((p) => p.slug === data?.slug)) throw new Error("Unknown product");
    return { slug: data.slug };
  })
  .handler(async ({ data }): Promise<{ slugs: string[]; source: "ai" | "fallback" }> => {
    return { slugs: fallback(data.slug), source: "fallback" };
  });