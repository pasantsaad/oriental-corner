import { describe, expect, it } from "vitest";
import { buildOrderMessage, orderSchema, orderTotal } from "./orders";
import { products } from "./products";

const base = { name: "Mona Ali", area: "New Cairo", address: "12 Street 90, 5th Settlement", notes: "" };

describe("COD order", () => {
  it("accepts an Egyptian mobile like 01012345678", () => {
    expect(orderSchema.safeParse({ ...base, mobile: "010 1234 5678" }).success).toBe(true);
  });
  it("accepts +20 prefix", () => {
    expect(orderSchema.safeParse({ ...base, mobile: "+201204846667" }).success).toBe(true);
  });
  it("rejects a short number", () => {
    expect(orderSchema.safeParse({ ...base, mobile: "0101234" }).success).toBe(false);
  });
  it("total multiplies quantity: 2 × OR 0287 = 3300", () => {
    expect(orderTotal([{ product: products.find((p) => p.code === "OR 0287")!, qty: 2 }])).toBe(3300);
  });
  it("receipt lists code, size and total", () => {
    const c = orderSchema.parse({ ...base, mobile: "01012345678" });
    const msg = buildOrderMessage(c, [{ product: products.find((p) => p.code === "OR 0266")!, qty: 1 }], "OC-TEST");
    expect(msg).toContain("OR 0266 | 155 × 250 cm | Qty 1 | EGP 4,200");
    expect(msg).toContain("Total: EGP 4,200");
  });
});
