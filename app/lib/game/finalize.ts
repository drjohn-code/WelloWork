import { computeScores, type Contribution, type RoundOutcome } from "./scoring";
import { sendTransactionalEmail } from "../email";
import { decryptSecret } from "./payout-crypto";
import { playerJoinUrl } from "../player-invites";
import { renderBuyerSummary, renderGameResult } from "../emails/game";
import type { GameContext } from "./service";
import type { ChallengeVerdict, TemplateId } from "./types";
import type { Json } from "@/app/types/database";

/**
 * Runs once, by whichever request moved the game to `scorecard`: computes the
 * scores and the split, creates one payout row per player, and sends the
 * result emails (player share + personal link; buyer team summary).
 */
export async function finalizeGame(ctx: GameContext): Promise<void> {
  const { db, game, players, order } = ctx;

  const [{ data: rounds }, { data: contribs }, { data: events }] = await Promise.all([
    db.from("cognitive_rewards_game_rounds").select("*").eq("game_id", game.id).order("round_index"),
    db.from("cognitive_rewards_game_contributions").select("round_index, player_id, solver_player_id, kind").eq("game_id", game.id),
    db.from("cognitive_rewards_game_events").select("round_index, type, payload").eq("game_id", game.id).eq("type", "round_solved"),
  ]);

  const outcomes: RoundOutcome[] = (rounds ?? []).map((r) => {
    const solvedEvent = (events ?? []).find((e) => e.round_index === r.round_index);
    const disconnected = ((solvedEvent?.payload as { disconnected?: string[] } | null)?.disconnected ?? []) as string[];
    const start = r.started_at ? Date.parse(r.started_at) : 0;
    const end = r.ended_at ? Date.parse(r.ended_at) : start;
    return {
      index: r.round_index,
      template: r.template as TemplateId,
      solverPlayerId: r.solver_player_id,
      solved: r.status === "solved",
      solvedByReveal: r.solved_by_reveal,
      wrongAttempts: r.wrong_attempts,
      hintUsed: r.hint_used,
      stuck: Boolean(r.stuck_at),
      acknowledged: (r.acknowledged as unknown as string[]) ?? [],
      disconnected,
      durationSec: Math.max(0, (end - start) / 1000),
    };
  });

  const contributions: Contribution[] = (contribs ?? []).map((c) => ({
    roundIndex: c.round_index,
    playerId: c.player_id,
    solverPlayerId: c.solver_player_id,
    kind: c.kind as Contribution["kind"],
  }));

  const scores = computeScores({
    playerIds: players.map((p) => p.id),
    rounds: outcomes,
    contributions,
    keyAttempts: game.key_attempts,
    poolEur: order.reward_pool,
    seed: game.id,
  });

  await db.from("cognitive_rewards_game_scores").upsert(
    scores.map((s) => ({
      game_id: game.id,
      player_id: s.playerId,
      components: s.components as unknown as Json,
      total: s.total,
      share_eur: s.shareEur,
      rank: s.rank,
      highlights: [s.title] as unknown as Json,
    })),
    { onConflict: "game_id,player_id" }
  );
  await db.from("cognitive_rewards_payouts").upsert(
    scores.map((s) => ({ game_id: game.id, player_id: s.playerId, amount_eur: s.shareEur })),
    { onConflict: "game_id,player_id", ignoreDuplicates: true }
  );

  // Result emails — once.
  const { data: claimed } = await db
    .from("cognitive_rewards_games")
    .update({ result_emails_sent_at: new Date().toISOString() })
    .eq("id", game.id)
    .is("result_emails_sent_at", null)
    .select("id");
  if (!claimed || !claimed.length) return;

  const { data: playerRows } = await db
    .from("cognitive_rewards_order_players")
    .select("id, name, email, join_token_encrypted")
    .eq("order_id", order.id);
  const verdict = game.challenge_verdict as unknown as ChallengeVerdict | null;

  await Promise.allSettled(
    (playerRows ?? []).map(async (p) => {
      const score = scores.find((s) => s.playerId === p.id);
      if (!score) return;
      let link: string | null = null;
      try {
        if (p.join_token_encrypted) link = playerJoinUrl(decryptSecret(p.join_token_encrypted), order.locale);
      } catch {
        link = null;
      }
      const email = await renderGameResult({
        locale: order.locale,
        playerName: p.name,
        companyName: order.company_name,
        shareEur: score.shareEur,
        title: score.title,
        link,
      });
      await sendTransactionalEmail({ to: p.email, ...email, idempotencyKey: `cr-result/${game.id}/${p.id}` });
    })
  );

  const { data: buyer } = await db.from("cognitive_rewards_orders").select("buyer_email").eq("id", order.id).single();
  if (buyer?.buyer_email) {
    const email = await renderBuyerSummary({
      locale: order.locale,
      buyerName: order.buyer_name,
      companyName: order.company_name,
      poolEur: order.reward_pool,
      players: scores
        .slice()
        .sort((a, b) => a.rank - b.rank)
        .map((s) => ({ name: players.find((p) => p.id === s.playerId)?.name ?? "", shareEur: s.shareEur })),
      rubricTotal: verdict?.total ?? null,
      diagnostic: diagnostic(scores.map((s) => s.components)),
    });
    await sendTransactionalEmail({ to: buyer.buyer_email, ...email, idempotencyKey: `cr-buyer-summary/${game.id}` });
  }
}

/** Team-level strengths/growth areas from the component averages (no personal data). */
function diagnostic(components: Array<Record<string, number>>): { strength: string; growth: string } {
  const keys = ["dataTransfer", "teamwork", "problemSolving", "focus", "memory"] as const;
  const avg = Object.fromEntries(keys.map((k) => [k, components.reduce((a, c) => a + (c[k] ?? 0), 0) / Math.max(1, components.length)])) as Record<(typeof keys)[number], number>;
  const sorted = keys.slice().sort((a, b) => avg[b] - avg[a]);
  return { strength: sorted[0], growth: sorted[sorted.length - 1] };
}
