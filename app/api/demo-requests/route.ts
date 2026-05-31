import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServerClient } from "../../lib/supabase";
import { parseDemoRequest, FORM_ERROR_CODE } from "../../lib/validation";
import { rateLimit, getClientIp } from "../../lib/rate-limit";
import { sendDemoFallbackConfirmation } from "../../lib/email";
import type { DemoBookingInsert } from "../../types/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Fallback demo-request endpoint used when the Cal.com embed is not configured.
// Rows land in `demo_bookings` with source='fallback_form'. The legacy
// `demo_requests` table is no longer written to by this route — see migration
// 20260514_000003_demo_bookings.sql for the rationale.

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rl = rateLimit(`demo:${ip}`, 5, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, code: FORM_ERROR_CODE.RATE_LIMITED },
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

  const preferredTimeframe =
    typeof form.get("preferred_timeframe") === "string"
      ? String(form.get("preferred_timeframe")).trim().slice(0, 200) || null
      : null;

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    console.warn("[demo-requests] Supabase not configured. Payload (not persisted):", value);
  } else {
    const row: DemoBookingInsert = {
      source: "fallback_form",
      attendee_name: value.name,
      attendee_email: value.work_email,
      company: value.company || null,
      company_size: value.company_size,
      role: value.role,
      industry: value.industry,
      notes: value.message,
      preferred_timeframe: preferredTimeframe,
      consent: value.consent,
      status: "pending",
      user_agent: request.headers.get("user-agent") || null,
    };
    const { error } = await supabase.from("demo_bookings").insert(row);
    if (error) {
      console.error("[demo-requests] insert error", error);
      return NextResponse.json(
        { ok: false, code: FORM_ERROR_CODE.REQUEST_FAILED },
        { status: 500 }
      );
    }
  }

  // Fire-and-forget confirmation email; failures are logged but never block the response.
  await sendDemoFallbackConfirmation({
    to: value.work_email,
    name: value.name,
    preferredTimeframe,
  });

  return NextResponse.json({ ok: true, persisted: Boolean(supabase) });
}
