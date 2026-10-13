import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, revealIban, verifyAdminSession } from "@/app/lib/game/payouts";
import { formatIbanGrouped } from "@/app/lib/game/payout-crypto";

export const runtime = "nodejs";

// Decrypts one IBAN for the admin, and logs the reveal.
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!verifyAdminSession(request.cookies.get(ADMIN_COOKIE)?.value)) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await context.params;
  const iban = await revealIban(id);
  if (!iban) return NextResponse.json({ ok: false, code: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json({ ok: true, iban: formatIbanGrouped(iban) }, { headers: { "Cache-Control": "no-store" } });
}
