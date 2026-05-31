import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServerClient } from "../../lib/supabase";
import { parseContact, FORM_ERROR_CODE } from "../../lib/validation";
import { rateLimit, getClientIp } from "../../lib/rate-limit";
import { sendContactNotification } from "../../lib/email";
import type { ContactMessageInsert } from "../../types/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rl = rateLimit(`contact:${ip}`, 5, 60_000);
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

  const { value, errors } = parseContact(form);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    console.warn("[contact-messages] Supabase not configured. Payload (not persisted):", value);
  } else {
    const row: ContactMessageInsert = {
      ...value,
      source: "contact",
      user_agent: request.headers.get("user-agent") || null,
    };
    const { error } = await supabase.from("contact_messages").insert(row);
    if (error) {
      console.error("[contact-messages] insert error", error);
      return NextResponse.json(
        { ok: false, code: FORM_ERROR_CODE.SUBMIT_FAILED },
        { status: 500 }
      );
    }
  }

  // Notify info@wellowork.net; failures are logged but never block the response.
  await sendContactNotification({
    name: value.name,
    workEmail: value.work_email,
    company: value.company,
    companySize: value.company_size,
    role: value.role,
    industry: value.industry,
    message: value.message,
  });

  return NextResponse.json({ ok: true, persisted: Boolean(supabase) });
}
