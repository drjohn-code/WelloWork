import type { PlayerInput, TeamSize } from "@/app/lib/cognitive-rewards-order";

/**
 * Wizard state persisted to sessionStorage so a refresh, the back button or a
 * cancelled Stripe Checkout never loses the buyer's input. Cleared only once
 * payment is confirmed (see ClearOrderDraft on the success page).
 */
export const ORDER_DRAFT_STORAGE_KEY = "wellowork:cr-order-draft:v2";

export type OrderStep = 1 | 2 | 3 | 4;

export type DraftState = {
  step: OrderStep;
  /** Furthest step reached — steps up to here are reachable from the stepper. */
  maxStep: OrderStep;
  teamSize: TeamSize | null;
  players: PlayerInput[];
  /** Valid whole-euro amount, or "" when none/invalid. */
  rewardPool: number | "";
  /** Raw custom-amount text; non-empty means the custom field (not a preset) is the source. */
  customPool: string;
  buyerName: string;
  buyerWorkEmail: string;
  buyerCompany: string;
  consentTerms: boolean;
  consentGdpr: boolean;
};

export function initialDraft(): DraftState {
  return {
    step: 1,
    maxStep: 1,
    teamSize: null,
    players: [],
    rewardPool: "",
    customPool: "",
    buyerName: "",
    buyerWorkEmail: "",
    buyerCompany: "",
    consentTerms: false,
    consentGdpr: false,
  };
}

export function clearOrderDraft() {
  try {
    window.sessionStorage.removeItem(ORDER_DRAFT_STORAGE_KEY);
    // Pre-redesign key, in case a buyer had a draft open across the deploy.
    window.sessionStorage.removeItem("wellowork:cr-order-draft:v1");
  } catch {
    // storage unavailable — nothing to clear
  }
}
