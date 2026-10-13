import { NextResponse, type NextRequest } from "next/server";
import { getView, loadContext } from "@/app/lib/game/service";
import { getClientIp, rateLimit } from "@/app/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Content generation (one model call) can run inside a read when the last
// intake answer lands, so allow more than the default function time.
export const maxDuration = 60;

const NO_STORE = { "Cache-Control": "no-store" };

// Personalised game state for the owner of a personal join link. Polled by
// the lobby and game pages; also where server-side timeouts are applied.
export async function GET(request: NextRequest, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  const rl = rateLimit(`play:${getClientIp(request.headers)}`, 240, 60_000);
  if (!rl.allowed) return NextResponse.json({ ok: false, code: "RATE_LIMITED" }, { status: 429 });

  const ctx = await loadContext(token);
  if (!ctx) return NextResponse.json({ ok: false, code: "NOT_FOUND" }, { status: 404, headers: NO_STORE });
  try {
    const view = await getView(ctx);
    return NextResponse.json({ ok: true, view }, { headers: NO_STORE });
  } catch (err) {
    console.error("[play] view failed", err);
    return NextResponse.json({ ok: false, code: "REQUEST_FAILED" }, { status: 500, headers: NO_STORE });
  }
}
