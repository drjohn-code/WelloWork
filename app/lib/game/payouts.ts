import { createHmac, timingSafeEqual } from "crypto";
import { getSupabaseServerClient } from "../supabase";
import { sendTransactionalEmail } from "../email";
import { decryptSecret, encryptSecret, normalizeIban } from "./payout-crypto";
import { renderPayoutReceived, renderPayoutSent } from "../emails/game";
import { GameError, type GameContext } from "./service";

/* ── Player side ────────────────────────────────────────────────────────── */

export async function submitPayoutDetails(ctx: GameContext, input: { holderName: string; iban: string; country: string }): Promise<void> {
  const { db, game, me, order } = ctx;
  if (game.phase !== "scorecard" && game.phase !== "done") throw new GameError("WRONG_PHASE");
  if (order.status === "mock_paid") throw new GameError("TEST_GAME");
  const holderName = input.holderName.trim().slice(0, 120);
  const country = input.country.trim().toUpperCase().slice(0, 2);
  const iban = normalizeIban(input.iban);
  if (holderName.length < 2) throw new GameError("INVALID_NAME");
  if (!iban) throw new GameError("INVALID_IBAN");
  if (!/^[A-Z]{2}$/.test(country)) throw new GameError("INVALID_COUNTRY");

  const { data: payout } = await db.from("cognitive_rewards_payouts").select("id, status, amount_eur").eq("game_id", game.id).eq("player_id", me.id).maybeSingle();
  if (!payout) throw new GameError("NO_PAYOUT", 404);
  if (payout.status === "paid") throw new GameError("ALREADY_PAID");

  await db
    .from("cognitive_rewards_payouts")
    .update({
      holder_name: holderName,
      iban_encrypted: encryptSecret(iban),
      iban_last4: iban.slice(-4),
      country,
      status: "ready",
      details_at: new Date().toISOString(),
    })
    .eq("id", payout.id);

  const { data: player } = await db.from("cognitive_rewards_order_players").select("email").eq("id", me.id).single();
  if (player?.email) {
    const email = await renderPayoutReceived({ locale: order.locale, playerName: me.name, amountEur: payout.amount_eur, last4: iban.slice(-4) });
    await sendTransactionalEmail({ to: player.email, ...email, idempotencyKey: `cr-payout-received/${payout.id}/${iban.slice(-4)}` });
  }
}

/* ── Admin side ─────────────────────────────────────────────────────────── */

const COOKIE = "cr_admin";
const SESSION_HOURS = 12;

function adminSecret(): string | null {
  return process.env.ADMIN_SECRET?.trim() || null;
}

/** Stateless signed session: HMAC(expiry) under ADMIN_SECRET. */
export function createAdminSession(secret: string): string | null {
  const expected = adminSecret();
  if (!expected || secret.length !== expected.length || !timingSafeEqual(Buffer.from(secret), Buffer.from(expected))) return null;
  const exp = Date.now() + SESSION_HOURS * 3600_000;
  return `${exp}.${createHmac("sha256", expected).update(String(exp)).digest("hex")}`;
}

export function verifyAdminSession(cookie: string | undefined): boolean {
  const expected = adminSecret();
  if (!expected || !cookie) return false;
  const [exp, sig] = cookie.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const good = createHmac("sha256", expected).update(exp).digest("hex");
  return sig.length === good.length && timingSafeEqual(Buffer.from(sig), Buffer.from(good));
}

export const ADMIN_COOKIE = COOKIE;

export type AdminPayoutRow = {
  id: string;
  status: "awaiting_details" | "ready" | "paid";
  amountEur: number;
  holderName: string | null;
  last4: string | null;
  country: string | null;
  detailsAt: string | null;
  paidAt: string | null;
  reference: string | null;
  playerName: string;
  playerEmail: string;
  companyName: string;
  gameEndedAt: string | null;
  gameId: string;
};

export async function listPayouts(): Promise<AdminPayoutRow[]> {
  const db = getSupabaseServerClient();
  if (!db) return [];
  const { data: payouts } = await db.from("cognitive_rewards_payouts").select("*").order("created_at", { ascending: false }).limit(500);
  if (!payouts?.length) return [];
  const gameIds = Array.from(new Set(payouts.map((p) => p.game_id)));
  const playerIds = Array.from(new Set(payouts.map((p) => p.player_id)));
  const [{ data: games }, { data: players }] = await Promise.all([
    db.from("cognitive_rewards_games").select("id, order_id, ended_at").in("id", gameIds),
    db.from("cognitive_rewards_order_players").select("id, name, email").in("id", playerIds),
  ]);
  const orderIds = Array.from(new Set((games ?? []).map((g) => g.order_id)));
  const { data: orders } = await db.from("cognitive_rewards_orders").select("id, company_name").in("id", orderIds);
  return payouts.map((p) => {
    const g = (games ?? []).find((x) => x.id === p.game_id);
    const o = (orders ?? []).find((x) => x.id === g?.order_id);
    const pl = (players ?? []).find((x) => x.id === p.player_id);
    return {
      id: p.id,
      status: p.status,
      amountEur: p.amount_eur,
      holderName: p.holder_name,
      last4: p.iban_last4,
      country: p.country,
      detailsAt: p.details_at,
      paidAt: p.paid_at,
      reference: p.payment_reference,
      playerName: pl?.name ?? "",
      playerEmail: pl?.email ?? "",
      companyName: o?.company_name ?? "",
      gameEndedAt: g?.ended_at ?? null,
      gameId: p.game_id,
    };
  });
}

export async function revealIban(payoutId: string): Promise<string | null> {
  const db = getSupabaseServerClient();
  if (!db) return null;
  const { data } = await db.from("cognitive_rewards_payouts").select("iban_encrypted, game_id").eq("id", payoutId).maybeSingle();
  if (!data?.iban_encrypted) return null;
  await db.from("cognitive_rewards_game_events").insert({ game_id: data.game_id, type: "admin_iban_revealed", payload: { payoutId } });
  return decryptSecret(data.iban_encrypted);
}

export async function markPaid(payoutId: string, reference: string): Promise<boolean> {
  const db = getSupabaseServerClient();
  if (!db) return false;
  const { data } = await db
    .from("cognitive_rewards_payouts")
    .update({ status: "paid", paid_at: new Date().toISOString(), payment_reference: reference.trim().slice(0, 120) || null })
    .eq("id", payoutId)
    .eq("status", "ready")
    .select("id, player_id, amount_eur, game_id, iban_last4");
  const p = data?.[0];
  if (!p) return false;
  const [{ data: player }, { data: game }] = await Promise.all([
    db.from("cognitive_rewards_order_players").select("name, email").eq("id", p.player_id).single(),
    db.from("cognitive_rewards_games").select("order_id").eq("id", p.game_id).single(),
  ]);
  const { data: order } = game ? await db.from("cognitive_rewards_orders").select("locale").eq("id", game.order_id).single() : { data: null };
  if (player?.email) {
    const email = await renderPayoutSent({ locale: order?.locale ?? null, playerName: player.name, amountEur: p.amount_eur, last4: p.iban_last4 });
    await sendTransactionalEmail({ to: player.email, ...email, idempotencyKey: `cr-payout-sent/${p.id}` });
  }
  return true;
}

/** Wipes IBAN ciphertext for payouts paid more than 30 days ago. Called opportunistically from the admin page. */
export async function purgeOldIbans(): Promise<number> {
  const db = getSupabaseServerClient();
  if (!db) return 0;
  const cutoff = new Date(Date.now() - 30 * 86_400_000).toISOString();
  const { data } = await db
    .from("cognitive_rewards_payouts")
    .update({ iban_encrypted: null })
    .eq("status", "paid")
    .lt("paid_at", cutoff)
    .not("iban_encrypted", "is", null)
    .select("id");
  return data?.length ?? 0;
}
