import { sendOrderInvitations } from "./player-invites";

/** Thrown when some invitations couldn't be delivered — the webhook turns it into a retry. */
export class InviteDeliveryError extends Error {
  constructor(orderId: string, failed: number) {
    super(`${failed} invitation email(s) failed for order ${orderId}`);
    this.name = "InviteDeliveryError";
  }
}

/**
 * Fulfillment seam. Called by the Stripe webhook handler
 * (app/api/stripe/webhook/route.ts) once an order is `paid` — never from the
 * browser redirect — and again on any redelivery of the same event, which is
 * safe: sendOrderInvitations only emails players not yet invited.
 *
 * Emails each player their personal lobby link (/play/<token>) and the buyer
 * a confirmation. Throws InviteDeliveryError if any send failed, so the
 * webhook responds 5xx and Stripe retries (with backoff, for up to 3 days).
 */
export async function onOrderPaid(orderId: string): Promise<void> {
  const result = await sendOrderInvitations(orderId);
  console.log(`[order-fulfillment] Order ${orderId} invitations`, result);
  if (result.failed > 0) throw new InviteDeliveryError(orderId, result.failed);
}
