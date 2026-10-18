# Cognitive Rewards: Handoff, 14 October 2026

**Product:** Cognitive Rewards ("Game & Reward" in nav/footer), part of WelloWork (wellowork.net)
**Owner:** John (WelloWork)
**Repo:** `drjohn-code/WelloWork`, branch `main`, last commit `ba09737` ("Cognitive Rewards game: engine, lobby, scoring, payouts, admin, emails")
**Purpose:** everything needed to resume this project from a new chat with no memory. Upload this file first.

> **Update 18 Oct 2026:** the game is now an episode engine (worlds, a lobby vote, talk rounds, twists, team memory, 70/30 communication-first scoring) and the result screen gives every player one title with money shown only privately. Read `docs/cognitive-rewards-episodes.md` first; where it disagrees with sections 4 and 5 below, it wins. `schedule.ts` was replaced by `episode.ts`.

> **How to resume:** upload this file, then say which section you want to continue. Section 2 (Current state) and section 9 (Open items) are the source of truth. The older brainstorm document (`cognitive-rewards-project-handoff.md`) is superseded by this one where they differ.

---

## 1. One-paragraph summary

A company buys a 25–30 minute **real-time team game** for 3, 4 or 5 colleagues as a gift, and funds a **reward pool** (min €100). Players each get a **personal link** by email, meet in a **lobby**, answer six light intake questions, and play six to ten short **split-information puzzles**: every player sees a different piece and one player (the **solver**, rotating) enters the answer, so they must talk. A dry, deadpan **Game Master** (an owl character, text written by a language model from the team's own answers) reacts after every round. A team challenge, a key ceremony and a celebration end the game; the pool is **split by what each player measurably did** (60% helping, 40% solving) with guaranteed minimums, and each player adds bank details for a transfer. **All of this is built, tested end to end against the real services, and deployed to `main`.** What is *not* done is listed in section 9.

---

## 2. Current state

### Built and verified (end-to-end test games played against real Supabase, Resend, OpenRouter)
- Marketing pages, homepage teaser, landing page (from earlier work).
- **Order page** (`/cognitive-rewards/order`): 4-step checkout wizard, sticky order summary, Stripe hosted Checkout with Stripe Tax, webhook marks orders paid. Favicon replaced with the WelloWork mark.
- **Invitations**: on payment, each player gets a branded email with a personal link; buyer gets a confirmation.
- **Lobby**: team board with joined/not-joined, live table illustration, random host chosen when everyone has joined, host picks the **game language** (all 8 site languages), host starts.
- **Game**: intake → content generation (model) → briefing → rounds → final challenge → key ceremony → celebration/scorecard → bank details form.
- **Scoring + split**, **payout admin page**, **game-end emails** (player result + bank-details request, bank details received, payment sent, buyer team summary).
- **Design**: scenes per step, owl Game Master, level intro cards, answer console, combination-lock key, vault/trophy/fireworks/podium/medals celebration, floating office objects, optional synthesized sound effects, reduced-motion support.
- Build, typecheck and lint pass (two pre-existing unrelated lint errors in `CalcomEmbed.tsx` and `LegalNav.tsx` are known).

### Not built
- Reward payout automation (payouts are manual bank transfers via the admin page; no Tremendous).
- Real-time sockets (the game polls every 2–3 s; fine for 5 players).
- Round timeouts and mid-round disconnects are implemented but were not exercised in a test.
- Native-speaker review of translations.
- Live Stripe endpoint and env vars on Vercel (see section 8).
- Playtest with real people (humour is the biggest remaining risk).

---

## 3. Locked product decisions

- Team-only, 3/4/5 players. No individual play. No pre-built scenarios: everything is built from the players' intake answers.
- Prices: game fee **€30 / €35 / €40 + VAT** (3/4/5 players), reward pool min €100, max €10,000, whole euros, VAT on the fee only. Minimum share per player **20% / 15% / 10%** of the pool. Source of truth: `app/lib/cognitive-rewards-order.ts` (`GAME_FEE_EUR`, `MIN_SHARE_BY_TEAM_SIZE`, `computePoolSplit`).
- The language model **never decides anyone's money**. The split uses only answers checked by code. The final challenge is judged by the model but scored at team level only (scorecard + diagnostic).
- Scoring weights: data transfer 30%, teamwork 30%, problem solving 20%, focus 10%, memory 10%. Title-blind.
- One **game language** per team (host chooses in the lobby); each player can still switch the UI language for buttons and instructions.
- **Personal link lifetime**: joins the lobby before start; reopens your own seat during the game; after the game shows only your result and bank form; once your payout is marked paid (or 30 days after the game) it shows "This game has finished."
- Payout: bank transfer (IBAN) collected in-app, encrypted at rest, wiped 30 days after payment; admin marks paid manually.
- Humour rules: recognition humour and the team's own words only; the Game Master reacts, never invents facts; never a person or a rank as the punchline; intake answers are private to the team (the company gets scores and a diagnostic only).
- No reminder email for bank details (decided 14 Oct).

---

## 4. How a game plays (what the code does today)

1. **Payment** → webhook → `onOrderPaid` → `sendOrderInvitations`: each player gets `/play/<token>` (token stored hashed + an encrypted copy for re-sending links).
2. **Lobby** (`phase: lobby`): "Join the game" is an explicit click (mail scanners prefetch links). When all have joined, a host is picked at random; host sets the game language and presses Start.
3. **Intake** (4 min): six questions, two optional. Private.
4. **Generating**: model call C cleans answers (safety), model call A writes the whole game's text (briefing, per-round titles/setups/reactions, challenge prompt, key lines, outro) as validated JSON with a neutral fallback. One retry on truncated/malformed JSON. ~20–40 s.
5. **Briefing**: host presses "Begin round 1".
6. **Rounds** (2 per player: 6/8/10): templates in order `slot, snack, wifi, replyall, desks, [snack, wifi, replyall, desks…], callback`. Hint after 90 s, 4.5-minute cap, 5 wrong attempts then the answer is revealed and the round fails. "I'm stuck" button; teammates acknowledge → rescue credit if solved within 60 s. A sticky-note **detail catch** is planted in round 2 on one source and needed in the final memory round.
7. **Final challenge** (4 min): host types for the team (others see it live); model call B returns a verdict + rubric score (team-level).
8. **Key ceremony**: everyone enters the same three facts found earlier (free hour, snack total, wifi password). Wrong team attempts reveal blanks after 3 and 5 tries. It never blocks payout.
9. **Scorecard**: scores computed, pool split, payout rows created, result emails sent, celebration shown. Bank form on the share card.
10. **Admin** (`/admin/payouts`, login with `ADMIN_SECRET`): list, reveal IBAN (logged), mark paid (emails the player). IBAN ciphertext purged 30 days after payment.

### Round templates (`app/lib/game/templates.ts`)
| id | mechanic | answer |
|---|---|---|
| `slot` | everyone holds a calendar; find the one hour all are free | hour, e.g. `14` |
| `snack` | everyone sees a shelf; count the team snack, ignore expired | number |
| `wifi` | everyone holds one rule (first letter of…, number of players…); the prompt shows the exact words in play | letters/digits |
| `replyall` | messages scattered across players; order by time; enter minutes of first and last | 4 digits |
| `desks` | 5 desks, 4 things, one empty; each player holds 1–2 clues; deduce positions | 4 digits |
| `callback` | memory: free hour from round 1 + the room number on the sticky note someone saw | number |

A validator proves every player's piece is necessary (removing it leaves ≥2 answers); generation is deterministic from `(gameId, round, attempt)` and retried up to 25 seeds. Stress-tested: 2,304 rounds across 3/4/5 players × 8 languages, all valid.

### Medals (`scoring.ts` highlights)
`mvp` (always first place), `helper` (most assists), `solver` (best problem-solving), `rescuer` (any rescues), `memory` (callback credit). Shown as medals with icons in the game; names "Top Helper / Top Solver / Top Rescuer / Top Memory / MVP" in all 8 languages.

---

## 5. Code map

```
app/lib/cognitive-rewards-order.ts   prices, min shares, computePoolSplit, validation (shared with API)
app/lib/game/
  types.ts        GameView (what the client sees), pieces, content types, CONTENT_LANGUAGES (all 8)
  texts.ts        game-language strings per language (prompts, rules, clues, hints, fallback GM content)
  templates.ts    round generators + validator + hintFor()
  schedule.ts     round plan per team size, detail-catch placement
  rng.ts          seeded PRNG
  openrouter.ts   chat client (JSON, timeouts, truncation detection); models via env
  game-master.ts  calls A (content), B (judge), C (safety) + prompt rules
  service.ts      server-authoritative state machine (loadContext, getView, actions, timeouts)
  scoring.ts      components, team multiplier, split, highlights
  finalize.ts     scores → payouts → result emails (runs once)
  payouts.ts      player bank-details submit, admin session (HMAC cookie), list/reveal/markPaid/purge
  payout-crypto.ts AES-256-GCM encrypt/decrypt, IBAN validation
app/lib/player-invites.ts, join-token.ts   invitations + personal link tokens
app/lib/emails/   email-shell.ts (layout), cognitive-rewards.ts (invite, buyer confirmation), game.ts (result, payout received/sent, buyer summary)
app/api/play/[token]/route.ts (GET state), /action (POST every action), /join
app/api/admin/*   login, logout, payouts/[id]/reveal, payouts/[id]/paid
app/[locale]/play/[token]/page.tsx (lobby), /game/page.tsx (game), app/[locale]/admin/{login,payouts}
app/components/play/   PlayClient (phase router, sound, intros), Lobby, Intake, Briefing, Round, Pieces,
                       Challenge, KeyCeremony, Scorecard, PayoutForm, TeamBar, GameMaster, RoundIntro,
                       PlayArt (scenes, owl, vault, medals, fireworks), PlayIcons, usePlay, useSound
app/components/admin/  AdminLogin, AdminPayouts
app/components/order/  checkout wizard
messages/{en,sv,nl,de,fr,es,it,lt}.json   namespaces: cognitiveRewardsOrder, play, emails, admin (admin is English in all locales)
supabase/migrations/20261013_000001_*  invites columns;  20261013_000002_*  game, scores, payouts tables (both applied)
docs/cognitive-rewards-game-design.md   the design document (why things are the way they are)
docs/stripe-setup.md                    Stripe runbook
```

Design rules: plain CSS in `app/globals.css` with the existing tokens; no UI library; no new runtime dependencies were added (everything uses Next.js, next-intl, Supabase, Resend, Stripe, sharp for icons, Web Audio for sounds).

---

## 6. Services and environment

| Variable | Where | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | local + Vercel | Supabase free plan pauses after ~1 week idle; restore from dashboard if the host stops resolving. |
| `RESEND_API_KEY` | local + Vercel | Domain `wellowork.net` verified; click tracking off (keep it off: personal links). From `noreply@wellowork.net`, reply-to `info@wellowork.net`. |
| `STRIPE_SECRET_KEY` | local (test) + **Vercel (missing)** | Test key used locally. |
| `STRIPE_WEBHOOK_SECRET` | local (CLI secret) + **Vercel (missing)** | A **test-mode** endpoint for `https://www.wellowork.net/api/stripe/webhook` exists (`we_1UQ9ZrCVm1d9JCSOEBE8uHHS`); its secret is in `.env.vercel-test.local` (git-ignored). Live mode needs its own endpoint + secret. |
| `OPENROUTER_API_KEY` | local + **Vercel (missing)** | Models: `OPENROUTER_MODEL_STRONG` (default `anthropic/claude-sonnet-5.5`), `OPENROUTER_MODEL_FAST` (default `anthropic/claude-haiku-5.5`). ~€0.02–0.05 per game. |
| `PAYOUT_ENCRYPTION_KEY` | local + **Vercel (missing)** | 32 bytes base64. **Keep a safe copy**: without it, stored IBANs and link copies cannot be read. |
| `ADMIN_SECRET` | local + **Vercel (missing)** | Password for `/admin/login`. |
| `PAYMENT_MOCK_MODE=true` | local only, temporary | Skips Stripe, marks orders `mock_paid`, sends real invitations. Never set in production. |

Keys that were pasted into chat during this work (Stripe test key, OpenRouter key) should be **rotated** once testing is finished.

---

## 7. How to test a game locally (what worked)

1. `.env.local` with the variables above; optionally `PAYMENT_MOCK_MODE=true`.
2. Start the dev server; `POST /api/orders` with 3 players (use `delivered+name@resend.dev` addresses so nothing reaches real people), then `POST /api/orders/<id>/checkout`. In mock mode this marks the order paid and sends invitations.
3. Recover the players' links: decrypt `cognitive_rewards_order_players.join_token_encrypted` with `decryptSecret()` from `payout-crypto.ts` (needs the same `PAYOUT_ENCRYPTION_KEY`).
4. Open one link in the browser; drive the others through `/api/play/<token>/join` and `/api/play/<token>/action` (`{"action": "start"|"intake"|"begin"|"attempt"|"hint"|"stuck"|"acknowledge"|"challenge"|"submitChallenge"|"key"|"payout", ...}`). Answers can be computed from each player's `view.round.myPiece` (the test driver used in this work did exactly that; it was deleted, it is ~120 lines to recreate).
5. Afterwards delete the test order (cascade removes game, players, payouts) and remove `PAYMENT_MOCK_MODE`.

A full Stripe test-mode payment was also verified once (hosted Checkout → `stripe listen` → webhook → `paid` → success page).

---

## 8. Go-live checklist

1. Vercel env vars: `OPENROUTER_API_KEY`, `PAYOUT_ENCRYPTION_KEY`, `ADMIN_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (test values first, then live). Redeploy.
2. Stripe: Tax registrations (Swedish VAT at least; currently **none**, so Stripe charges €0 VAT); confirm customer emails are on (for "VAT invoice by email"); payment methods are whatever the Dashboard enables (cards, Bancontact, EPS, Klarna, Link, etc. were offered in test).
3. Live Stripe webhook endpoint + its own signing secret; one small real payment to confirm the order flips to `paid`.
4. Add the VAT/org number to the "Sold by" line on the order page (`OrderSummary.tsx` has a TODO); a refund policy page (none exists).
5. Professional checks: VAT treatment of the pool, collecting/disbursing employees' money (payment-services rules), taxable-benefit note in the terms, GDPR wording of the colleague-data checkbox.
6. Native review of sv/lt (at least) for legal, pricing and game strings; the Game Master output quality in each language.
7. Playtest with 3–5 real colleagues; tune reactions and timings.

---

## 9. Open items and ideas

**Decisions still open**
- Whether to move payouts to a reward-link provider (Tremendous/Runa) later instead of manual transfers.
- Real-time sockets instead of polling (only if games get bigger or laggy).
- Whether players may also get a short "join a call first" reminder in the invitation (the lobby says it; the email does not).

**Known limitations**
- Admin page is English only.
- Medal icons are not in emails (plain text names only).
- The first slot round's "hour" is reused for the key ceremony; a 4/5-player game has two desk rounds and two wifi rounds with different parameters (fine) but the same template names in the Game Master titles (the model varies them).
- Fireworks and sounds were tuned by eye; sounds are off by default.

**Ideas discussed but not built**
- A 5-desk floor-plan illustration that fills in as clues are shared.
- Making the "I'm stuck" flow richer (teammates get a prompt about *which* piece is missing).
- Pods for teams larger than 5.

---

## 10. Resume prompt

```
I'm John, building Cognitive Rewards (a team game sold by WelloWork, wellowork.net). The attached handoff (docs/cognitive-rewards-handoff-2026-10-14.md) describes exactly what is built, verified and deployed on main, and what is open. Read it fully, then summarise where we are in 8 lines, list what you'd check first, and then help me with: [playtest tuning / go-live checklist / payouts provider / real-time / something else].

Working style: honest pushback, keep scope tight, say what is NOT part of a task, verify in the browser, no new dependencies without asking, never run a live payment.
```
