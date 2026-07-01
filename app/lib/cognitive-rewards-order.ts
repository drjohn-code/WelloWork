// Cognitive Rewards order flow — pricing + validation shared between the
// buyer-facing wizard (client) and the createOrder route (server). The
// server is the pricing authority: it always recomputes game_fee/vat/total
// from team_size and never trusts a client-submitted price (see route.ts).

export const CURRENCY = "EUR" as const;

export const TEAM_SIZES = [3, 4, 5] as const;
export type TeamSize = (typeof TEAM_SIZES)[number];

/** Game fee (EUR, excl. VAT) by team size. Single source of truth. */
export const GAME_FEE_EUR: Record<TeamSize, number> = {
  3: 30,
  4: 35,
  5: 40,
};

export const MIN_REWARD_POOL_EUR = 100;
/** Fat-finger guard, not a product limit — raise if buyers legitimately need more. */
export const MAX_REWARD_POOL_EUR = 10_000;
export const REWARD_POOL_QUICK_PICKS = [100, 250, 500] as const;

/**
 * TODO: replace with Stripe Tax, which computes the correct per-country VAT
 * rate (and B2B reverse charge) at checkout time. This flat rate is a
 * placeholder used only for the pre-checkout estimate shown in the wizard —
 * it is NOT "the" correct VAT rate for any jurisdiction and must never be
 * treated as final.
 */
export const DEFAULT_VAT_RATE = 0.25;

export const PLAYER_ROLES = ["staff", "manager", "clevel"] as const;
export type PlayerRole = (typeof PLAYER_ROLES)[number];

export function isTeamSize(value: unknown): value is TeamSize {
  return typeof value === "number" && (TEAM_SIZES as readonly number[]).includes(value);
}

export function isPlayerRole(value: unknown): value is PlayerRole {
  return typeof value === "string" && (PLAYER_ROLES as readonly string[]).includes(value);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export type OrderPricing = {
  currency: typeof CURRENCY;
  gameFee: number;
  vatRate: number;
  vatAmount: number;
  rewardPool: number;
  total: number;
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Authoritative pricing for a team size + reward pool. VAT applies to the game fee only. */
export function computeOrderPricing(teamSize: TeamSize, rewardPoolEur: number): OrderPricing {
  const gameFee = GAME_FEE_EUR[teamSize];
  const vatRate = DEFAULT_VAT_RATE;
  const vatAmount = round2(gameFee * vatRate);
  const total = round2(gameFee + vatAmount + rewardPoolEur);
  return { currency: CURRENCY, gameFee, vatRate, vatAmount, rewardPool: rewardPoolEur, total };
}

export type PlayerInput = { name: string; email: string; role: string };
export type BuyerInput = { name: string; workEmail: string; company: string };
export type OrderInput = {
  teamSize: number;
  players: PlayerInput[];
  rewardPool: number;
  buyer: BuyerInput;
  consentTerms: boolean;
  consentGdpr: boolean;
};

/** Locale-agnostic error codes. The client maps these to translated messages. */
export const ORDER_ERROR_CODE = {
  INVALID_TEAM_SIZE: "INVALID_TEAM_SIZE",
  PLAYER_COUNT_MISMATCH: "PLAYER_COUNT_MISMATCH",
  REQUIRED_PLAYER_NAME: "REQUIRED_PLAYER_NAME",
  INVALID_PLAYER_EMAIL: "INVALID_PLAYER_EMAIL",
  DUPLICATE_PLAYER_EMAIL: "DUPLICATE_PLAYER_EMAIL",
  REQUIRED_PLAYER_ROLE: "REQUIRED_PLAYER_ROLE",
  INVALID_REWARD_POOL: "INVALID_REWARD_POOL",
  REQUIRED_BUYER_NAME: "REQUIRED_BUYER_NAME",
  INVALID_BUYER_EMAIL: "INVALID_BUYER_EMAIL",
  REQUIRED_BUYER_COMPANY: "REQUIRED_BUYER_COMPANY",
  REQUIRED_CONSENT_TERMS: "REQUIRED_CONSENT_TERMS",
  REQUIRED_CONSENT_GDPR: "REQUIRED_CONSENT_GDPR",
  RATE_LIMITED: "RATE_LIMITED",
  SUBMIT_FAILED: "SUBMIT_FAILED",
  REQUEST_FAILED: "REQUEST_FAILED",
} as const;
export type OrderErrorCode = (typeof ORDER_ERROR_CODE)[keyof typeof ORDER_ERROR_CODE];

export type PlayerErrors = Partial<Record<"name" | "email" | "role", OrderErrorCode>>;

export type OrderErrors = {
  teamSize?: OrderErrorCode;
  players?: Array<PlayerErrors | undefined>;
  rewardPool?: OrderErrorCode;
  buyerName?: OrderErrorCode;
  buyerEmail?: OrderErrorCode;
  buyerCompany?: OrderErrorCode;
  consentTerms?: OrderErrorCode;
  consentGdpr?: OrderErrorCode;
};

export function hasOrderErrors(errors: OrderErrors): boolean {
  if (
    errors.teamSize ||
    errors.rewardPool ||
    errors.buyerName ||
    errors.buyerEmail ||
    errors.buyerCompany ||
    errors.consentTerms ||
    errors.consentGdpr
  ) {
    return true;
  }
  return Boolean(errors.players?.some(Boolean));
}

/**
 * Full validation of an order payload. Used both for server-side gatekeeping
 * (createOrder never trusts the client) and for the wizard's per-step client
 * validation, so the two never drift apart.
 */
export function validateOrderInput(input: OrderInput): OrderErrors {
  const errors: OrderErrors = {};

  if (!isTeamSize(input.teamSize)) {
    errors.teamSize = ORDER_ERROR_CODE.INVALID_TEAM_SIZE;
  } else if (input.players.length !== input.teamSize) {
    errors.teamSize = ORDER_ERROR_CODE.PLAYER_COUNT_MISMATCH;
  }

  const playerErrors: Array<PlayerErrors | undefined> = input.players.map(() => undefined);
  const emailFirstIndex = new Map<string, number>();

  input.players.forEach((p, i) => {
    const rowErrors: PlayerErrors = {};
    if (!p.name || p.name.trim().length < 2) {
      rowErrors.name = ORDER_ERROR_CODE.REQUIRED_PLAYER_NAME;
    }
    const email = normalizeEmail(p.email || "");
    if (!isValidEmail(email)) {
      rowErrors.email = ORDER_ERROR_CODE.INVALID_PLAYER_EMAIL;
    } else if (emailFirstIndex.has(email)) {
      rowErrors.email = ORDER_ERROR_CODE.DUPLICATE_PLAYER_EMAIL;
      const firstIdx = emailFirstIndex.get(email)!;
      playerErrors[firstIdx] = { ...playerErrors[firstIdx], email: ORDER_ERROR_CODE.DUPLICATE_PLAYER_EMAIL };
    } else {
      emailFirstIndex.set(email, i);
    }
    if (!isPlayerRole(p.role)) {
      rowErrors.role = ORDER_ERROR_CODE.REQUIRED_PLAYER_ROLE;
    }
    if (Object.keys(rowErrors).length > 0) {
      playerErrors[i] = { ...playerErrors[i], ...rowErrors };
    }
  });

  if (playerErrors.some(Boolean)) errors.players = playerErrors;

  if (
    !Number.isInteger(input.rewardPool) ||
    input.rewardPool < MIN_REWARD_POOL_EUR ||
    input.rewardPool > MAX_REWARD_POOL_EUR
  ) {
    errors.rewardPool = ORDER_ERROR_CODE.INVALID_REWARD_POOL;
  }

  if (!input.buyer.name || input.buyer.name.trim().length < 2) {
    errors.buyerName = ORDER_ERROR_CODE.REQUIRED_BUYER_NAME;
  }
  if (!isValidEmail(normalizeEmail(input.buyer.workEmail || ""))) {
    errors.buyerEmail = ORDER_ERROR_CODE.INVALID_BUYER_EMAIL;
  }
  if (!input.buyer.company || input.buyer.company.trim().length < 2) {
    errors.buyerCompany = ORDER_ERROR_CODE.REQUIRED_BUYER_COMPANY;
  }

  if (!input.consentTerms) errors.consentTerms = ORDER_ERROR_CODE.REQUIRED_CONSENT_TERMS;
  if (!input.consentGdpr) errors.consentGdpr = ORDER_ERROR_CODE.REQUIRED_CONSENT_GDPR;

  return errors;
}
