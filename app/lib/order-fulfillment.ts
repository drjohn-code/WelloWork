/**
 * Fulfillment seam. Called exactly once by the Stripe webhook handler
 * (app/api/stripe/webhook/route.ts) immediately after an order is marked
 * `paid` — never from the browser redirect. Log-only for now.
 *
 * TODO: trigger player invitations (email + OTP onboarding) — separate task.
 * Do not add email sending, payout, or player-onboarding logic here until
 * that task defines the actual flow.
 */
export async function onOrderPaid(orderId: string): Promise<void> {
  console.log(`[order-fulfillment] Order ${orderId} paid — fulfillment not yet implemented.`);
}
