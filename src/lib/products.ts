import or0287 from "@/assets/kilim-or-0287.jpg.asset.json";
import or0265 from "@/assets/kilim-or-0265.jpg.asset.json";
import or0266 from "@/assets/kilim-or-0266.jpg.asset.json";
import or0270 from "@/assets/kilim-or-0270.jpg.asset.json";

export type Style = "Geometric" | "Striped" | "Traditional" | "Minimalist";
export type Product = {
  code: string;
  slug: string;
  size: string; // e.g. "150x200"
  price: number;
  was: number;
  off: number; // the sale % exactly as advertised by the shop
  image?: string;
  style?: Style; // only set when visible in the product photo
  isNew?: boolean;
};

export const MATERIAL = "Handmade Premium Wool Cotton Kilim";

// Real catalogue only — taken from the owner's product photos and messages. Never add invented items.
export const products: Product[] = [
  { code: "OR 0266", off: 30, slug: "or-0266", size: "155x250", price: 4200, was: 6000, image: or0266.url, style: "Traditional", isNew: true },
  { code: "OR 0287", off: 50, slug: "or-0287", size: "150x200", price: 1650, was: 3300, image: or0287.url, style: "Minimalist", isNew: true },
  { code: "OR 0270", off: 50, slug: "or-0270", size: "150x200", price: 1650, was: 3300, image: or0270.url, style: "Striped", isNew: true },
  { code: "OR 0265", off: 20, slug: "or-0265", size: "150x200", price: 2650, was: 3300, image: or0265.url, style: "Striped" },
  { code: "OR 0236", off: 20, slug: "or-0236", size: "160x230", price: 4125, was: 5050 },
  { code: "OR 0237", off: 20, slug: "or-0237", size: "160x225", price: 4050, was: 5050 },
  { code: "OR 0235", off: 10, slug: "or-0235", size: "150x200", price: 4150, was: 4650 },
];

export const SIZES = ["All", "150x200", "155x250", "160x225", "160x230", "240x345"] as const;
export const STYLES = ["All", "Geometric", "Striped", "Traditional", "Minimalist"] as const;
export const SORTS = ["Featured", "Price: Low to High", "Price: High to Low"] as const;
export type Sort = (typeof SORTS)[number];

export function filterProducts(list: Product[], size: string, style: string, sort: Sort) {
  const out = list.filter((p) => (size === "All" || p.size === size) && (style === "All" || p.style === style));
  if (sort === "Price: Low to High") out.sort((a, b) => a.price - b.price);
  if (sort === "Price: High to Low") out.sort((a, b) => b.price - a.price);
  return out;
}

export const discount = (p: Product) => p.off;
export const sizeLabel = (s: string) => `${s.replace("x", " × ")} cm`;
export const formatEGP = (n: number) => `EGP ${n.toLocaleString("en-US")}`;
export const whatsappInquiry = (p: Product) =>
  `https://wa.me/201204846667?text=${encodeURIComponent(`Hello Oriental Corner, I'm interested in Kilim ${p.code} (${sizeLabel(p.size)}). Is it available?`)}`;
