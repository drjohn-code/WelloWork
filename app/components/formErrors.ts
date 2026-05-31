import type { FormErrorCode } from "@/app/lib/validation";

/**
 * Maps a locale-agnostic API error code (FORM_ERROR_CODE in lib/validation.ts)
 * to its key in the `forms` message namespace. The API never returns localized
 * strings — the client localizes here, so form errors translate with the rest
 * of the site when a locale is enabled.
 */
const FORM_ERROR_KEY = {
  REQUIRED_NAME: "error.name",
  INVALID_EMAIL: "error.workEmail",
  REQUIRED_COMPANY: "error.company",
  REQUIRED_CONSENT: "error.consent",
  REQUIRED_MESSAGE: "error.message",
  RATE_LIMITED: "error.rateLimited",
  SUBMIT_FAILED: "error.submitFailed",
  REQUEST_FAILED: "error.requestFailed",
} as const satisfies Record<FormErrorCode, string>;

export type FormErrorMessageKey =
  | (typeof FORM_ERROR_KEY)[keyof typeof FORM_ERROR_KEY]
  | "error.network"
  | "error.generic";

/**
 * Resolve an API error code (or the client-only "NETWORK" sentinel) to a `forms`
 * namespace message key. Unknown/missing codes fall back to a generic message so
 * the UI never renders a raw code.
 */
export function formErrorKey(code: string | null | undefined): FormErrorMessageKey {
  if (code === "NETWORK") return "error.network";
  if (code && code in FORM_ERROR_KEY) {
    return FORM_ERROR_KEY[code as FormErrorCode];
  }
  return "error.generic";
}
