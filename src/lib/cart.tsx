import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "./products";

type Line = { product: Product; qty: number };
type Cart = { lines: Line[]; count: number; total: number; open: boolean; setOpen: (o: boolean) => void; add: (p: Product) => void; remove: (code: string) => void; setQty: (code: string, qty: number) => void; clear: () => void };
const Ctx = createContext<Cart | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);
  const add = (p: Product) => {
    setLines((ls) => {
      const f = ls.find((l) => l.product.code === p.code);
      return f ? ls.map((l) => (l === f ? { ...l, qty: l.qty + 1 } : l)) : [...ls, { product: p, qty: 1 }];
    });
    setOpen(true);
  };
  const remove = (code: string) => setLines((ls) => ls.filter((l) => l.product.code !== code));
  const setQty = (code: string, qty: number) =>
    setLines((ls) => (qty < 1 ? ls.filter((l) => l.product.code !== code) : ls.map((l) => (l.product.code === code ? { ...l, qty } : l))));
  const clear = () => setLines([]);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + l.qty * l.product.price, 0);
  return <Ctx.Provider value={{ lines, count, total, open, setOpen, add, remove, setQty, clear }}>{children}</Ctx.Provider>;
}
export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
};
