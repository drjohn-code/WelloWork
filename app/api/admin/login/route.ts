import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, createAdminSession } from "@/app/lib/game/payouts";
import { getClientIp, rateLimit } from "@/app/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const rl = rateLimit(`admin-login:${getClientIp(request.headers)}`, 5, 15 * 60_000);
  if (!rl.allowed) return NextResponse.json({ ok: false, code: "RATE_LIMITED" }, { status: 429 });
  const { secret } = (await request.json().catch(() => ({}))) as { secret?: string };
  const session = createAdminSession(String(secret ?? ""));
  if (!session) return NextResponse.json({ ok: false, code: "INVALID" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, session, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 12 * 3600 });
  return res;
}
