import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { EG_MOBILE, logToGoogleSheets, whatsappLink } from "@/lib/orders";

export const Route = createFileRoute("/showroom")({
  head: () => ({
    meta: [
      { title: "Visit Our Showroom — Masaken Sheraton, Cairo | Oriental Corner" },
      { name: "description", content: "See and feel our hand-woven kilims at 40 Kamal Hassan Ali, Masaken Sheraton, Cairo. Opening hours, map and contact." },
      { property: "og:title", content: "Visit the Oriental Corner Showroom" },
      { property: "og:description", content: "40 Kamal Hassan Ali, Masaken Sheraton, Cairo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Showroom,
});

const ADDRESS = "40 Kamal Hassan Ali, Masaken Sheraton, Cairo";
// TODO: confirm real opening hours with the owner.
const HOURS = [
  ["Saturday – Thursday", "11:00 – 22:00"],
  ["Friday", "15:00 – 22:00"],
];

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  mobile: z.string().trim().transform((v) => v.replace(/[\s-]/g, "")).pipe(z.string().regex(EG_MOBILE, "Enter a valid Egyptian mobile")),
  message: z.string().trim().min(5, "Please write a short message").max(1000),
});

const field = "w-full rounded-sm border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary";

function Showroom() {
  const [form, setForm] = useState({ name: "", mobile: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = contactSchema.safeParse(form);
    if (!r.success) return setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
    setErrors({});
    const text = `*Showroom enquiry — Oriental Corner*\nName: ${r.data.name}\nMobile: ${r.data.mobile}\n\n${r.data.message}`;
    window.open(whatsappLink(text), "_blank", "noopener");
    void logToGoogleSheets({ type: "contact", ...r.data });
    setSent(true);
  };

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-20">
        <p className="eyebrow text-muted-foreground">Visit the Showroom</p>
        <h1 className="mt-4 text-5xl md:text-6xl">Come feel the weave.</h1>
        <p className="mt-5 max-w-xl text-muted-foreground">Kilims are best chosen in person — see the true colours, feel the wool, and lay a few side by side.</p>
      </section>

      <section className="mx-auto mt-12 grid max-w-7xl gap-10 px-6 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-10">
          <div>
            <p className="eyebrow">Address</p>
            <p className="mt-3 font-serif text-2xl leading-snug">{ADDRESS}</p>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`} target="_blank" rel="noreferrer" className="mt-4 inline-block border-b border-foreground pb-0.5 text-sm">Get directions →</a>
          </div>
          <div>
            <p className="eyebrow">Opening hours</p>
            <dl className="mt-3 divide-y divide-border border-y border-border text-sm">
              {HOURS.map(([d, h]) => <div key={d} className="flex justify-between py-3"><dt>{d}</dt><dd className="text-muted-foreground">{h}</dd></div>)}
            </dl>
          </div>
          <div>
            <p className="eyebrow">Call or WhatsApp</p>
            <a href="https://wa.me/201204846667" className="mt-3 block font-serif text-2xl">+20 120 484 6667</a>
          </div>
        </div>
        <div className="min-h-[420px] overflow-hidden rounded-sm border border-border">
          <iframe title="Map to Oriental Corner showroom" src={`https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS)}&z=16&output=embed`} className="h-full min-h-[420px] w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="text-4xl">Send us a message</h2>
        <p className="mt-2 text-sm text-muted-foreground">Ask about a piece, a custom size, or book a visit.</p>
        {sent ? (
          <div className="mt-8 rounded-sm border border-border bg-secondary p-8 text-center">
            <p className="font-serif text-2xl">Thank you — your message is ready in WhatsApp.</p>
            <p className="mt-2 text-sm text-muted-foreground">Press send there and we'll reply shortly.</p>
            <button onClick={() => { setSent(false); setForm({ name: "", mobile: "", message: "" }); }} className="mt-5 eyebrow text-muted-foreground hover:text-foreground">Write another</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="mt-8 grid gap-4 sm:grid-cols-2">
            {(["name", "mobile"] as const).map((k) => (
              <label key={k} className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{k === "name" ? "Full name" : "Mobile number"}</span>
                <input type={k === "mobile" ? "tel" : "text"} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className={field} />
                {errors[k] && <span className="mt-1 block text-xs text-destructive">{errors[k]}</span>}
              </label>
            ))}
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-xs text-muted-foreground">Message</span>
              <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={field} />
              {errors["message"] && <span className="mt-1 block text-xs text-destructive">{errors["message"]}</span>}
            </label>
            <button type="submit" className="rounded-sm bg-primary py-4 eyebrow text-primary-foreground sm:col-span-2">Send message</button>
          </form>
        )}
      </section>
    </>
  );
}
