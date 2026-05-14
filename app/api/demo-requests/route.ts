import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServerClient } from "../../lib/supabase";
import { parseDemoRequest } from "../../lib/validation";
import { rateLimit, getClientIp } from "../../lib/rate-limit";
import type { DemoRequestInsert } from "../../types/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rl = rateLimit(`demo:${ip}`, 5, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  const form = await request.formData();

  if (typeof form.get("website") === "string" && String(form.get("website")).length > 0) {
    return NextResponse.json({ ok: true });
  }

  const { value, errors } = parseDemoRequest(form);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    console.warn("[demo-requests] Supabase not configured. Payload (not persisted):", value);
    return NextResponse.json({ ok: true, persisted: false });
  }

  const row: DemoRequestInsert = {
    ...value,
    source: "book-a-demo",
    user_agent: request.headers.get("user-agent") || null,
  };

  const { error } = await supabase.from("demo_requests").insert(row);
  if (error) {
    console.error("[demo-requests] insert error", error);
    return NextResponse.json(
      { ok: false, error: "We couldn't record your request. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, persisted: true });
}
