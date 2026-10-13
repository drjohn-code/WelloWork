import type { CognitiveRewardsGamePhase } from "@/app/types/database";

/** Languages the puzzles and Game Master are produced in: every site language. */
export const CONTENT_LANGUAGES = ["en", "sv", "nl", "de", "fr", "es", "it", "lt"] as const;
export type ContentLanguage = (typeof CONTENT_LANGUAGES)[number];

export function toContentLanguage(locale: string | null | undefined): ContentLanguage {
  return (CONTENT_LANGUAGES as readonly string[]).includes(locale ?? "") ? (locale as ContentLanguage) : "en";
}

export type TemplateId = "slot" | "snack" | "wifi" | "replyall" | "desks" | "callback";

/** Intake question keys. q5/q6 are optional. */
export const INTAKE_QUESTIONS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;
export type IntakeKey = (typeof INTAKE_QUESTIONS)[number];
export const INTAKE_OPTIONAL: ReadonlySet<IntakeKey> = new Set<IntakeKey>(["q5", "q6"]);

/** One cleaned answer per question, chosen for puzzle data; `all` keeps every player's answer for flavour. */
export type IntakeSummary = {
  canonical: Record<IntakeKey, string>;
  all: Record<IntakeKey, string[]>;
};

/* ── Pieces: structured, rendered by the UI, never written by the model ──── */

export type Piece =
  | { kind: "calendar"; owner: string; hours: number[]; busy: number[] }
  | { kind: "shelf"; label: string; items: Array<{ name: string; count: number; expired: boolean }> }
  | { kind: "messages"; items: Array<{ from: string; time: string; text: string }> }
  | { kind: "rule"; order: number; text: string }
  | { kind: "clue"; texts: string[] }
  | { kind: "none" };

export type DetailCatch = { playerId: string; text: string; value: number };

export type Fact = { key: string; label: string; value: string };

export type RoundSpec = { index: number; template: TemplateId; solverPlayerId: string; detail?: boolean };

export type PublicPrompt = { text: string; answerType: "digits" | "text"; answerLength?: number };

export type GeneratedRound = {
  params: Record<string, unknown> & { facts: Fact[]; detail?: DetailCatch; referenced?: string[] };
  pieces: Record<string, Piece>;
  publicPrompt: PublicPrompt;
  answer: string;
};

/* ── Game Master content (validated model output or fallback) ───────────── */

export type RoundContent = {
  title: string;
  setup: string;
  reactions: { fast: string; slow: string; failed: string };
  stuck: string;
};

export type GameContent = {
  briefing: string;
  rounds: RoundContent[];
  challengePrompt: string;
  keyIntro: string;
  keyReveal: string;
  outro: string;
};

export type ChallengeVerdict = {
  verdict: string;
  scores: { relevance: number; ownInputs: number; callbacks: number; safe: number; funny: number };
  total: number;
};

/* ── Scoring ────────────────────────────────────────────────────────────── */

export type ScoreComponents = {
  dataTransfer: number;
  teamwork: number;
  problemSolving: number;
  focus: number;
  memory: number;
};

export type PlayerScore = {
  playerId: string;
  components: ScoreComponents;
  total: number;
  shareEur: number;
  rank: number;
  highlights: string[];
};

/* ── What the client receives (personalised, never another player's piece) ─ */

export type PlayerPublic = { id: string; name: string; joined: boolean; online: boolean; isHost: boolean };

export type RoundView = {
  index: number;
  total: number;
  template: TemplateId;
  title: string;
  setup: string;
  solver: { id: string; name: string };
  isSolver: boolean;
  prompt: PublicPrompt;
  myPiece: Piece | null;
  /** Pieces of teammates who disconnected, shown to the solver only. */
  revealedPieces: Array<{ name: string; piece: Piece }>;
  detail: { text: string; shownAt: string } | null;
  status: "active" | "solved" | "failed";
  startedAt: string;
  hintAvailableAt: string;
  capAt: string;
  hint: string | null;
  stuck: boolean;
  acknowledgedByMe: boolean;
  acknowledgedCount: number;
  attemptsLeft: number;
  wrongAttempts: number;
  reaction: string | null;
  revealedAnswer: string | null;
  nextAt: string | null;
};

export type GameView = {
  phase: CognitiveRewardsGamePhase;
  /** The link has done its job (payout paid, or 30 days after the game): show only a "finished" page. */
  finished: boolean;
  language: string;
  teamSize: number;
  pool: number;
  buyerName: string;
  companyName: string;
  me: { id: string; name: string; isHost: boolean };
  host: { id: string; name: string } | null;
  players: PlayerPublic[];
  serverNow: string;
  intake: { submitted: string[]; deadlineAt: string; mine: Partial<Record<IntakeKey, string>> | null } | null;
  briefing: { text: string; isHost: boolean } | null;
  round: RoundView | null;
  challenge: { prompt: string; text: string; isHost: boolean; deadlineAt: string } | null;
  key: {
    intro: string;
    blanks: Array<{ label: string; value: string | null }>;
    enteredCorrectly: string[];
    attempts: number;
    lastWrongAt: string | null;
  } | null;
  scorecard: {
    outro: string;
    verdict: ChallengeVerdict | null;
    players: Array<{ id: string; name: string; total: number; shareEur: number; rank: number; components: ScoreComponents; highlights: string[] }>;
    payout: { amountEur: number; status: "awaiting_details" | "ready" | "paid"; last4: string | null } | null;
  } | null;
};
