import { describe, expect, it } from "vitest";
import { filterProducts, products, discount } from "./products";

describe("catalogue filters", () => {
  it("size filter returns only that size", () => {
    expect(filterProducts(products, "160x230", "All", "Featured").map((p) => p.code)).toEqual(["OR 0236"]);
  });
  it("style filter Striped", () => {
    expect(filterProducts(products, "All", "Striped", "Featured").map((p) => p.code)).toEqual(["OR 0270", "OR 0265"]);
  });
  it("price low to high starts at 1650", () => {
    expect(filterProducts(products, "All", "All", "Price: Low to High")[0]?.price).toBe(1650);
  });
  it("OR 0236 is advertised at 20% off", () => {
    expect(discount(products.find((p) => p.code === "OR 0236")!)).toBe(20);
  });
});
