import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, markPaid, verifyAdminSession } from "@/app/lib/game/payouts";

export const runtime = "nodejs";

// Marks a payout as paid (bank transfer done) and emails the player.
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!verifyAdminSession(request.cookies.get(ADMIN_COOKIE)?.value)) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await context.params;
  const { reference } = (await request.json().catch(() => ({}))) as { reference?: string };
  const ok = await markPaid(id, String(reference ?? ""));
  return NextResponse.json({ ok }, { status: ok ? 200 : 409 });
}
