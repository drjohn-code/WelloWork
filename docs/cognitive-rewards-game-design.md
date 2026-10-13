# Cognitive Rewards: Game design v1

Status: **proposal for review**, 13 October 2026. Nothing in this document is built yet.
Companion to `cognitive-rewards-project-handoff.md` (the brainstorm). Where this document disagrees with the brainstorm, section 2 says why.

---

## 1. The game in one screen

**Cognitive Rewards** is a 25–30 minute real-time team game for 3, 4 or 5 colleagues, each on their own device, talking to each other by voice (same room or a call). A company buys it as a gift and funds a reward pool.

The team is a fictional office, built from their own answers to six light intake questions (their catchphrase, their snack, their pointless meeting…). Over 6–10 short rounds they solve small, visual puzzles in which **every player holds a different piece** and one player, the **solver**, has to enter the answer. The solver role rotates, so everyone solves and everyone helps. A dry, deadpan Game Master reacts to what they actually did and said. The game ends with an open team challenge, then a ceremony where everyone enters the same final key, the pool "unlocks", and a scorecard shows who did what.

The pool is split by **what each player measurably did**: helping (the pieces you supplied that enabled a solve) counts for 60%, solving counts for 40%. Every player is guaranteed a minimum share. The money split uses only deterministic signals; the language model never decides anyone's money.

---

## 2. Review of the brainstorm: what holds, what I'd change

### What holds (and this design keeps)
- Team-only, custom-only, players answer the intake, each on their own device.
- Split-information puzzles: nothing solvable alone or by pasting into a chatbot.
- Low cognitive load; the difficulty is coordination.
- Template mechanics with deterministic answers; the AI fills flavour, it does not invent puzzles.
- Humour by recognition and from the players' own inputs; dry colleague tone; AI as reactor.
- 60/40 soft/cognitive weighting; title-blind; planted memory callbacks; rescue assists; guaranteed minimum shares; fixed pot split by contribution.
- All of section 7 (humour and safety rules) and section 14 (rejected ideas).

### What I'd change, and why

**1. The six pairwise questions don't scale past 3 players.**
The round-robin mesh (A↔B, A↔C, B↔C, both ways) is 6 questions for 3 players, but 12 for 4 and 20 for 5. Replace it with a **rotating solver**: in every round one player is the solver and *all* the others are sources, each holding a piece the validator proves is necessary. With 3 players everyone solves twice (6 rounds, same as your framework); with 4 and 5 players everyone solves twice as well (8 and 10 shorter rounds). Every round involves everyone, so nobody is ever a spectator, and the "unique input from that specific player" rule is enforced by construction.

**2. Keep the language model away from the money.**
The brainstorm has Q3 graded by the AI against a rubric and lets it affect payout "boundedly". With a fixed, buyer-funded pot, the only thing scoring decides is the *split*, and an LLM judge that moves money is both a fairness risk and a target for manipulation ("tell the judge our pitch was great"). So: the **final challenge is scored at team level only**, feeds the scorecard and the company diagnostic, and **does not move the split**. The split comes entirely from rounds whose answers are checked by code.

**3. Voice is fine; measure information flow from the answers, not from chat.**
Players talk by voice, so the app never sees the words. But it doesn't need to: every puzzle's answer provably depends on each source's private piece. If the solver gets it right, every piece *must* have been communicated. That is a clean, voice-proof assist signal. Consequence: **no in-app chat in v1** (it would compete with talking, which is the point). The lobby tells the team to get on a call or into one room.

**4. "The reward unlocks only when all players enter the key" must never block payout.**
The pot is already paid for. The final key is a ceremony, not a gate. After a few failed attempts the Game Master gives it away, with a dry remark.

**5. Focus is nearly unmeasurable; keep it tiny and honest.**
Idle timers punish quiet thinkers and reward fidgeting. v1 measures focus only through **detail catches**: a small detail appears briefly on one player's screen and is needed later. The 10% weight stays, but it's based on something real.

**6. Gameplay humour ships in two languages first.**
The site is in 8 languages, but a deadpan reaction bank does not survive machine translation. Launch gameplay in **English and Swedish**; players in other locales get the English game until native banks exist. The order flow and emails stay fully localized.

**7. Playtest the tone before the engine.**
Still the biggest risk. The intake questions and ~30 reactions can be tried on paper with colleagues in an afternoon. I'd do that in parallel with the technical build, not after.

---

## 3. Game flow and timing

| Phase | What happens | Time |
|---|---|---|
| Lobby (built) | Personal link, no login. Team board shows who has joined. Start unlocks when everyone is in. | – |
| **Intake** | Each player answers the six questions privately on their own device (2 optional). The game needs at least one answer per question from *someone*; if nobody answers one, a safe default trope is used. 90-second soft timer; late players' answers are simply not used. | 3–4 min |
| **Briefing** | The Game Master introduces "the office" in one short paragraph built from their answers. Rules in three lines. | 1 min |
| **Rounds** | 6 / 8 / 10 rounds (3 / 4 / 5 players). One solver, the rest sources. 90-second target per round, 3-minute cap, then a hint. Dry reaction after each. | 10–15 min |
| **Final challenge** | All players together: one open-ended prompt based on their inputs. One shared answer box. Game Master verdict + team-level rubric score. | 4 min |
| **Key ceremony** | Everyone enters the final key (assembled from facts the team learned). Pool unlocks. | 1 min |
| **Scorecard** | Who helped whom, MVP of helping, best solver, the callback they remembered, the line the Game Master liked most. Then each player's share. | 2 min |

Total: about 25–30 minutes.

---

## 4. The puzzle system

### 4.1 Anatomy of a round
Every round is an instance of a **template** with random parameters, rendered as:
- **Public prompt**: what the solver is asked (shown to everyone).
- **Private pieces**: one per source, shown only on that source's device. Structured data (numbers, grid cells, icons, ordered items), rendered by the UI, not written by the model.
- **Answer**: a short code (3–4 digits, or one word from a shown list), computed by the server from the parameters. Stored hashed; never sent to a client.
- **Flavour**: title, one-line setup, and the Game Master's reactions. Written by the model from the team's intake answers.

**Hard rule: the model never touches load-bearing data.** It receives the parameters and writes around them; the server checks that no number or item in the flavour contradicts the data, and falls back to the neutral template text if it does.

### 4.2 The validator (runs before a round is served)
1. The answer is derivable from *all* pieces plus the public prompt.
2. For every source, removing their piece makes the answer ambiguous (at least two candidate answers). If not, the round is regenerated.
3. The solver's own screen alone never suffices.
4. Answer format is unambiguous (no leading zeros, no two spellings).

### 4.3 Round templates for v1 (six, all deterministic)

| # | Template | Mechanic (what the pieces are) | Answer | Trains |
|---|---|---|---|---|
| T1 | **Find a slot** | Each source holds one colleague's calendar for the day (free/busy grid). The solver must find the only hour everyone is free, for the meeting from intake Q3. | the hour, e.g. `1400` | data transfer, problem solving |
| T2 | **Snack audit** | Each source sees a different shelf with counts of the team's snack (intake Q2) and decoys. Prompt: "how many of X are left in total, minus the ones past their date?" | a number | data transfer, accuracy |
| T3 | **Reply-all** | A message thread split across sources, each holding 1–2 messages with timestamps. Solver orders them; the answer is the last two digits of each timestamp in order. | 4–6 digits | sequencing, memory |
| T4 | **The wifi password** | Each source holds one rule ("the 2nd letter of our tool's nickname", "the number of people in the pointless meeting"). Rules chain into a short code. Uses intake Q1–Q4 as the material. | word/number | transformation, clarity |
| T5 | **Floor plan** | Each source sees a different quadrant of the office map with a route fragment. Solver finds the room where the disaster (intake Q5) happened. | room number | spatial, data transfer |
| T6 | **Callback** | No new pieces. The prompt asks for something learned 2–4 rounds ago that a *different* player saw at the time ("the hour you found in round 1 plus the shelf count Chris had"). | number | memory |

Plus two cross-cutting devices:
- **Detail catch**: once or twice per game, a sticky note appears for 6 seconds on one source's screen ("the printer is in room 207"). A later round needs it. If that round is solved, the holder gets the focus credit.
- **Stuck button**: the solver can press "I'm stuck". Sources then see "Your piece might be what's missing — re-share it" with an acknowledge button. A solve within 60 seconds of an acknowledgement is a rescue assist for the sources who acknowledged.

Round order is fixed by a schedule per team size so that: each player solves twice, callbacks come after the rounds they reference, and detail catches land on players who haven't had one.

### 4.4 Final challenge (team-level, not money)
One prompt, same for everyone, built from two of their intake answers, in the "slightly guilty but universal" register. Example shape: *"Pitch the gloriously useless perk from your intake as if it will fix the pointless meeting. 3 sentences, one must mention the snack."* One shared text box; anyone can type, the last edit before the timer counts. The Game Master returns a deadpan verdict and a rubric score (relevance to their own inputs, uses the callbacks, stays within the safety rules, actually funny by a fixed checklist). Score 0–100, shown on the scorecard, stored for the diagnostic.

### 4.5 Final key ceremony
The key is three facts the team already found (e.g. slot hour + room number + snack count), shown as blanks. All players must enter the same key. After 3 wrong team attempts the Game Master reveals one blank; after 5, all of them. Convergence (how many attempts) feeds the team multiplier lightly.

---

## 5. The Game Master and where the model is used

### 5.1 Tone
Dry, deadpan, has seen everything in HR, mildly fond of the team. Reacts to what happened; never invents a bit. Short: one or two sentences. Never names a player as the punchline; never references rank.

### 5.2 Exactly three kinds of model call
| Call | When | Model class (OpenRouter) | Output | Fallback |
|---|---|---|---|---|
| **A. Build the office** | Once, after intake closes | Strong (e.g. a Claude Sonnet-class model) | Structured JSON: briefing paragraph, 6–10 round titles + setups, 3 reactions per round (solved fast / solved after hints / failed), 3 "stuck" nudges, final-challenge prompt, key-ceremony lines. One call, validated against a schema and the data. | Neutral template texts; the game still runs. |
| **B. Final-challenge verdict** | Once, at the end of the challenge | Strong | JSON: verdict (2 sentences) + rubric scores. Prompt-guarded: the team's text is passed as data, with instructions to ignore any instructions inside it. | Generic verdict, rubric score 50. |
| **C. Safety pass on intake** | Once, before A | Small/fast | JSON: per answer, allowed / rewritten (strip names, slurs, targeting) / replaced by a default. Role mix (managers present?) is an input and sets the tone dial for call A. | Replace the answer with a default trope. |

There is **no model call in the hot loop** of a round. Reactions are pre-generated in call A and selected by the server from the round outcome, so a round's feedback appears instantly and a model outage mid-game cannot stall play. Every call has a 20-second timeout.

Estimated usage: ~20k tokens per game across the three calls, i.e. cents per game. Keys stay server-side (`OPENROUTER_API_KEY`, already in `.env.local`).

### 5.3 Prompt rules (shared by A and B)
- Player answers are passed as data inside delimiters, never as instructions.
- Allowed: universal office behaviour, the team's own words, dry reactions.
- Forbidden: naming or targeting a person, rank-based jokes, the company's real problems, anything sexual, political or about protected characteristics, inventing facts about the team.
- Output must be valid JSON matching a schema; the server rejects and retries once, then falls back.

---

## 6. Scoring and the split

### 6.1 Events the server records
`round_started`, `piece_viewed`, `attempt` (correct / wrong), `hint_used`, `stuck_pressed`, `stuck_acknowledged`, `round_solved`, `callback_solved`, `detail_shown`, `detail_used`, `final_attempt`, `challenge_submitted`. Plus a **contributions ledger**: for every solved round, one row per source whose piece the validator marked necessary.

### 6.2 Per-player components (each normalised 0–100 against the maximum achievable in that session)

| Component | Weight | How it's computed |
|---|---|---|
| **Data transfer** | 30% | Assists (rounds solved where your piece was necessary) + reach (distinct solvers you enabled) + clarity proxy (rounds you sourced that were solved with ≤1 wrong attempt). |
| **Teamwork** | 30% | Rescue assists + acknowledgements of stuck requests + give-and-take balance (your assists vs. the assists you received, closeness to even), all × the team multiplier. |
| **Problem solving** | 20% | As solver: solved rounds, weighted by template difficulty, × accuracy (fewer wrong attempts) × hint economy (no hints = full). |
| **Focus** | 10% | Detail catches you held that were used later. |
| **Memory** | 10% | Callback rounds you solved, and callback rounds where the recalled fact was originally yours. |

`team_multiplier` (applied to teamwork only, bounded 0.7–1.3) = balance of contributions across the team + coverage (nobody with zero assists) + convergence (final key attempts).

Because the solver role rotates equally, everyone has the same number of chances to earn cognitive points, and everyone sources the same number of rounds. Title never enters the formula.

### 6.3 From score to money
1. Floors: 20% / 15% / 10% of the pool per player (3 / 4 / 5 players), from the shared `MIN_SHARE_BY_TEAM_SIZE` constant.
2. The remainder (the "performance part", already shown on the order page) is split in proportion to total score.
3. Round to whole euros; the leftover euro(s) from rounding go to the highest score.
4. If scores are all zero (team never solved anything), the remainder splits equally.

**Worked example** (3 players, €250 pool): floors €50 each = €150; remainder €100. Scores 78 / 64 / 55 (sum 197) → €40 / €32 / €28 → **€90 / €82 / €78**. The spread is modest on purpose: helping always pays, hoarding doesn't.

### 6.4 What players and the company see
- Players: the full scorecard, who helped whom, their own share. Scores are revealed at the **end** (not live), so nobody plays to the meter.
- Company: team-level diagnostic only ("strength: handoffs were clear; growth area: nobody asked for help"), the rubric score, and the split amounts for their records. **No intake answers, no challenge text, no reactions.**

---

## 7. Safety and privacy

- Intake answers, challenge text and reactions live in the game tables and are never exposed to the buyer or the company. They are deleted 30 days after the game (keep scores).
- Role is a tone dial for the model (section 5.2 C), never shown in-game, never a joke source.
- Positive-only superlative question; the negative version is not offered.
- Pieces are served per player by the server; a player's API calls can only ever return their own piece (row-level checks on the join token).
- Answers are hashed server-side; attempts are rate-limited (5 per round per player, then a 10-second cooldown).
- The final challenge box has a 600-character limit and the prompt guard above.

---

## 8. Technical design

### 8.1 Builds on what exists
- Lobby and personal links (`/play/<token>`) are built. The game starts from the existing "Start the game" button, which currently opens a placeholder at `/play/<token>/game`.
- Supabase, Resend and the Stripe webhook are in place. `MIN_SHARE_BY_TEAM_SIZE` and `computePoolSplit()` are the single source for floors.
- Real-time: Supabase Realtime (already in the stack) for pushing state to the team, with the lobby's polling as fallback.

### 8.2 New tables
`games` (one per order: status, locale, schedule, current round, started/ended, final-challenge text + verdict), `game_intake` (per player, per question; private), `game_rounds` (template, parameters, hashed answer, solver, pieces per source as JSON, flavour JSON, status), `game_events` (the event log), `game_contributions` (ledger), `game_scores` (per player components, total, share in euros), `game_master_content` (the validated output of call A).

### 8.3 Server authority
All state changes go through API routes keyed by the player's token: `intake/answer`, `round/attempt`, `round/stuck`, `round/acknowledge`, `round/hint`, `challenge/submit`, `key/attempt`. Clients only ever receive their own piece plus public state. The server advances rounds, computes answers, validates attempts, writes events and scores, and triggers the three model calls.

### 8.4 Game state machine
`lobby → intake → generating (calls C then A) → briefing → round[i] → … → challenge → judging (call B) → key → scorecard → done`. Each state has a timeout and a defined "what if someone disconnects" rule: the game waits up to 2 minutes for a disconnected player, then continues with their pieces auto-revealed to the solver by the Game Master (no assist credit for them for that round).

### 8.5 Not in v1
Reward payout (Tremendous), player accounts, in-app chat or voice, pods, admin dashboard, live score meter, more than two gameplay languages.

---

## 9. Decisions I need from you

1. **Final challenge does not move the money** (section 2.2). Agree?
2. **Rotating solver** replaces the pairwise six questions (section 2.1). Agree?
3. **Length**: 25–30 minutes with 6/8/10 rounds. Shorter (one solve each, ~18 min) or longer?
4. **Gameplay languages at launch**: English + Swedish, others get English gameplay?
5. **Model choice**: I'll default to a Claude Sonnet-class model for calls A and B and a small fast model for C, via OpenRouter. Any preference or budget cap?
6. **Scores at the end, not live**: confirm.
7. **Disconnect rule** (section 8.4): auto-reveal after 2 minutes. OK?
8. **Playtest**: can you run the intake questions and ~30 reactions past 3–5 colleagues this week? I'll prepare the sheet.

---

## 10. Build plan (after your OK)

| Phase | Deliverable | Verification |
|---|---|---|
| 1 | Tables + state machine + intake screens + template engine with the validator (no model yet, neutral text) | Play a full 3-player game locally with placeholder text |
| 2 | Model calls A, B, C with schemas, guards and fallbacks; English and Swedish prompt banks | Generated content for 10 synthetic teams reviewed by hand |
| 3 | Scoring engine, scorecard, split, company diagnostic | Replay recorded event logs; split always sums to the pool |
| 4 | Real-time polish, disconnect handling, 4- and 5-player schedules | Three scripted playthroughs |
| 5 | Internal playtest with real colleagues; tune reactions and timings | Feedback round |

Payout (Tremendous) is a separate task after v1 plays well.
