import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

/**
 * Secrets at rest (IBANs, and the copy of each player's join token used to
 * re-send their personal link) are encrypted with AES-256-GCM under
 * PAYOUT_ENCRYPTION_KEY (32 bytes, base64). Only server code ever decrypts;
 * IBAN ciphertext is wiped 30 days after a payout is marked paid.
 */

function key(): Buffer {
  const raw = process.env.PAYOUT_ENCRYPTION_KEY?.trim();
  if (!raw) throw new Error("PAYOUT_ENCRYPTION_KEY is not configured");
  const buf = Buffer.from(raw, "base64");
  if (buf.length !== 32) throw new Error("PAYOUT_ENCRYPTION_KEY must be 32 bytes (base64)");
  return buf;
}

export function encryptSecret(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return `v1.${iv.toString("base64")}.${cipher.getAuthTag().toString("base64")}.${enc.toString("base64")}`;
}

export function decryptSecret(payload: string): string {
  const [v, iv, tag, data] = payload.split(".");
  if (v !== "v1") throw new Error("Unknown ciphertext version");
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(iv, "base64"));
  decipher.setAuthTag(Buffer.from(tag, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(data, "base64")), decipher.final()]).toString("utf8");
}

/** Normalises and validates an IBAN (ISO 13616 mod-97). Returns null if invalid. */
export function normalizeIban(raw: string): string | null {
  const iban = raw.replace(/\s+/g, "").toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) return null;
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const digits = rearranged.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let rem = 0;
  for (const ch of digits) rem = (rem * 10 + Number(ch)) % 97;
  return rem === 1 ? iban : null;
}

export function formatIbanGrouped(iban: string): string {
  return iban.replace(/(.{4})/g, "$1 ").trim();
}
