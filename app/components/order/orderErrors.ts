import type { OrderErrorCode } from "@/app/lib/cognitive-rewards-order";

/**
 * Maps a locale-agnostic order error code (ORDER_ERROR_CODE in
 * cognitive-rewards-order.ts) to its key in the `cognitiveRewardsOrder.wizard.errors`
 * message namespace. The API never returns localized strings.
 */
export type OrderErrorMessageKey = OrderErrorCode | "NETWORK" | "GENERIC";

export function orderErrorKey(code: string | null | undefined): OrderErrorMessageKey {
  if (code === "NETWORK") return "NETWORK";
  const known: readonly string[] = [
    "INVALID_TEAM_SIZE",
    "PLAYER_COUNT_MISMATCH",
    "REQUIRED_PLAYER_NAME",
    "INVALID_PLAYER_EMAIL",
    "DUPLICATE_PLAYER_EMAIL",
    "REQUIRED_PLAYER_ROLE",
    "INVALID_REWARD_POOL",
    "REQUIRED_BUYER_NAME",
    "INVALID_BUYER_EMAIL",
    "REQUIRED_BUYER_COMPANY",
    "REQUIRED_CONSENT_TERMS",
    "REQUIRED_CONSENT_GDPR",
    "RATE_LIMITED",
    "SUBMIT_FAILED",
    "REQUEST_FAILED",
  ];
  if (code && known.includes(code)) return code as OrderErrorCode;
  return "GENERIC";
}
