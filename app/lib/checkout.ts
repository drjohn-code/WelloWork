/**
 * The payment seam. `createOrder` (app/api/orders/route.ts) returns a pending
 * orderId; this calls POST /api/orders/[orderId]/checkout (app/api/orders/
 * [orderId]/checkout/route.ts) to create a real Stripe Checkout Session and
 * hands back its hosted `url`. The wizard redirects the browser there
 * directly — no Stripe.js / publishable key needed.
 */

export type InitiateCheckoutResult = { ok: true; url: string } | { ok: false; code: string };

export async function initiateCheckout(orderId: string, locale: string): Promise<InitiateCheckoutResult> {
  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale }),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string; code?: string };
    if (res.ok && data.ok && data.url) {
      return { ok: true, url: data.url };
    }
    return { ok: false, code: data.code ?? "REQUEST_FAILED" };
  } catch {
    return { ok: false, code: "NETWORK" };
  }
}
