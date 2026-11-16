import { useState } from "react";
import { Check, Minus, Plus, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatEGP, sizeLabel } from "@/lib/products";
import { AREAS, buildOrderMessage, logToGoogleSheets, newOrderId, orderSchema, whatsappLink, type OrderLine } from "@/lib/orders";
import { KilimImage } from "./KilimImage";

const field = "w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";

type Done = { id: string; total: number; link: string };

export function CartDrawer() {
  const { open, setOpen, lines, total, setQty, clear } = useCart();
  const [form, setForm] = useState({ name: "", mobile: "", area: "", address: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<Done | null>(null);
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = orderSchema.safeParse(form);
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setErrors({});
    const id = newOrderId();
    const snapshot: OrderLine[] = lines.map((l) => ({ ...l }));
    const link = whatsappLink(buildOrderMessage(r.data, snapshot, id));
    window.open(link, "_blank", "noopener");
    void logToGoogleSheets({
      type: "order",
      orderId: id,
      payment: "Cash on Delivery",
      customer: r.data,
      items: snapshot.map((l) => ({ code: l.product.code, size: l.product.size, qty: l.qty, unitPrice: l.product.price, lineTotal: l.product.price * l.qty })),
      totalEGP: total,
    });
    setDone({ id, total, link });
    clear();
    setForm({ name: "", mobile: "", area: "", address: "", notes: "" });
  };

  const close = () => {
    setOpen(false);
    if (done) setTimeout(() => setDone(null), 300);
  };

  return (
    <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div onClick={close} className={`absolute inset-0 bg-overlay transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside role="dialog" aria-label="Basket" className={`absolute right-0 top-0 flex h-full w-full flex-col border-l border-border bg-background transition-transform duration-300 ease-out sm:max-w-md ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-2xl">{done ? "Order received" : "Your Basket"}</h2>
          <button aria-label="Close basket" onClick={close}><X className="h-5 w-5" strokeWidth={1.4} /></button>
        </div>

        {done ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary text-primary"><Check className="h-6 w-6" strokeWidth={1.4} /></div>
            <h3 className="mt-6 text-3xl">Shukran — thank you.</h3>
            <p className="mt-3 text-sm text-muted-foreground">Your order <span className="font-mono text-foreground">{done.id}</span> for {formatEGP(done.total)} has been prepared. Send the WhatsApp message that just opened and we'll call you to confirm delivery.</p>
            <p className="mt-2 text-xs text-muted-foreground">Payment: cash on delivery.</p>
            <a href={done.link} target="_blank" rel="noreferrer" className="mt-8 w-full rounded-sm border border-foreground py-3 eyebrow transition-colors hover:bg-foreground hover:text-background">WhatsApp didn't open? Tap here</a>
            <button onClick={close} className="mt-3 eyebrow text-muted-foreground hover:text-foreground">Continue browsing</button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="px-5">
              {lines.length === 0 && <p className="py-10 text-sm text-muted-foreground">Your basket is empty.</p>}
              {lines.map(({ product: p, qty }) => (
                <div key={p.code} className="flex gap-4 border-b border-border py-4">
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded-sm"><KilimImage p={p} /></div>
                  <div className="flex-1 text-sm">
                    <p className="font-mono uppercase tracking-wider">{p.code}</p>
                    <p className="text-xs text-muted-foreground">{sizeLabel(p.size)}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-sm border border-border">
                        <button aria-label={`Decrease ${p.code}`} onClick={() => setQty(p.code, qty - 1)} className="px-2 py-1"><Minus className="h-3 w-3" /></button>
                        <span className="w-6 text-center text-xs">{qty}</span>
                        <button aria-label={`Increase ${p.code}`} onClick={() => setQty(p.code, qty + 1)} className="px-2 py-1"><Plus className="h-3 w-3" /></button>
                      </div>
                      <span>{formatEGP(p.price * qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {lines.length > 0 && (
              <form onSubmit={submit} noValidate className="space-y-3 bg-secondary px-5 py-6">
                <div className="mb-2 flex justify-between border-b border-border pb-4 text-sm"><span className="eyebrow">Subtotal</span><span className="font-medium">{formatEGP(total)}</span></div>
                <p className="eyebrow pt-2">Cash on Delivery details</p>
                {([
                  ["name", "Full name", "text", "name"],
                  ["mobile", "Mobile number", "tel", "tel"],
                ] as const).map(([k, label, type, ac]) => (
                  <label key={k} className="block">
                    <span className="mb-1 block text-xs text-muted-foreground">{label}</span>
                    <input type={type} autoComplete={ac} value={form[k]} onChange={set(k)} placeholder={k === "mobile" ? "01X XXXX XXXX" : ""} className={field} />
                    {errors[k] && <span className="mt-1 block text-xs text-destructive">{errors[k]}</span>}
                  </label>
                ))}
                <label className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">Governorate / Area</span>
                  <select value={form.area} onChange={set("area")} className={field}>
                    <option value="">Select…</option>
                    {AREAS.map((a) => <option key={a}>{a}</option>)}
                  </select>
                  {errors["area"] && <span className="mt-1 block text-xs text-destructive">{errors["area"]}</span>}
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">Detailed delivery address</span>
                  <textarea rows={2} value={form.address} onChange={set("address")} placeholder="Building, street, floor, apartment, landmark" className={field} />
                  {errors["address"] && <span className="mt-1 block text-xs text-destructive">{errors["address"]}</span>}
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">Delivery notes (optional)</span>
                  <textarea rows={2} value={form.notes} onChange={set("notes")} className={field} />
                </label>
                <button type="submit" className="mt-2 w-full rounded-sm bg-primary py-4 eyebrow text-primary-foreground transition-opacity hover:opacity-90">Confirm Order (Cash on Delivery)</button>
                <p className="text-center text-[0.7rem] text-muted-foreground">No account needed · Pay in cash when your kilim arrives</p>
              </form>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
