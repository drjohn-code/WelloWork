import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, createAdminSession, isAdminConfigured } from "@/app/lib/game/payouts";
import { getClientIp, rateLimit } from "@/app/lib/rate-limit";

export const runtime = "nodejs";

/** Setup check: says whether ADMIN_SECRET is set on this server. Never reveals anything about its value. */
export async function GET() {
  return NextResponse.json({ ok: true, configured: isAdminConfigured() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) return NextResponse.json({ ok: false, code: "NOT_CONFIGURED" }, { status: 503 });
  const rl = rateLimit(`admin-login:${getClientIp(request.headers)}`, 5, 15 * 60_000);
  if (!rl.allowed) return NextResponse.json({ ok: false, code: "RATE_LIMITED" }, { status: 429 });
  const { secret } = (await request.json().catch(() => ({}))) as { secret?: string };
  const session = createAdminSession(String(secret ?? ""));
  if (!session) return NextResponse.json({ ok: false, code: "INVALID" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, session, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 12 * 3600 });
  return res;
}
