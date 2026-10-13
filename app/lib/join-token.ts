import { createHash, randomBytes } from "crypto";

/**
 * Personal join links (/play/<token>). The raw token only ever exists in the
 * player's email; the database stores its SHA-256 hash, so a DB leak can't be
 * turned into working links. 32 random bytes → 43 base64url chars.
 */

const TOKEN_RE = /^[A-Za-z0-9_-]{43}$/;

export function generateJoinToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashJoinToken(token) };
}

export function hashJoinToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Cheap shape check before touching the database. */
export function isWellFormedJoinToken(token: string): boolean {
  return TOKEN_RE.test(token);
}
