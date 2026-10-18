import { createHash } from "crypto";
import { getSupabaseServerClient } from "../supabase";
import { hashJoinToken, isWellFormedJoinToken } from "../join-token";
import { PLAYABLE_ORDER_STATUSES } from "../player-invites";
import { isTeamSize } from "../cognitive-rewards-order";
import { generateRound, hintFor as templateHint, normalizeAnswer } from "./templates";
import { DETAIL_ROUND_INDEX, SURPRISE, TWIST, offerWorlds, planEpisode, tallyVotes, type PastEpisode, type WorldVote } from "./episode";
import { WORLDS, isWorldId, worldLabel, type WorldId } from "./worlds";
import { TALK_TEMPLATES, talkReveal, type TalkTemplate } from "./talk";
import { buildContent, cleanIntake, judgeChallenge } from "./game-master";
import { GAME_MASTER_BRIDGE_DIR } from "./openrouter";
import { TEXTS } from "./texts";
import { seededRng } from "./rng";
import { finalizeGame } from "./finalize";
import {
  INTAKE_OPTIONAL,
  INTAKE_QUESTIONS,
  toContentLanguage,
  type ChallengeVerdict,
  type ContentLanguage,
  type Fact,
  type GameContent,
  type GameView,
  type GeneratedRound,
  type IntakeKey,
  type IntakeSummary,
  type Piece,
  type PublicPrompt,
  type RoundSpec,
  type RoundView,
  type TalkLabels,
  type TemplateId,
} from "./types";
import { buildScorecardResult } from "./scorecard-view";
import { buildEpisodePath, teamStreak, type RoundSummaryRow } from "./path";
import type { Database, Json } from "@/app/types/database";

/**
 * Server-authoritative game state machine. Every entry point takes a player's
 * personal join token; a player only ever receives their own piece plus public
 * state. Phase transitions use conditional updates so concurrent requests
 * from several players can't double-advance.
 */

type DB = NonNullable<ReturnType<typeof getSupabaseServerClient>>;
type GameRow = Database["public"]["Tables"]["cognitive_rewards_games"]["Row"];
type RoundRow = Database["public"]["Tables"]["cognitive_rewards_game_rounds"]["Row"];
type PlayerRow = Pick<
  Database["public"]["Tables"]["cognitive_rewards_order_players"]["Row"],
  "id" | "name" | "role" | "joined_at" | "last_seen_at" | "created_at"
>;

export const TIMING = {
  intakeSec: 240,
  hintAfterSec: 90,
  roundCapSec: 270,
  reactionMs: 7000,
  challengeSec: 240,
  disconnectSec: 120,
  // A local Game Master bridge answers by hand, so don't re-run a generation that is still waiting for it.
  generatingRetrySec: GAME_MASTER_BRIDGE_DIR ? 1800 : 100,
  judgingRetrySec: GAME_MASTER_BRIDGE_DIR ? 1800 : 60,
  maxWrongAttempts: 5,
  rescueWindowSec: 60,
  presenceWriteSec: 15,
} as const;

export type GameContext = {
  db: DB;
  game: GameRow;
  me: PlayerRow;
  players: PlayerRow[];
  order: { id: string; status: string; locale: string | null; reward_pool: number; team_size: number; buyer_name: string; company_name: string };
};

export class GameError extends Error {
  constructor(public code: string, public status = 400) {
    super(code);
  }
}

/* ── Loading ────────────────────────────────────────────────────────────── */

export async function loadContext(token: string): Promise<GameContext | null> {
  if (!isWellFormedJoinToken(token)) return null;
  const db = getSupabaseServerClient();
  if (!db) return null;
  const { data: me } = await db
    .from("cognitive_rewards_order_players")
    .select("id, name, role, joined_at, last_seen_at, created_at, order_id")
    .eq("join_token_hash", hashJoinToken(token))
    .maybeSingle();
  if (!me) return null;

  const [{ data: order }, { data: players }] = await Promise.all([
    db
      .from("cognitive_rewards_orders")
      .select("id, status, locale, reward_pool, team_size, buyer_name, company_name")
      .eq("id", me.order_id)
      .maybeSingle(),
    db
      .from("cognitive_rewards_order_players")
      .select("id, name, role, joined_at, last_seen_at, created_at")
      .eq("order_id", me.order_id)
      .order("created_at", { ascending: true }),
  ]);
  if (!order || !players || !PLAYABLE_ORDER_STATUSES.includes(order.status as never) || !isTeamSize(order.team_size)) return null;

  let { data: game } = await db.from("cognitive_rewards_games").select("*").eq("order_id", order.id).maybeSingle();
  if (!game) {
    const { data: created } = await db
      .from("cognitive_rewards_games")
      .insert({ order_id: order.id, team_size: order.team_size, language: toContentLanguage(order.locale) })
      .select("*")
      .single();
    game = created ?? (await db.from("cognitive_rewards_games").select("*").eq("order_id", order.id).single()).data;
  }
  if (!game) return null;

  // Presence (throttled write).
  const lastSeen = me.last_seen_at ? Date.parse(me.last_seen_at) : 0;
  if (Date.now() - lastSeen > TIMING.presenceWriteSec * 1000) {
    const now = new Date().toISOString();
    await db.from("cognitive_rewards_order_players").update({ last_seen_at: now }).eq("id", me.id);
    me.last_seen_at = now;
    const mine = players.find((p) => p.id === me.id);
    if (mine) mine.last_seen_at = now;
  }

  return { db, game, me, players, order: { ...order, reward_pool: Number(order.reward_pool) } };
}

function isOnline(p: PlayerRow, now = Date.now()): boolean {
  return Boolean(p.last_seen_at) && now - Date.parse(p.last_seen_at!) < TIMING.disconnectSec * 1000;
}

async function logEvent(db: DB, gameId: string, type: string, extra: { roundIndex?: number | null; playerId?: string | null; payload?: Json } = {}) {
  await db.from("cognitive_rewards_game_events").insert({
    game_id: gameId,
    type,
    round_index: extra.roundIndex ?? null,
    player_id: extra.playerId ?? null,
    payload: extra.payload ?? null,
  });
}

/** Conditional phase transition; returns true if this request won it. */
async function transition(db: DB, gameId: string, from: GameRow["phase"], to: GameRow["phase"], patch: Partial<GameRow> = {}): Promise<boolean> {
  const { data } = await db
    .from("cognitive_rewards_games")
    .update({ ...(patch as object), phase: to, phase_started_at: new Date().toISOString() })
    .eq("id", gameId)
    .eq("phase", from)
    .select("id");
  return Boolean(data && data.length > 0);
}

/* ── Lobby actions ──────────────────────────────────────────────────────── */

/** "Join the game" in the lobby: an explicit click, never a side effect of opening the link. */
export async function joinLobby(ctx: GameContext): Promise<void> {
  if (ctx.me.joined_at) return;
  const now = new Date().toISOString();
  await ctx.db.from("cognitive_rewards_order_players").update({ joined_at: now }).eq("id", ctx.me.id).is("joined_at", null);
  ctx.me.joined_at = now;
  const mine = ctx.players.find((p) => p.id === ctx.me.id);
  if (mine) mine.joined_at = now;
  await logEvent(ctx.db, ctx.game.id, "player_joined", { playerId: ctx.me.id });
}

export async function assignHostIfReady(ctx: GameContext): Promise<void> {
  const { db, game, players } = ctx;
  if (game.host_player_id || game.phase !== "lobby") return;
  if (!players.every((p) => p.joined_at)) return;
  const rng = seededRng(`${game.id}:host`);
  const host = players[Math.floor(rng() * players.length)];
  const { data } = await db
    .from("cognitive_rewards_games")
    .update({ host_player_id: host.id })
    .eq("id", game.id)
    .is("host_player_id", null)
    .select("host_player_id");
  if (data && data.length) ctx.game.host_player_id = host.id;
  else ctx.game.host_player_id = (await db.from("cognitive_rewards_games").select("host_player_id").eq("id", game.id).single()).data?.host_player_id ?? null;
}

function requireHost(ctx: GameContext) {
  if (ctx.game.host_player_id !== ctx.me.id) throw new GameError("NOT_HOST", 403);
}

export async function setLanguage(ctx: GameContext, language: string): Promise<void> {
  requireHost(ctx);
  if (ctx.game.phase !== "lobby") throw new GameError("WRONG_PHASE");
  const lang: ContentLanguage = toContentLanguage(language);
  const stored = language === "sv" ? "sv" : language.length === 2 ? language : lang;
  await ctx.db.from("cognitive_rewards_games").update({ language: stored }).eq("id", ctx.game.id).eq("phase", "lobby");
}

export async function startGame(ctx: GameContext): Promise<void> {
  requireHost(ctx);
  if (ctx.game.phase !== "lobby") throw new GameError("WRONG_PHASE");
  if (!ctx.players.every((p) => p.joined_at)) throw new GameError("NOT_ALL_JOINED");
  const won = await transition(ctx.db, ctx.game.id, "lobby", "intake", { started_at: new Date().toISOString() } as Partial<GameRow>);
  if (won) await logEvent(ctx.db, ctx.game.id, "game_started", { playerId: ctx.me.id });
}

/* ── Episode: team history, world offer and vote ────────────────────────── */

/**
 * Finished games that share players with this one, newest first. Same set of
 * players = the same series (episode numbers continue); any overlap = worlds
 * to avoid offering again. Matched on the player emails the orders already
 * store; nothing new is collected.
 */
async function teamHistory(db: DB, orderId: string): Promise<PastEpisode[]> {
  const { data: mine } = await db.from("cognitive_rewards_order_players").select("email").eq("order_id", orderId);
  const emails = Array.from(new Set((mine ?? []).map((r) => r.email.trim().toLowerCase()).filter(Boolean)));
  if (!emails.length) return [];
  const { data: overlap } = await db.from("cognitive_rewards_order_players").select("order_id").in("email", emails).neq("order_id", orderId).limit(200);
  const orderIds = Array.from(new Set((overlap ?? []).map((r) => r.order_id)));
  if (!orderIds.length) return [];
  const [{ data: members }, { data: games }] = await Promise.all([
    db.from("cognitive_rewards_order_players").select("order_id, email").in("order_id", orderIds),
    db.from("cognitive_rewards_games").select("order_id, content, ended_at, phase").in("order_id", orderIds).in("phase", ["scorecard", "done"]),
  ]);
  const mineKey = emails.slice().sort().join("|");
  const keyOf = (id: string) =>
    Array.from(new Set((members ?? []).filter((m) => m.order_id === id).map((m) => m.email.trim().toLowerCase())))
      .sort()
      .join("|");
  return (games ?? [])
    .map((g): PastEpisode => {
      const ep = (g.content as unknown as GameContent | null)?.episode;
      // Games from before the episode engine count as an office episode.
      return {
        worldId: ep && isWorldId(ep.worldId) ? ep.worldId : "office",
        premise: ep?.premise ?? -1,
        title: ep?.title ?? WORLDS.office.label.en.name,
        number: ep?.number ?? 1,
        endedAt: g.ended_at ?? new Date(0).toISOString(),
        sameTeam: keyOf(g.order_id) === mineKey,
      };
    })
    .sort((a, b) => Date.parse(b.endedAt) - Date.parse(a.endedAt));
}

type OfferPayload = { offer: WorldId[]; episodeNumber: number; previousTitle: string | null };

/** The offer is computed once per game (when everyone has joined) and kept in the event log with the votes. */
async function lobbyEpisodeState(ctx: GameContext, create: boolean): Promise<{ offer: OfferPayload | null; votes: Record<string, WorldVote> }> {
  const { db, game } = ctx;
  const { data: events } = await db
    .from("cognitive_rewards_game_events")
    .select("type, player_id, payload, created_at")
    .eq("game_id", game.id)
    .in("type", ["episode_offer", "world_vote"])
    .order("created_at", { ascending: true });
  let offer = (events ?? []).find((e) => e.type === "episode_offer")?.payload as unknown as OfferPayload | undefined;
  if (!offer && create) {
    const history = await teamHistory(db, ctx.order.id);
    const series = history.filter((h) => h.sameTeam);
    offer = {
      offer: offerWorlds(game.id, history),
      episodeNumber: series.reduce((m, h) => Math.max(m, h.number), 0) + 1,
      previousTitle: series[0]?.title ?? null,
    };
    await logEvent(db, game.id, "episode_offer", { payload: offer as unknown as Json });
  }
  const votes: Record<string, WorldVote> = {};
  for (const e of events ?? []) {
    const w = (e.payload as { world?: string } | null)?.world;
    if (e.type === "world_vote" && e.player_id && (w === SURPRISE || isWorldId(w))) votes[e.player_id] = w as WorldVote;
  }
  return { offer: offer ?? null, votes };
}

export async function castVote(ctx: GameContext, world: string): Promise<void> {
  if (ctx.game.phase !== "lobby") throw new GameError("WRONG_PHASE");
  if (!ctx.players.every((p) => p.joined_at)) throw new GameError("NOT_ALL_JOINED");
  const { offer } = await lobbyEpisodeState(ctx, true);
  if (world !== SURPRISE && !(offer?.offer ?? []).includes(world as WorldId)) throw new GameError("BAD_WORLD");
  await logEvent(ctx.db, ctx.game.id, "world_vote", { playerId: ctx.me.id, payload: { world } });
}

/* ── Intake ─────────────────────────────────────────────────────────────── */

export async function submitIntake(ctx: GameContext, answers: Partial<Record<IntakeKey, string>>): Promise<void> {
  if (ctx.game.phase !== "intake") throw new GameError("WRONG_PHASE");
  const rows = INTAKE_QUESTIONS.flatMap((k) => {
    const a = (answers[k] ?? "").trim().slice(0, 200);
    if (!a) {
      if (!INTAKE_OPTIONAL.has(k)) throw new GameError("MISSING_ANSWER");
      return [];
    }
    return [{ game_id: ctx.game.id, player_id: ctx.me.id, question_key: k, answer: a }];
  });
  await ctx.db.from("cognitive_rewards_game_intake").upsert(rows, { onConflict: "game_id,player_id,question_key" });
  await logEvent(ctx.db, ctx.game.id, "intake_submitted", { playerId: ctx.me.id });
}

async function intakeSubmitters(db: DB, gameId: string): Promise<string[]> {
  const { data } = await db.from("cognitive_rewards_game_events").select("player_id").eq("game_id", gameId).eq("type", "intake_submitted");
  return Array.from(new Set((data ?? []).map((e) => e.player_id).filter((x): x is string => Boolean(x))));
}

async function maybeStartGeneration(ctx: GameContext): Promise<void> {
  const { db, game, players } = ctx;
  if (game.phase === "intake") {
    const submitted = await intakeSubmitters(db, game.id);
    const deadlinePassed = Date.now() - Date.parse(game.phase_started_at) > TIMING.intakeSec * 1000;
    const allIn = players.every((p) => submitted.includes(p.id));
    if (!allIn && !(deadlinePassed && submitted.length > 0)) return;
    if (!(await transition(db, game.id, "intake", "generating"))) return;
  } else if (game.phase === "generating") {
    // Recovery: a generation that died (timeout) is retried after a grace period.
    if (Date.now() - Date.parse(game.phase_started_at) < TIMING.generatingRetrySec * 1000) return;
    const { data } = await db
      .from("cognitive_rewards_games")
      .update({ phase_started_at: new Date().toISOString() })
      .eq("id", game.id)
      .eq("phase", "generating")
      .lt("phase_started_at", new Date(Date.now() - TIMING.generatingRetrySec * 1000).toISOString())
      .select("id");
    if (!data || !data.length) return;
  } else return;

  await generate(ctx);
}

async function generate(ctx: GameContext): Promise<void> {
  const { db, game, players, order } = ctx;
  const language = toContentLanguage(game.language);
  const T = TEXTS[language];

  // Intake → cleaned → canonical answer per question.
  const { data: rows } = await db.from("cognitive_rewards_game_intake").select("player_id, question_key, answer").eq("game_id", game.id);
  const raw = Object.fromEntries(INTAKE_QUESTIONS.map((k) => [k, [] as string[]])) as Record<IntakeKey, string[]>;
  for (const r of rows ?? []) if ((INTAKE_QUESTIONS as readonly string[]).includes(r.question_key)) raw[r.question_key as IntakeKey].push(r.answer);
  const cleaned = await cleanIntake(raw);
  const rng = seededRng(`${game.id}:intake`);
  const intake: IntakeSummary = {
    canonical: Object.fromEntries(
      INTAKE_QUESTIONS.map((k) => [k, cleaned[k].length ? cleaned[k][Math.floor(rng() * cleaned[k].length)] : T.intakeDefaults[k]])
    ) as Record<IntakeKey, string>,
    all: cleaned,
  };

  // Episode: world from the team's vote, premise, round plan with twists (deterministic).
  const playerList = players.map((p) => ({ id: p.id, name: p.name.trim().split(/\s+/)[0] || p.name }));
  const history = await teamHistory(db, order.id);
  const lobby = await lobbyEpisodeState(ctx, false);
  const offer = lobby.offer?.offer ?? offerWorlds(game.id, history);
  const chosenWorld = tallyVotes(game.id, offer, lobby.votes, game.host_player_id);
  const plan = planEpisode({ gameId: game.id, playerIds: players.map((p) => p.id), worldId: chosenWorld, history });
  const { schedule, detailHolderId } = plan;

  // Game Master content first: the rounds use its in-world names (skin).
  const hasManagers = players.some((p) => p.role !== "staff");
  const { content, source, error } = await buildContent({
    language,
    intake,
    playerNames: playerList.map((p) => p.name),
    schedule,
    hasManagers,
    episode: { worldId: plan.worldId, premise: plan.premise, number: plan.number, previous: plan.previous },
  });
  if (error) console.warn("[game] content generation fell back", game.id, error);
  const worldId = content.episode?.worldId ?? "office";

  // All rounds (deterministic, validated).
  const priorFacts: Array<Fact & { roundIndex: number; holderId?: string }> = [];
  const generated: Array<{ spec: RoundSpec; round: GeneratedRound }> = [];
  for (const spec of schedule) {
    const round = generateRound(spec.template, {
      gameId: game.id,
      roundIndex: spec.index,
      language,
      players: playerList,
      solverId: spec.solverPlayerId,
      intake,
      priorFacts,
      detailHolderId: spec.detail ? detailHolderId : undefined,
      worldId,
      skin: content.skin,
    });
    generated.push({ spec, round });
    for (const f of round.params.facts) if (!priorFacts.some((pf) => pf.key === f.key)) priorFacts.push({ ...f, roundIndex: spec.index });
    if (round.params.detail) {
      priorFacts.push({ key: "note", label: "note", value: String(round.params.detail.value), roundIndex: spec.index, holderId: round.params.detail.playerId });
    }
  }

  // Key ceremony = three facts the team found; the hour is always one (round 1 is always the calendar).
  const keyFacts = KEY_FACT_ORDER.map((k) => priorFacts.find((f) => f.key === k))
    .filter((f): f is NonNullable<typeof f> => Boolean(f))
    .slice(0, 3);
  const keyHash = hashAnswer(game.id, keyFacts.map((f) => normalizeAnswer(f.value)).join("|"));

  await db.from("cognitive_rewards_game_rounds").delete().eq("game_id", game.id);
  const { error: insertError } = await db.from("cognitive_rewards_game_rounds").insert(
    generated.map(({ spec, round }) => ({
      game_id: game.id,
      round_index: spec.index,
      template: spec.template,
      solver_player_id: spec.solverPlayerId,
      params: round.params as unknown as Json,
      pieces: round.pieces as unknown as Json,
      public_prompt: round.publicPrompt as unknown as Json,
      answer_hash: hashAnswer(game.id, round.answer),
    }))
  );
  if (insertError) throw new Error(`round insert failed: ${insertError.message}`);

  await db
    .from("cognitive_rewards_games")
    .update({
      schedule: schedule as unknown as Json,
      content: content as unknown as Json,
      content_source: source,
      key_facts: keyFacts.map((f) => ({ label: f.label, value: f.value })) as unknown as Json,
      key_hash: keyHash,
      phase: "briefing",
      phase_started_at: new Date().toISOString(),
    })
    .eq("id", game.id)
    .eq("phase", "generating");
  await logEvent(db, game.id, "content_generated", {
    payload: { source, players: order.team_size, world: worldId, voted: chosenWorld, episode: plan.number, templates: schedule.map((s) => s.template), twists: schedule.filter((s) => s.twist).map((s) => `${s.index}:${s.twist}`) },
  });
}

const KEY_FACT_ORDER = ["hour", "snackTotal", "wifi", "lineup", "desks"];

/** Round timing, adjusted by the round's twist. */
function timingFor(spec: RoundSpec | undefined): { capSec: number; hintSec: number } {
  if (spec?.twist === "rush") return { capSec: TWIST.rushCapSec, hintSec: TWIST.rushHintSec };
  return { capSec: TIMING.roundCapSec, hintSec: TIMING.hintAfterSec };
}
function specFor(game: GameRow, index: number): RoundSpec | undefined {
  return (game.schedule as unknown as RoundSpec[]).find((s) => s.index === index);
}
function maxWrongFor(round: RoundRow): number {
  return (round.public_prompt as unknown as PublicPrompt).maxWrong ?? TIMING.maxWrongAttempts;
}

function hashAnswer(gameId: string, answer: string): string {
  return createHash("sha256").update(`${gameId}:${normalizeAnswer(answer)}`).digest("hex");
}

/* ── Rounds ─────────────────────────────────────────────────────────────── */

export async function beginRounds(ctx: GameContext): Promise<void> {
  requireHost(ctx);
  if (ctx.game.phase !== "briefing") throw new GameError("WRONG_PHASE");
  if (await transition(ctx.db, ctx.game.id, "briefing", "round", { current_round: 0 } as Partial<GameRow>)) {
    await activateRound(ctx.db, ctx.game.id, 0);
  }
}

async function activateRound(db: DB, gameId: string, index: number) {
  await db
    .from("cognitive_rewards_game_rounds")
    .update({ status: "active", started_at: new Date().toISOString() })
    .eq("game_id", gameId)
    .eq("round_index", index)
    .eq("status", "pending");
  await logEvent(db, gameId, "round_started", { roundIndex: index });
}

async function currentRound(db: DB, game: GameRow): Promise<RoundRow | null> {
  const { data } = await db.from("cognitive_rewards_game_rounds").select("*").eq("game_id", game.id).eq("round_index", game.current_round).maybeSingle();
  return data;
}

export async function attempt(ctx: GameContext, rawAnswer: string): Promise<{ correct: boolean }> {
  const { db, game, me } = ctx;
  if (game.phase !== "round") throw new GameError("WRONG_PHASE");
  const round = await currentRound(db, game);
  if (!round || round.status !== "active") throw new GameError("ROUND_NOT_ACTIVE");
  if (round.solver_player_id !== me.id) throw new GameError("NOT_SOLVER", 403);
  const answer = normalizeAnswer(rawAnswer).slice(0, 40);
  if (!answer) throw new GameError("EMPTY");
  const correct = hashAnswer(game.id, answer) === round.answer_hash;
  await logEvent(db, game.id, "attempt", { roundIndex: round.round_index, playerId: me.id, payload: { correct } });

  if (!correct) {
    const wrong = round.wrong_attempts + 1;
    await db
      .from("cognitive_rewards_game_rounds")
      .update({ attempts: round.attempts + 1, wrong_attempts: wrong })
      .eq("id", round.id);
    if (wrong >= maxWrongFor(round)) await failRound(ctx, round, "attempts");
    return { correct: false };
  }

  const now = Date.now();
  const { data: won } = await db
    .from("cognitive_rewards_game_rounds")
    .update({ status: "solved", ended_at: new Date(now).toISOString(), attempts: round.attempts + 1 })
    .eq("id", round.id)
    .eq("status", "active")
    .select("id");
  if (!won || !won.length) return { correct: true };

  // Contributions: every connected source whose piece was necessary.
  const disconnected = ctx.players.filter((p) => p.id !== me.id && !isOnline(p, now)).map((p) => p.id);
  const ledger: Array<{ player_id: string; kind: string }> = [];
  if (round.template === "callback") {
    // Credit the holder of the sticky note and the solver of the referenced hour round.
    const { data: hourRound } = await db
      .from("cognitive_rewards_game_rounds")
      .select("solver_player_id, params")
      .eq("game_id", game.id)
      .eq("template", "slot")
      .order("round_index", { ascending: true })
      .limit(1)
      .maybeSingle();
    const { data: detailRound } = await db
      .from("cognitive_rewards_game_rounds")
      .select("params")
      .eq("game_id", game.id)
      .eq("round_index", DETAIL_ROUND_INDEX)
      .maybeSingle();
    const holder = (detailRound?.params as unknown as GeneratedRound["params"] | null)?.detail?.playerId;
    if (holder && holder !== me.id) ledger.push({ player_id: holder, kind: "detail" });
    if (hourRound?.solver_player_id && hourRound.solver_player_id !== me.id) ledger.push({ player_id: hourRound.solver_player_id, kind: "callback_source" });
  } else {
    for (const p of ctx.players) {
      if (p.id === me.id || disconnected.includes(p.id)) continue;
      ledger.push({ player_id: p.id, kind: "assist" });
    }
    const acked = (round.acknowledged as unknown as string[]) ?? [];
    if (round.stuck_at && acked.length) {
      const { data: lastAck } = await db
        .from("cognitive_rewards_game_events")
        .select("created_at")
        .eq("game_id", game.id)
        .eq("round_index", round.round_index)
        .eq("type", "stuck_acknowledged")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (lastAck && now - Date.parse(lastAck.created_at) <= TIMING.rescueWindowSec * 1000) {
        for (const id of acked) if (!disconnected.includes(id)) ledger.push({ player_id: id, kind: "rescue" });
      }
    }
  }
  if (ledger.length) {
    await db.from("cognitive_rewards_game_contributions").insert(
      ledger.map((l) => ({ game_id: game.id, round_index: round.round_index, player_id: l.player_id, solver_player_id: me.id, kind: l.kind }))
    );
  }
  await logEvent(db, game.id, "round_solved", { roundIndex: round.round_index, playerId: me.id, payload: { disconnected } });
  return { correct: true };
}

async function failRound(ctx: GameContext, round: RoundRow, reason: "attempts" | "timeout") {
  const { data } = await ctx.db
    .from("cognitive_rewards_game_rounds")
    .update({ status: "failed", ended_at: new Date().toISOString(), solved_by_reveal: true })
    .eq("id", round.id)
    .eq("status", "active")
    .select("id");
  if (data && data.length) await logEvent(ctx.db, ctx.game.id, "round_failed", { roundIndex: round.round_index, payload: { reason } });
}

export async function requestHint(ctx: GameContext): Promise<void> {
  const round = await currentRound(ctx.db, ctx.game);
  if (!round || round.status !== "active" || ctx.game.phase !== "round") throw new GameError("ROUND_NOT_ACTIVE");
  if (round.solver_player_id !== ctx.me.id) throw new GameError("NOT_SOLVER", 403);
  if (!round.started_at || Date.now() - Date.parse(round.started_at) < timingFor(specFor(ctx.game, round.round_index)).hintSec * 1000) throw new GameError("HINT_NOT_YET");
  if (round.hint_used) return;
  await ctx.db.from("cognitive_rewards_game_rounds").update({ hint_used: true }).eq("id", round.id);
  await logEvent(ctx.db, ctx.game.id, "hint_used", { roundIndex: round.round_index, playerId: ctx.me.id });
}

/** "I'm stuck": the solver can say whose piece they need again (empty = everyone). */
export async function pressStuck(ctx: GameContext, need: string[] = []): Promise<void> {
  const round = await currentRound(ctx.db, ctx.game);
  if (!round || round.status !== "active" || ctx.game.phase !== "round") throw new GameError("ROUND_NOT_ACTIVE");
  if (round.solver_player_id !== ctx.me.id) throw new GameError("NOT_SOLVER", 403);
  if (round.stuck_at) return;
  const others = new Set(ctx.players.filter((p) => p.id !== ctx.me.id).map((p) => p.id));
  const targets = Array.from(new Set(need.filter((id) => others.has(id))));
  await ctx.db.from("cognitive_rewards_game_rounds").update({ stuck_at: new Date().toISOString() }).eq("id", round.id);
  await logEvent(ctx.db, ctx.game.id, "stuck_pressed", { roundIndex: round.round_index, playerId: ctx.me.id, payload: { need: targets } });
}

async function stuckNeed(db: DB, gameId: string, roundIndex: number): Promise<string[]> {
  const { data } = await db
    .from("cognitive_rewards_game_events")
    .select("payload")
    .eq("game_id", gameId)
    .eq("round_index", roundIndex)
    .eq("type", "stuck_pressed")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const need = (data?.payload as { need?: unknown } | null)?.need;
  return Array.isArray(need) ? need.filter((x): x is string => typeof x === "string") : [];
}

export async function acknowledgeStuck(ctx: GameContext): Promise<void> {
  const round = await currentRound(ctx.db, ctx.game);
  if (!round || round.status !== "active" || ctx.game.phase !== "round") throw new GameError("ROUND_NOT_ACTIVE");
  if (round.solver_player_id === ctx.me.id || !round.stuck_at) throw new GameError("NOTHING_TO_ACKNOWLEDGE");
  const acked = (round.acknowledged as unknown as string[]) ?? [];
  if (acked.includes(ctx.me.id)) return;
  await ctx.db
    .from("cognitive_rewards_game_rounds")
    .update({ acknowledged: [...acked, ctx.me.id] as unknown as Json })
    .eq("id", round.id);
  await logEvent(ctx.db, ctx.game.id, "stuck_acknowledged", { roundIndex: round.round_index, playerId: ctx.me.id });
}

/** Round timeouts and the post-reaction advance; called on every read. */
async function advanceRounds(ctx: GameContext): Promise<void> {
  const { db, game } = ctx;
  const round = await currentRound(db, game);
  if (!round) return;
  const now = Date.now();
  if (round.status === "active" && round.started_at && now - Date.parse(round.started_at) > timingFor(specFor(game, round.round_index)).capSec * 1000) {
    await failRound(ctx, round, "timeout");
    return;
  }
  if ((round.status === "solved" || round.status === "failed") && round.ended_at && now - Date.parse(round.ended_at) > TIMING.reactionMs) {
    const schedule = game.schedule as unknown as RoundSpec[];
    const next = round.round_index + 1;
    if (next < schedule.length) {
      const { data } = await db
        .from("cognitive_rewards_games")
        .update({ current_round: next, phase_started_at: new Date().toISOString() })
        .eq("id", game.id)
        .eq("current_round", round.round_index)
        .eq("phase", "round")
        .select("id");
      if (data && data.length) {
        ctx.game.current_round = next;
        await activateRound(db, game.id, next);
      }
    } else {
      await transition(db, game.id, "round", "challenge");
    }
  }
}

/* ── Challenge, judging, key ────────────────────────────────────────────── */

export async function updateChallenge(ctx: GameContext, text: string): Promise<void> {
  requireHost(ctx);
  if (ctx.game.phase !== "challenge") throw new GameError("WRONG_PHASE");
  await ctx.db.from("cognitive_rewards_games").update({ challenge_text: text.slice(0, 600) }).eq("id", ctx.game.id).eq("phase", "challenge");
}

export async function submitChallenge(ctx: GameContext, text?: string): Promise<void> {
  if (ctx.game.phase !== "challenge") throw new GameError("WRONG_PHASE");
  if (text !== undefined) {
    requireHost(ctx);
    await updateChallenge(ctx, text);
  }
  if (await transition(ctx.db, ctx.game.id, "challenge", "judging")) await judge(ctx);
}

async function maybeJudge(ctx: GameContext) {
  const { db, game } = ctx;
  if (game.phase === "challenge") {
    if (Date.now() - Date.parse(game.phase_started_at) > TIMING.challengeSec * 1000) {
      if (await transition(db, game.id, "challenge", "judging")) await judge(ctx);
    }
  } else if (game.phase === "judging" && Date.now() - Date.parse(game.phase_started_at) > TIMING.judgingRetrySec * 1000) {
    const { data } = await db
      .from("cognitive_rewards_games")
      .update({ phase_started_at: new Date().toISOString() })
      .eq("id", game.id)
      .eq("phase", "judging")
      .lt("phase_started_at", new Date(Date.now() - TIMING.judgingRetrySec * 1000).toISOString())
      .select("id");
    if (data && data.length) await judge(ctx);
  }
}

async function judge(ctx: GameContext) {
  const { db, game } = ctx;
  const { data: fresh } = await db.from("cognitive_rewards_games").select("challenge_text, content, language").eq("id", game.id).single();
  const language = toContentLanguage(fresh?.language ?? game.language);
  const content = (fresh?.content as unknown as GameContent | null) ?? TEXTS[language].fallback;
  const { data: rows } = await db.from("cognitive_rewards_game_intake").select("question_key, answer").eq("game_id", game.id);
  const all = Object.fromEntries(INTAKE_QUESTIONS.map((k) => [k, [] as string[]])) as Record<IntakeKey, string[]>;
  for (const r of rows ?? []) if ((INTAKE_QUESTIONS as readonly string[]).includes(r.question_key)) all[r.question_key as IntakeKey].push(r.answer);
  const canonical = Object.fromEntries(INTAKE_QUESTIONS.map((k) => [k, all[k][0] ?? TEXTS[language].intakeDefaults[k]])) as Record<IntakeKey, string>;
  const verdict = await judgeChallenge({ language, prompt: content.challengePrompt, text: fresh?.challenge_text ?? "", intake: { canonical, all } });
  await db
    .from("cognitive_rewards_games")
    .update({ challenge_verdict: verdict as unknown as Json, phase: "key", phase_started_at: new Date().toISOString() })
    .eq("id", game.id)
    .eq("phase", "judging");
}

export async function keyAttempt(ctx: GameContext, values: string[]): Promise<{ correct: boolean }> {
  const { db, game, me } = ctx;
  if (game.phase !== "key") throw new GameError("WRONG_PHASE");
  const facts = (game.key_facts as unknown as Array<{ label: string; value: string }>) ?? [];
  const entered = values.slice(0, facts.length).map((v) => normalizeAnswer(String(v ?? "")));
  const correct = hashAnswer(game.id, entered.join("|")) === game.key_hash;
  await logEvent(db, game.id, "key_entered", { playerId: me.id, payload: { correct } });
  if (!correct) {
    const attempts = game.key_attempts + 1;
    const revealed = attempts >= 5 ? facts.length : attempts >= 3 ? 1 : 0;
    await db.from("cognitive_rewards_games").update({ key_attempts: attempts, key_revealed: Math.max(game.key_revealed, revealed) }).eq("id", game.id);
    return { correct: false };
  }
  const correctPlayers = await keyCorrectPlayers(db, game.id);
  if (ctx.players.every((p) => correctPlayers.includes(p.id))) {
    if (await transition(db, game.id, "key", "scorecard", { ended_at: new Date().toISOString() } as Partial<GameRow>)) {
      await finalizeGame(ctx);
    }
  }
  return { correct: true };
}

async function keyCorrectPlayers(db: DB, gameId: string): Promise<string[]> {
  const { data } = await db.from("cognitive_rewards_game_events").select("player_id, payload").eq("game_id", gameId).eq("type", "key_entered");
  return Array.from(
    new Set((data ?? []).filter((e) => (e.payload as { correct?: boolean } | null)?.correct).map((e) => e.player_id).filter((x): x is string => Boolean(x)))
  );
}

/* ── View ───────────────────────────────────────────────────────────────── */

export async function getView(ctx: GameContext): Promise<GameView> {
  await assignHostIfReady(ctx);
  // Server-driven progress: timeouts and post-reaction advances happen on read.
  if (ctx.game.phase === "intake" || ctx.game.phase === "generating") await maybeStartGeneration(ctx);
  if (ctx.game.phase === "round") await advanceRounds(ctx);
  if (ctx.game.phase === "challenge" || ctx.game.phase === "judging") await maybeJudge(ctx);
  // Re-read after any transition.
  const { data: fresh } = await ctx.db.from("cognitive_rewards_games").select("*").eq("id", ctx.game.id).single();
  if (fresh) ctx.game = fresh;

  const { db, game, me, players, order } = ctx;
  const now = Date.now();
  const host = players.find((p) => p.id === game.host_player_id) ?? null;
  const language = toContentLanguage(game.language);
  const content = (game.content as unknown as GameContent | null) ?? TEXTS[language].fallback;

  const view: GameView = {
    phase: game.phase,
    finished: false,
    testGame: order.status === "mock_paid",
    language: game.language,
    teamSize: order.team_size,
    pool: order.reward_pool,
    buyerName: order.buyer_name,
    companyName: order.company_name,
    me: { id: me.id, name: me.name, isHost: game.host_player_id === me.id },
    host: host ? { id: host.id, name: host.name } : null,
    players: players.map((p) => ({ id: p.id, name: p.name, joined: Boolean(p.joined_at), online: isOnline(p, now), isHost: p.id === game.host_player_id })),
    serverNow: new Date(now).toISOString(),
    lobby: null,
    episode: null,
    intake: null,
    briefing: null,
    round: null,
    challenge: null,
    key: null,
    scorecard: null,
  };

  if (game.phase === "lobby" && host && players.every((p) => p.joined_at)) {
    const { offer, votes } = await lobbyEpisodeState(ctx, true);
    if (offer) {
      const ids = offer.offer.filter(isWorldId);
      const leading = Object.values(votes).some((v) => v !== SURPRISE) ? tallyVotes(game.id, ids, votes, game.host_player_id) : null;
      view.lobby = {
        offer: ids.map((id) => ({ id, ...worldLabel(id, language) })),
        votes,
        leading,
        episodeNumber: offer.episodeNumber,
        previousTitle: offer.previousTitle,
      };
    }
  }
  const ep = content.episode;
  if (ep && game.phase !== "lobby" && game.phase !== "intake" && game.phase !== "generating") {
    view.episode = { worldId: ep.worldId, worldName: worldLabel(ep.worldId, language).name, number: ep.number, title: ep.title, previously: ep.previously, teaser: ep.teaser };
  }

  if (game.phase === "intake") {
    const [submitted, { data: mine }] = await Promise.all([
      intakeSubmitters(db, game.id),
      db.from("cognitive_rewards_game_intake").select("question_key, answer").eq("game_id", game.id).eq("player_id", me.id),
    ]);
    view.intake = {
      submitted,
      deadlineAt: new Date(Date.parse(game.phase_started_at) + TIMING.intakeSec * 1000).toISOString(),
      mine: submitted.includes(me.id) ? Object.fromEntries((mine ?? []).map((r) => [r.question_key, r.answer])) : null,
    };
  } else if (game.phase === "briefing") {
    view.briefing = { text: content.briefing, isHost: view.me.isHost };
  } else if (game.phase === "round") {
    const [round, { data: summary }] = await Promise.all([
      currentRound(db, game),
      db.from("cognitive_rewards_game_rounds").select("round_index, status, wrong_attempts, hint_used").eq("game_id", game.id),
    ]);
    if (round) view.round = buildRoundView(ctx, round, content, language, now, round.stuck_at ? await stuckNeed(db, game.id, round.round_index) : [], summary ?? []);
  } else if (game.phase === "challenge" || game.phase === "judging") {
    view.challenge = {
      prompt: content.challengePrompt,
      text: game.challenge_text ?? "",
      isHost: view.me.isHost,
      deadlineAt: new Date(Date.parse(game.phase_started_at) + TIMING.challengeSec * 1000).toISOString(),
    };
  } else if (game.phase === "key") {
    const facts = (game.key_facts as unknown as Array<{ label: string; value: string }>) ?? [];
    const correctPlayers = await keyCorrectPlayers(db, game.id);
    const { data: lastWrong } = await db
      .from("cognitive_rewards_game_events")
      .select("created_at, payload")
      .eq("game_id", game.id)
      .eq("type", "key_entered")
      .eq("player_id", me.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    view.key = {
      intro: game.key_revealed > 0 ? `${content.keyIntro} ${content.keyReveal}` : content.keyIntro,
      blanks: facts.map((f, i) => ({ label: f.label, value: i < game.key_revealed ? f.value : null })),
      enteredCorrectly: correctPlayers,
      attempts: game.key_attempts,
      lastWrongAt: lastWrong && !(lastWrong.payload as { correct?: boolean } | null)?.correct ? lastWrong.created_at : null,
    };
  } else if (game.phase === "scorecard" || game.phase === "done") {
    const [{ data: scores }, { data: payout }] = await Promise.all([
      db.from("cognitive_rewards_game_scores").select("player_id, share_eur, components, highlights").eq("game_id", game.id),
      db.from("cognitive_rewards_payouts").select("amount_eur, status, iban_last4").eq("game_id", game.id).eq("player_id", me.id).maybeSingle(),
    ]);
    // Link lifetime: once the player has been paid, or 30 days after the game, the link only says "finished".
    const endedMs = game.ended_at ? Date.parse(game.ended_at) : now;
    if (payout?.status === "paid" || now - endedMs > 30 * 86_400_000) {
      view.finished = true;
      return view;
    }
    view.scorecard = {
      outro: content.outro,
      verdict: (game.challenge_verdict as unknown as ChallengeVerdict | null) ?? null,
      ...buildScorecardResult({ meId: me.id, players, scores: scores ?? [] }),
      payout: payout ? { amountEur: payout.amount_eur, status: payout.status, last4: payout.iban_last4 } : null,
    };
  }
  return view;
}

function buildRoundView(ctx: GameContext, round: RoundRow, content: GameContent, language: ContentLanguage, now: number, need: string[], summary: RoundSummaryRow[]): RoundView {
  const { game, me, players } = ctx;
  const schedule = game.schedule as unknown as RoundSpec[];
  const rc = content.rounds[round.round_index] ?? TEXTS[language].fallback.rounds[round.round_index];
  const pieces = round.pieces as unknown as Record<string, Piece>;
  const params = round.params as unknown as GeneratedRound["params"];
  const solver = players.find((p) => p.id === round.solver_player_id)!;
  const isSolver = solver.id === me.id;
  const startedAt = round.started_at ?? new Date(now).toISOString();
  const startedMs = Date.parse(startedAt);
  const status = round.status === "solved" ? "solved" : round.status === "failed" ? "failed" : "active";
  const spec = schedule.find((s) => s.index === round.round_index);
  const timing = timingFor(spec);
  const twist = spec?.twist ?? null;
  // Flash twist: sources see their piece for a few seconds, then describe it from memory.
  const hidesAtMs = twist === "flash" && !isSolver ? startedMs + TWIST.flashSec * 1000 : null;
  const pieceHidden = hidesAtMs !== null && status === "active" && now >= hidesAtMs;

  let reaction: string | null = null;
  let revealedAnswer: string | null = null;
  if (status === "failed") {
    reaction = rc.reactions.failed;
    revealedAnswer = revealAnswer(round, language);
  } else if (status === "solved" && round.ended_at) {
    const fast = Date.parse(round.ended_at) - startedMs <= timing.hintSec * 1000 && !round.hint_used;
    reaction = fast ? rc.reactions.fast : rc.reactions.slow;
  }

  const revealedPieces = isSolver
    ? players.filter((p) => p.id !== me.id && !isOnline(p, now) && pieces[p.id] && pieces[p.id].kind !== "none").map((p) => ({ name: p.name, piece: pieces[p.id] }))
    : [];

  const detail = params.detail && params.detail.playerId === me.id && status === "active" ? { text: params.detail.text, shownAt: startedAt } : null;
  const prompt = round.public_prompt as unknown as PublicPrompt;
  const path = buildEpisodePath(schedule, summary);

  return {
    index: round.round_index,
    total: schedule.length,
    template: round.template as TemplateId,
    title: rc.title,
    setup: rc.setup,
    solver: { id: solver.id, name: solver.name },
    isSolver,
    prompt,
    myPiece: pieceHidden ? null : pieces[me.id] ?? null,
    revealedPieces,
    detail,
    twist,
    pieceHidesAt: hidesAtMs !== null && status === "active" ? new Date(hidesAtMs).toISOString() : null,
    pieceHidden,
    labels: isTalkTemplate(round.template) ? talkLabels(language) : null,
    status,
    startedAt,
    hintAvailableAt: new Date(startedMs + timing.hintSec * 1000).toISOString(),
    capAt: new Date(startedMs + timing.capSec * 1000).toISOString(),
    hint: round.hint_used ? hintFor(round, language) : null,
    stuck: Boolean(round.stuck_at),
    stuckNeed: need,
    stuckNudge: round.stuck_at && status === "active" ? rc.stuck : null,
    acknowledgedByMe: ((round.acknowledged as unknown as string[]) ?? []).includes(me.id),
    acknowledgedCount: ((round.acknowledged as unknown as string[]) ?? []).length,
    attemptsLeft: Math.max(0, maxWrongFor(round) - round.wrong_attempts),
    wrongAttempts: round.wrong_attempts,
    reaction,
    revealedAnswer,
    nextAt: round.ended_at ? new Date(Date.parse(round.ended_at) + TIMING.reactionMs).toISOString() : null,
    path,
    streak: teamStreak(path),
  };
}

function isTalkTemplate(t: string): t is TalkTemplate {
  return (TALK_TEMPLATES as readonly string[]).includes(t);
}

function talkLabels(language: ContentLanguage): TalkLabels {
  const T = TEXTS[language].talk;
  return { colors: T.colors, cards: T.cards, emptyTile: T.emptyTile };
}

/** What the failure screen shows: the plain answer, or for talk rounds a readable version of it. */
function revealAnswer(round: RoundRow, language: ContentLanguage): string {
  if (isTalkTemplate(round.template)) return talkReveal(round.template, language, round.params as Record<string, unknown>, plainAnswer(round));
  return plainAnswer(round);
}

/**
 * The plain answer is never stored, but it is fully determined by the stored
 * params/pieces, so it can be recomputed for hints and the failure reveal.
 */
function plainAnswer(round: RoundRow): string {
  const pieces = round.pieces as unknown as Record<string, Piece>;
  const params = round.params as unknown as GeneratedRound["params"] & { hours?: number[]; referencedValues?: number[]; revealCard?: string; grid?: number[][] };
  if (round.template === "common") return String(params.revealCard ?? "");
  if (round.template === "blueprint") return (params.grid ?? []).flat().join("");
  if (params.facts?.length) return params.facts[0].value;
  switch (round.template as TemplateId) {
    case "slot": {
      const free = (params.hours ?? []).filter((h) => Object.values(pieces).every((p) => p.kind === "calendar" && !p.busy.includes(h)));
      return String(free[0] ?? "");
    }
    case "replyall": {
      const times = Object.values(pieces)
        .flatMap((p) => (p.kind === "messages" ? p.items : []))
        .map((m) => m.time)
        .sort();
      return times.length ? times[0].slice(3) + times[times.length - 1].slice(3) : "";
    }
    case "callback":
      return String((params.referencedValues ?? []).reduce((a, b) => a + b, 0));
    default:
      return "";
  }
}

function hintFor(round: RoundRow, language: ContentLanguage): string {
  return templateHint(round.template as TemplateId, language, plainAnswer(round), round.params as Record<string, unknown>);
}
