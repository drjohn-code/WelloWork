import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";

let cached: SupabaseClient<Database> | null = null;

export function getSupabaseServerClient(): SupabaseClient<Database> | null {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Prefer service role on the server for inserts (RLS still applies; service role bypasses it
  // but we never expose it client-side because this file is server-only). If service role isn't
  // set, fall back to the anon key, which can still insert under the RLS insert policy.
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  cached = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
