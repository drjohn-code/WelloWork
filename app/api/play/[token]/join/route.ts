import { NextResponse, type NextRequest } from "next/server";
import { getView, joinLobby, loadContext } from "@/app/lib/game/service";
import { getClientIp, rateLimit } from "@/app/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// "Join the game" — an explicit POST, never a side effect of opening the link,
// because mail security scanners prefetch links in invitation emails.
export async function POST(request: NextRequest, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  const rl = rateLimit(`lobby-join:${getClientIp(request.headers)}`, 20, 60_000);
  if (!rl.allowed) return NextResponse.json({ ok: false, code: "RATE_LIMITED" }, { status: 429 });

  const ctx = await loadContext(token);
  if (!ctx) return NextResponse.json({ ok: false, code: "NOT_FOUND" }, { status: 404 });
  await joinLobby(ctx);
  const view = await getView(ctx);
  return NextResponse.json({ ok: true, view }, { headers: { "Cache-Control": "no-store" } });
}
