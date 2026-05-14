// Lightweight in-memory rate limiter. Sufficient for spam control on
// single-instance deployments; replace with a Redis-backed limiter (e.g.
// Upstash) before horizontally scaling the API.

type Bucket = { count: number; resetAt: number };

const BUCKETS = new Map<string, Bucket>();

const MAX_BUCKETS = 5000;

export type RateLimitResult = { allowed: boolean; remaining: number; resetAt: number };

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = BUCKETS.get(key);

  if (!existing || existing.resetAt <= now) {
    const fresh: Bucket = { count: 1, resetAt: now + windowMs };
    BUCKETS.set(key, fresh);
    if (BUCKETS.size > MAX_BUCKETS) {
      for (const [k, v] of BUCKETS) {
        if (v.resetAt <= now) BUCKETS.delete(k);
      }
    }
    return { allowed: true, remaining: limit - 1, resetAt: fresh.resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

export function getClientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return headers.get("x-real-ip") || "unknown";
}
