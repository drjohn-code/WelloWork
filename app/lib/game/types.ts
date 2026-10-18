import type { CognitiveRewardsGamePhase } from "@/app/types/database";
import type { CardObject, ColorId, Face, FaceFeature } from "./visual";
import type { WorldId } from "./worlds";

/** Languages the puzzles and Game Master are produced in: every site language. */
export const CONTENT_LANGUAGES = ["en", "sv", "nl", "de", "fr", "es", "it", "lt"] as const;
export type ContentLanguage = (typeof CONTENT_LANGUAGES)[number];

export function toContentLanguage(locale: string | null | undefined): ContentLanguage {
  return (CONTENT_LANGUAGES as readonly string[]).includes(locale ?? "") ? (locale as ContentLanguage) : "en";
}

export type TemplateId = "slot" | "snack" | "wifi" | "replyall" | "desks" | "callback" | "common" | "lineup" | "blueprint";

/** A round whose conditions change: "flash" hides the sources' pieces after a few seconds, "rush" halves the time. */
export type Twist = "flash" | "rush";

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
  /**
   * A shelf of items with best-before days. Only the solver's shelf carries
   * `today`, so the others have to read out their dates and the solver decides
   * what is still good.
   */
  | { kind: "shelf"; label: string; items: Array<{ name: string; count: number; bestBefore: number }>; today?: number }
  | { kind: "messages"; items: Array<{ from: string; time: string; text: string }> }
  | { kind: "rule"; order: number; text: string }
  | { kind: "clue"; texts: string[] }
  /* talk rounds (talk.ts): pictures, drawn by the UI */
  | { kind: "cards"; cards: string[] }
  | { kind: "witness"; features: Array<{ feature: FaceFeature; value: string }> }
  /** The solver's side of a common-ground round: every card of the world, objects in rows, colours in columns. */
  | { kind: "board"; cards: string[]; cols: number }
  | { kind: "lineup"; faces: Face[] }
  | { kind: "tiles"; cols: number; rows: Array<{ row: number; tiles: number[] }> }
  | { kind: "canvas"; rows: number; cols: number }
  | { kind: "none" };

export type DetailCatch = { playerId: string; text: string; value: number };

export type Fact = { key: string; label: string; value: string };

export type RoundSpec = { index: number; template: TemplateId; solverPlayerId: string; detail?: boolean; twist?: Twist };

export type PublicPrompt = {
  text: string;
  /** choice = tap one of your own cards/faces; grid = paint the empty grid. */
  answerType: "digits" | "text" | "choice" | "grid";
  answerLength?: number;
  /** Wrong attempts before the round fails (choice rounds are guessable, so they get fewer). */
  maxWrong?: number;
  rows?: number;
  cols?: number;
};

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
  /** Games generated before the episode engine have neither. */
  episode?: EpisodeInfo;
  skin?: EpisodeSkin;
};

/** The episode record: kept with the game so the team's next episode can continue the series. No team answers in here. */
export type EpisodeInfo = {
  worldId: WorldId;
  premise: number;
  number: number;
  previous: { worldId: WorldId; title: string; number: number } | null;
  title: string;
  previously: string | null;
  teaser: string;
};

/**
 * In-world names for the classic puzzles, written by the Game Master for this
 * episode and validated (no digits). Any missing field uses the office text.
 */
export type EpisodeSkin = {
  codeName?: string;
  shelves?: string[];
  decoys?: string[];
  thread?: string[];
  /** Contains "{n}" exactly once: where the sticky-note number goes. */
  note?: string;
};

/** Game-language names for talk-round pictures (screen-reader labels, hints). */
export type TalkLabels = { colors: Record<ColorId, string>; cards: Record<CardObject, string>; emptyTile: string };

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

/** End-of-game titles: every player gets exactly one, and no title is used twice in a game. */
export const TITLE_IDS = ["connector", "clarity", "bridge", "rescuer", "solver", "pace", "eagleEye", "memory", "glue"] as const;
export type TitleId = (typeof TITLE_IDS)[number];

export function isTitleId(value: unknown): value is TitleId {
  return typeof value === "string" && (TITLE_IDS as readonly string[]).includes(value);
}

export type PlayerScore = {
  playerId: string;
  components: ScoreComponents;
  total: number;
  shareEur: number;
  rank: number;
  title: TitleId;
};

/* ── What the client receives (personalised, never another player's piece) ─ */

/**
 * End-of-game result as sent to one player. `team` and `teamAverage` are the
 * same for everyone; amounts and per-player components exist only in `mine`.
 */
export type ScorecardResult = {
  /** Seat order (never rank order), names and titles only. */
  team: Array<{ id: string; name: string; title: TitleId | null }>;
  teamAverage: ScoreComponents;
  mine: { shareEur: number; components: ScoreComponents; title: TitleId | null } | null;
};

export type PlayerPublic = { id: string; name: string; joined: boolean; online: boolean; isHost: boolean };

/** One stop on the episode path: the round's type and twist, and how it went. Never a piece or an answer. */
export type PathNode = {
  template: TemplateId;
  twist: Twist | null;
  status: "pending" | "active" | "solved" | "failed";
  /** Solved with no wrong attempt and no hint. */
  clean: boolean;
};

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
  twist: Twist | null;
  /** Flash twist, sources only: when the piece stops being shown. */
  pieceHidesAt: string | null;
  /** Flash twist, sources only: the piece is no longer sent. */
  pieceHidden: boolean;
  labels: TalkLabels | null;
  status: "active" | "solved" | "failed";
  startedAt: string;
  hintAvailableAt: string;
  capAt: string;
  hint: string | null;
  stuck: boolean;
  /** Whose piece the solver asked for again (empty = everyone). */
  stuckNeed: string[];
  /** The Game Master's calm nudge for this round, once the solver is stuck. */
  stuckNudge: string | null;
  acknowledgedByMe: boolean;
  acknowledgedCount: number;
  attemptsLeft: number;
  wrongAttempts: number;
  reaction: string | null;
  revealedAnswer: string | null;
  nextAt: string | null;
  /** Every round of the episode, in order, for the path above the round card. */
  path: PathNode[];
  /** Solved rounds in a row, counted back from the latest finished round. */
  streak: number;
};

export type GameView = {
  phase: CognitiveRewardsGamePhase;
  /** The link has done its job (payout paid, or 30 days after the game): show only a "finished" page. */
  finished: boolean;
  /** A mock-paid order (playtests): scores and split are shown, but nothing is paid and no bank details are taken. */
  testGame: boolean;
  language: string;
  teamSize: number;
  pool: number;
  buyerName: string;
  companyName: string;
  me: { id: string; name: string; isHost: boolean };
  host: { id: string; name: string } | null;
  players: PlayerPublic[];
  serverNow: string;
  /** Lobby only, once everyone has joined: the world vote for this episode. */
  lobby: {
    offer: Array<{ id: WorldId; name: string; tagline: string }>;
    votes: Record<string, WorldId | "surprise">;
    leading: WorldId | null;
    episodeNumber: number;
    previousTitle: string | null;
  } | null;
  /** From the briefing on. */
  episode: { worldId: WorldId; worldName: string; number: number; title: string; previously: string | null; teaser: string } | null;
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
  scorecard: ({
    outro: string;
    verdict: ChallengeVerdict | null;
    payout: { amountEur: number; status: "awaiting_details" | "ready" | "paid"; last4: string | null } | null;
  } & ScorecardResult) | null;
};
