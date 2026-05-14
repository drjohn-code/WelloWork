import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";
import { getSupabaseServerClient } from "../../lib/supabase";
import type { DemoBookingInsert, DemoBookingStatus } from "../../types/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Cal.com signs webhook payloads using HMAC-SHA256 over the raw request body
// with the webhook secret as the key. The signature arrives in `X-Cal-Signature-256`.
// Reference: https://cal.com/docs/core-features/webhooks#how-to-verify-the-authenticity-of-the-received-payload

type CalcomTriggerEvent =
  | "BOOKING_CREATED"
  | "BOOKING_RESCHEDULED"
  | "BOOKING_CANCELLED"
  | "BOOKING_REQUESTED"
  | "BOOKING_REJECTED"
  | "BOOKING_PAID"
  | "MEETING_ENDED";

type CalcomAttendee = {
  name?: string;
  email?: string;
  timeZone?: string;
};

type CalcomResponseValue =
  | string
  | number
  | boolean
  | null
  | { value?: string | number | boolean | null; label?: string };

type CalcomBookingPayload = {
  bookingId?: number;
  uid?: string;
  startTime?: string;
  endTime?: string;
  organizer?: { timeZone?: string };
  attendees?: CalcomAttendee[];
  responses?: Record<string, CalcomResponseValue>;
  userFieldsResponses?: Record<string, CalcomResponseValue>;
  metadata?: Record<string, unknown>;
  status?: string;
};

type CalcomWebhookBody = {
  triggerEvent?: CalcomTriggerEvent;
  payload?: CalcomBookingPayload;
};

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

function verifySignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  // Some Cal.com deployments send a bare hex digest; older docs reference a "sha256=" prefix.
  const provided = header.startsWith("sha256=") ? header.slice("sha256=".length) : header;
  return timingSafeEqualHex(expected, provided.trim());
}

function pickResponse(
  responses: Record<string, CalcomResponseValue> | undefined,
  keys: string[]
): string | null {
  if (!responses) return null;
  for (const key of keys) {
    const v = responses[key];
    if (v == null) continue;
    if (typeof v === "string") {
      const trimmed = v.trim();
      if (trimmed) return trimmed.slice(0, 2000);
    } else if (typeof v === "number" || typeof v === "boolean") {
      return String(v);
    } else if (typeof v === "object") {
      const inner = v.value;
      if (typeof inner === "string" && inner.trim()) return inner.trim().slice(0, 2000);
      if (typeof inner === "number" || typeof inner === "boolean") return String(inner);
    }
  }
  return null;
}

function statusFromTrigger(event: CalcomTriggerEvent | undefined): DemoBookingStatus {
  switch (event) {
    case "BOOKING_CREATED":
      return "scheduled";
    case "BOOKING_RESCHEDULED":
      return "rescheduled";
    case "BOOKING_CANCELLED":
    case "BOOKING_REJECTED":
      return "cancelled";
    case "MEETING_ENDED":
      return "completed";
    case "BOOKING_REQUESTED":
      return "pending";
    default:
      return "scheduled";
  }
}

export async function POST(request: NextRequest) {
  const secret = process.env.CALCOM_WEBHOOK_SECRET?.trim();
  if (!secret) {
    console.error("[calcom-webhook] CALCOM_WEBHOOK_SECRET is not set");
    return NextResponse.json({ ok: false, error: "Webhook not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature =
    request.headers.get("x-cal-signature-256") ||
    request.headers.get("X-Cal-Signature-256") ||
    request.headers.get("x-cal-signature");

  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
  }

  let body: CalcomWebhookBody;
  try {
    body = JSON.parse(rawBody) as CalcomWebhookBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const triggerEvent = body.triggerEvent;
  const payload = body.payload || {};

  const acceptedEvents: CalcomTriggerEvent[] = [
    "BOOKING_CREATED",
    "BOOKING_RESCHEDULED",
    "BOOKING_CANCELLED",
    "BOOKING_REQUESTED",
    "BOOKING_REJECTED",
    "MEETING_ENDED",
  ];
  if (!triggerEvent || !acceptedEvents.includes(triggerEvent)) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    console.warn("[calcom-webhook] Supabase not configured. Event acknowledged but not persisted.");
    return NextResponse.json({ ok: true, persisted: false });
  }

  const primaryAttendee = payload.attendees?.[0];
  const attendeeName = primaryAttendee?.name?.trim() || "Unknown";
  const attendeeEmail = primaryAttendee?.email?.trim().toLowerCase() || "";
  if (!attendeeEmail) {
    return NextResponse.json({ ok: false, error: "Missing attendee email" }, { status: 400 });
  }

  const responses = payload.responses || payload.userFieldsResponses;

  const row: DemoBookingInsert = {
    source: "calcom",
    calcom_booking_uid: payload.uid || null,
    calcom_booking_id: payload.bookingId ?? null,
    attendee_name: attendeeName.slice(0, 200),
    attendee_email: attendeeEmail.slice(0, 320),
    company: pickResponse(responses, ["company", "company_name", "companyName"]),
    company_size: pickResponse(responses, ["company_size", "companySize", "team_size"]),
    role: pickResponse(responses, ["role", "title", "job_title", "jobTitle"]),
    industry: pickResponse(responses, ["industry", "sector"]),
    notes: pickResponse(responses, ["notes", "what_to_see", "agenda", "message", "notes_text"]),
    consent: true,
    scheduled_start: payload.startTime || null,
    scheduled_end: payload.endTime || null,
    timezone: primaryAttendee?.timeZone || payload.organizer?.timeZone || null,
    status: statusFromTrigger(triggerEvent),
    raw_payload: body as unknown as Record<string, unknown>,
  };

  // Upsert on the Cal.com uid so reschedules/cancellations land on the same row.
  if (row.calcom_booking_uid) {
    const { error } = await supabase
      .from("demo_bookings")
      .upsert(row, { onConflict: "calcom_booking_uid" });
    if (error) {
      console.error("[calcom-webhook] upsert error", error);
      return NextResponse.json(
        { ok: false, error: "Persist failed" },
        { status: 500 }
      );
    }
  } else {
    const { error } = await supabase.from("demo_bookings").insert(row);
    if (error) {
      console.error("[calcom-webhook] insert error", error);
      return NextResponse.json(
        { ok: false, error: "Persist failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ ok: true, persisted: true });
}
