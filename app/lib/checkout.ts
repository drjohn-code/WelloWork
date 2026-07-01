import type { OrderPricing } from "./cognitive-rewards-order";

/**
 * The payment seam. `createOrder` (app/api/orders/route.ts) returns a pending
 * orderId; this stub hands off to the placeholder payment page instead of a
 * real checkout. TODO(next task): replace the body of `initiateCheckout` with
 * a call that creates a Stripe Checkout Session for `orderId` and redirects
 * the browser there — the wizard itself should not need to change.
 */

const STORAGE_PREFIX = "wellowork:cr-order:";

export type CheckoutHandoff = {
  orderId: string;
  pricing: OrderPricing;
  teamSize: number;
  buyerCompany: string;
};

function storageKey(orderId: string): string {
  return `${STORAGE_PREFIX}${orderId}`;
}

/** Stashes the order summary so the payment placeholder page can render it without re-fetching. */
export function stashCheckoutHandoff(handoff: CheckoutHandoff): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(storageKey(handoff.orderId), JSON.stringify(handoff));
  } catch {
    // sessionStorage unavailable (private mode) — the payment page falls back to its "summary unavailable" state.
  }
}

export function readCheckoutHandoff(orderId: string): CheckoutHandoff | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(storageKey(orderId));
    return raw ? (JSON.parse(raw) as CheckoutHandoff) : null;
  } catch {
    return null;
  }
}

/** TODO(next task): swap this stub for a real Stripe Checkout redirect keyed on orderId. */
export function initiateCheckout(handoff: CheckoutHandoff, navigate: (path: string) => void): void {
  stashCheckoutHandoff(handoff);
  navigate(`/cognitive-rewards/order/payment?orderId=${encodeURIComponent(handoff.orderId)}`);
}
