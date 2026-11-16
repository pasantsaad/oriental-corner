import { z } from "zod";
import { formatEGP, sizeLabel, type Product } from "./products";

/**
 * Paste your Google Apps Script "Web app" URL here to log every order/message to Google Sheets.
 * Leave empty to skip logging. The script should read JSON from e.postData.contents.
 */
export const GOOGLE_SHEETS_WEBHOOK_URL = "";
export const SHOP_WHATSAPP = "201204846667";

export const AREAS = ["Cairo - Sheraton", "Cairo - Heliopolis / Nasr City", "New Cairo", "Giza", "Other Governorates"] as const;

// Egyptian mobile: 010/011/012/015 + 8 digits, optional +20 / 0020 prefix.
export const EG_MOBILE = /^(?:\+?20|0020)?0?1[0125]\d{8}$/;

export const orderSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  mobile: z.string().trim().transform((v) => v.replace(/[\s-]/g, "")).pipe(z.string().regex(EG_MOBILE, "Enter a valid Egyptian mobile, e.g. 01012345678")),
  area: z.enum(AREAS, { message: "Choose your area" }),
  address: z.string().trim().min(8, "Please add your detailed address").max(400),
  notes: z.string().trim().max(400).optional().default(""),
});
export type OrderCustomer = z.infer<typeof orderSchema>;
export type OrderLine = { product: Product; qty: number };

export function orderTotal(lines: OrderLine[]) {
  return lines.reduce((s, l) => s + l.product.price * l.qty, 0);
}

export function buildOrderMessage(c: OrderCustomer, lines: OrderLine[], orderId: string) {
  const items = lines
    .map((l, i) => `${i + 1}. ${l.product.code} | ${sizeLabel(l.product.size)} | Qty ${l.qty} | ${formatEGP(l.product.price * l.qty)}`)
    .join("\n");
  return [
    `*NEW ORDER — Oriental Corner*`,
    `Order: ${orderId}`,
    `Payment: Cash on Delivery`,
    ``,
    `*Items*`,
    items,
    ``,
    `*Total: ${formatEGP(orderTotal(lines))}*`,
    ``,
    `*Customer*`,
    `Name: ${c.name}`,
    `Mobile: ${c.mobile}`,
    `Area: ${c.area}`,
    `Address: ${c.address}`,
    ...(c.notes ? [`Notes: ${c.notes}`] : []),
  ].join("\n");
}

export const whatsappLink = (text: string) => `https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(text)}`;
export const newOrderId = () => `OC-${Date.now().toString(36).toUpperCase().slice(-6)}`;

/** Sends a JSON payload to the Google Sheets webhook. Never throws; returns whether it was sent. */
export async function logToGoogleSheets(payload: Record<string, unknown>): Promise<boolean> {
  if (!GOOGLE_SHEETS_WEBHOOK_URL) return false;
  try {
    // Apps Script web apps don't answer CORS preflights, so send as text/plain with no-cors.
    await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...payload, submittedAt: new Date().toISOString() }),
    });
    return true;
  } catch (e) {
    console.error("Google Sheets logging failed", e);
    return false;
  }
}
