import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { products } from "@/lib/products";
import { CartDrawer } from "./CartDrawer";

const ticker = "WHITE FRIDAY SALE: UP TO 50% OFF HANDCRAFTED KILIMS  •  VISIT OUR MASAKEN SHERATON SHOWROOM  •  CAIRO & NATIONWIDE DELIVERY  •  ";
export const WA = "https://wa.me/201204846667";

export function Marquee() {
  return (
    <div className="overflow-hidden bg-foreground py-2 text-background">
      <div className="flex w-max animate-marquee whitespace-pre eyebrow">
        {[0, 1, 2, 3].map((i) => <span key={i}>{ticker}</span>)}
      </div>
    </div>
  );
}

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop Kilims" },
  { to: "/craft", label: "Our Craft" },
  { to: "/showroom", label: "Showroom" },
] as const;

export function Header() {
  const { count, setOpen } = useCart();
  const [searching, setSearching] = useState(false);
  const [q, setQ] = useState("");
  const hits = q ? products.filter((p) => p.code.toLowerCase().includes(q.toLowerCase())) : [];
  return (
    <>
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="leading-none">
          <span className="block font-serif text-2xl tracking-[0.18em]">ORIENTAL CORNER</span>
          <span className="eyebrow mt-1 block text-[0.6rem] text-muted-foreground">Handcrafted in Egypt · أورينتال كورنر</span>
        </Link>
        <nav className="hidden gap-9 md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="eyebrow text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }} activeOptions={{ exact: true }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-5">
          <button aria-label="Search" onClick={() => setSearching((s) => !s)}><Search className="h-[18px] w-[18px]" strokeWidth={1.4} /></button>
          <button aria-label="Open cart" onClick={() => setOpen(true)} className="relative">
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.4} />
            <span className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-sm bg-primary px-1 text-[0.6rem] text-primary-foreground">{count}</span>
          </button>
        </div>
      </div>
      {searching && (
        <div className="border-t border-border bg-secondary">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or code, e.g. OR 0561" className="w-full border-b border-foreground/30 bg-transparent py-2 font-serif text-xl outline-none" />
            {hits.map((p) => (
              <Link key={p.code} to="/shop/$slug" params={{ slug: p.slug }} onClick={() => setSearching(false)} className="flex justify-between border-b border-border py-2 text-sm">
                <span>{p.code}</span><span className="text-muted-foreground">{p.size} cm</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
    <CartDrawer />
    </>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <p className="font-serif text-2xl tracking-[0.18em]">ORIENTAL CORNER</p>
          <p className="mt-3 text-sm text-muted-foreground">Authentic Egyptian hand-woven kilims and artisanal rugs.</p>
        </div>
        <div><p className="eyebrow mb-4">Showroom</p><p className="text-sm text-muted-foreground">40 Kamal Hassan Ali<br />Masaken Sheraton, Cairo</p></div>
        <div><p className="eyebrow mb-4">Delivery</p><p className="text-sm text-muted-foreground">Cairo & Giza delivery<br />Nationwide shipping across Egypt</p></div>
        <div>
          <p className="eyebrow mb-4">Contact</p>
          <a href={WA} className="block text-sm text-muted-foreground hover:text-foreground">WhatsApp +20 120 484 6667</a>
          <a href="https://www.facebook.com" className="block text-sm text-muted-foreground hover:text-foreground">Facebook</a>
          <a href="https://www.instagram.com" className="block text-sm text-muted-foreground hover:text-foreground">Instagram</a>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Oriental Corner · Handcrafted in Egypt</div>
    </footer>
  );
}

export function WhatsAppButton() {
  return (
    <a href={WA} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-md transition-transform hover:scale-105">
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
    </a>
  );
}
