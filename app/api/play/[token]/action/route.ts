import { NextResponse, type NextRequest } from "next/server";
import {
  GameError,
  acknowledgeStuck,
  attempt,
  beginRounds,
  castVote,
  getView,
  keyAttempt,
  loadContext,
  pressStuck,
  setLanguage,
  startGame,
  submitChallenge,
  submitIntake,
  updateChallenge,
  requestHint,
} from "@/app/lib/game/service";
import { submitPayoutDetails } from "@/app/lib/game/payouts";
import { getClientIp, rateLimit } from "@/app/lib/rate-limit";
import type { IntakeKey } from "@/app/lib/game/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Submitting the challenge runs the judge call inline.
export const maxDuration = 60;

type Body =
  | { action: "language"; language: string }
  | { action: "vote"; world: string }
  | { action: "start" }
  | { action: "intake"; answers: Partial<Record<IntakeKey, string>> }
  | { action: "begin" }
  | { action: "attempt"; answer: string }
  | { action: "hint" }
  | { action: "stuck"; need?: string[] }
  | { action: "acknowledge" }
  | { action: "challenge"; text: string }
  | { action: "submitChallenge"; text?: string }
  | { action: "key"; values: string[] }
  | { action: "payout"; holderName: string; iban: string; country: string };

// Every in-game action, keyed by the player's personal token. The server is
// the authority: it validates phase, role (host / solver) and the data.
export async function POST(request: NextRequest, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  const rl = rateLimit(`play-action:${getClientIp(request.headers)}`, 120, 60_000);
  if (!rl.allowed) return NextResponse.json({ ok: false, code: "RATE_LIMITED" }, { status: 429 });

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, code: "BAD_REQUEST" }, { status: 400 });
  }

  const ctx = await loadContext(token);
  if (!ctx) return NextResponse.json({ ok: false, code: "NOT_FOUND" }, { status: 404 });

  let result: Record<string, unknown> = {};
  try {
    switch (body.action) {
      case "language":
        await setLanguage(ctx, String(body.language ?? ""));
        break;
      case "vote":
        await castVote(ctx, String(body.world ?? ""));
        break;
      case "start":
        await startGame(ctx);
        break;
      case "intake":
        await submitIntake(ctx, body.answers ?? {});
        break;
      case "begin":
        await beginRounds(ctx);
        break;
      case "attempt":
        result = await attempt(ctx, String(body.answer ?? ""));
        break;
      case "hint":
        await requestHint(ctx);
        break;
      case "stuck":
        await pressStuck(ctx, Array.isArray(body.need) ? body.need.map(String).slice(0, 5) : []);
        break;
      case "acknowledge":
        await acknowledgeStuck(ctx);
        break;
      case "challenge":
        await updateChallenge(ctx, String(body.text ?? ""));
        break;
      case "submitChallenge":
        await submitChallenge(ctx, typeof body.text === "string" ? body.text : undefined);
        break;
      case "key":
        result = await keyAttempt(ctx, Array.isArray(body.values) ? body.values.map(String) : []);
        break;
      case "payout":
        await submitPayoutDetails(ctx, { holderName: String(body.holderName ?? ""), iban: String(body.iban ?? ""), country: String(body.country ?? "") });
        break;
      default:
        return NextResponse.json({ ok: false, code: "UNKNOWN_ACTION" }, { status: 400 });
    }
  } catch (err) {
    if (err instanceof GameError) return NextResponse.json({ ok: false, code: err.code }, { status: err.status });
    console.error("[play] action failed", body.action, err);
    return NextResponse.json({ ok: false, code: "REQUEST_FAILED" }, { status: 500 });
  }

  // Fresh context so the view reflects the action (and any transition it triggered).
  const fresh = (await loadContext(token)) ?? ctx;
  const view = await getView(fresh);
  return NextResponse.json({ ok: true, ...result, view }, { headers: { "Cache-Control": "no-store" } });
}
