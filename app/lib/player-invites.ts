import { getSupabaseServerClient } from "./supabase";
import { sendTransactionalEmail } from "./email";
import { generateJoinToken } from "./join-token";
import { encryptSecret } from "./game/payout-crypto";
import { SITE_URL, localizedPath } from "./site";
import { renderBuyerConfirmation, renderPlayerInvite } from "./emails/cognitive-rewards";
import { isTeamSize } from "./cognitive-rewards-order";
import { ENABLED_LOCALES, defaultLocale, type AppLocale } from "@/i18n/locales";
import type { CognitiveRewardsOrderStatus } from "@/app/types/database";

/** Orders whose players may be invited and may enter the lobby. */
// TEMPORARY - MOCK PAYMENT, REMOVE BEFORE PROD: drop "mock_paid" with the mock flow.
export const PLAYABLE_ORDER_STATUSES: CognitiveRewardsOrderStatus[] = ["paid", "mock_paid"];

/** A claim older than this is treated as abandoned (crashed send) and can be retaken. */
const CLAIM_TTL_MS = 10 * 60_000;

export type InviteRunResult = { sent: number; failed: number; skipped: number; buyerNotified: boolean };

export function playerJoinUrl(token: string, locale: string | null): string {
  const loc: AppLocale = locale && (ENABLED_LOCALES as string[]).includes(locale) ? (locale as AppLocale) : defaultLocale;
  return `${SITE_URL}${localizedPath(`/play/${token}`, loc)}`;
}

/**
 * Emails every not-yet-invited player of a paid order their personal join
 * link, then (once all players are invited) sends the buyer one confirmation.
 *
 * Safe to call repeatedly and concurrently: each player row is claimed with a
 * conditional update before sending, a successful send is recorded in
 * `invited_at`, and Resend idempotency keys drop accidental duplicates. A
 * failed send releases the claim so the next run (Stripe webhook retry)
 * picks it up again.
 */
export async function sendOrderInvitations(orderId: string): Promise<InviteRunResult> {
  const result: InviteRunResult = { sent: 0, failed: 0, skipped: 0, buyerNotified: false };
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { data: order, error: orderError } = await supabase
    .from("cognitive_rewards_orders")
    .select("id, status, locale, buyer_name, buyer_email, company_name, team_size, reward_pool, buyer_notified_at")
    .eq("id", orderId)
    .maybeSingle();
  if (orderError || !order) throw new Error(`Order ${orderId} not found`);
  if (!PLAYABLE_ORDER_STATUSES.includes(order.status)) {
    console.warn("[invites] order not in a playable status — no invites sent", orderId, order.status);
    return result;
  }
  if (!isTeamSize(order.team_size)) throw new Error(`Order ${orderId} has invalid team size ${order.team_size}`);
  const teamSize = order.team_size;
  const rewardPoolEur = Number(order.reward_pool);

  const { data: players, error: playersError } = await supabase
    .from("cognitive_rewards_order_players")
    .select("id, name, email, invited_at, created_at")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });
  if (playersError || !players) throw new Error(`Players for order ${orderId} could not be loaded`);

  for (const player of players) {
    if (player.invited_at) {
      result.skipped++;
      continue;
    }

    // Claim the row (and set the new token hash) atomically, so two webhook
    // deliveries racing each other can't both email this player.
    const { token, hash } = generateJoinToken();
    const staleBefore = new Date(Date.now() - CLAIM_TTL_MS).toISOString();
    const { data: claimed } = await supabase
      .from("cognitive_rewards_order_players")
      .update({
        invite_claimed_at: new Date().toISOString(),
        join_token_hash: hash,
        // Lets the result email carry the player's personal link later; same key as payouts.
        join_token_encrypted: process.env.PAYOUT_ENCRYPTION_KEY ? encryptSecret(token) : null,
      })
      .eq("id", player.id)
      .is("invited_at", null)
      .or(`invite_claimed_at.is.null,invite_claimed_at.lt.${staleBefore}`)
      .select("id");
    if (!claimed || claimed.length === 0) {
      result.skipped++;
      continue;
    }

    const email = await renderPlayerInvite({
      locale: order.locale,
      playerName: player.name,
      buyerName: order.buyer_name,
      companyName: order.company_name,
      teamSize,
      rewardPoolEur,
      joinUrl: playerJoinUrl(token, order.locale),
    });
    const sent = await sendTransactionalEmail({
      to: player.email,
      ...email,
      // Tied to this token, so a retry with a fresh token isn't swallowed as a duplicate.
      idempotencyKey: `cr-invite/${player.id}/${hash.slice(0, 16)}`,
    });

    if (sent.ok) {
      result.sent++;
      await supabase
        .from("cognitive_rewards_order_players")
        .update({ invited_at: new Date().toISOString(), invite_email_id: sent.id, invite_error: null })
        .eq("id", player.id);
    } else {
      result.failed++;
      console.error("[invites] player invite failed", { orderId, playerId: player.id, error: sent.error });
      await supabase
        .from("cognitive_rewards_order_players")
        .update({ invite_claimed_at: null, invite_error: sent.error.slice(0, 500) })
        .eq("id", player.id);
    }
  }

  // Buyer confirmation: only once every player has actually been invited.
  const { count: notYetInvited } = await supabase
    .from("cognitive_rewards_order_players")
    .select("id", { count: "exact", head: true })
    .eq("order_id", orderId)
    .is("invited_at", null);
  if (notYetInvited === 0 && !order.buyer_notified_at) {
    const { data: claimedOrder } = await supabase
      .from("cognitive_rewards_orders")
      .update({ buyer_notified_at: new Date().toISOString() })
      .eq("id", orderId)
      .is("buyer_notified_at", null)
      .select("id");
    if (claimedOrder && claimedOrder.length > 0) {
      const email = await renderBuyerConfirmation({
        locale: order.locale,
        buyerName: order.buyer_name,
        companyName: order.company_name,
        teamSize,
        rewardPoolEur,
        playerNames: players.map((p) => p.name),
      });
      const sent = await sendTransactionalEmail({
        to: order.buyer_email,
        ...email,
        idempotencyKey: `cr-buyer-confirmation/${orderId}`,
      });
      if (sent.ok) {
        result.buyerNotified = true;
      } else {
        result.failed++;
        console.error("[invites] buyer confirmation failed", { orderId, error: sent.error });
        await supabase.from("cognitive_rewards_orders").update({ buyer_notified_at: null }).eq("id", orderId);
      }
    }
  }

  return result;
}
