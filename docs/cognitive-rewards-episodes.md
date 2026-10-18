# Cognitive Rewards: the episode engine (18 October 2026)

Every game is now one **episode of the team's own series**: a new world, a new premise, a new sequence of rounds and a twist, generated when the game starts. A team that plays again gets the next episode, with a "previously on" line and a world they have not played yet.

This replaces the fixed six-template office game described in `cognitive-rewards-game-design.md` §4. Everything there about server authority, the validator, the money split and the model never touching money still holds.

## Why

User feedback after the first playtests:

1. The game has two challenges, cognitive and communication. Companies pay for communication; people don't want to solve puzzles after work. So the cognitive part should serve exploring and talking, not the other way round.
2. Each game should feel like an episode of a series (Friends, House, Black Mirror): its own setting and conditions, so playing again is exciting, not a repeat.
3. It should feel more visual and animated.

## What decides what

| Layer | Who makes it | When | Why |
|---|---|---|---|
| **Mechanics** (the puzzle grammar) | Code, `templates.ts` + `talk.ts` | Fixed | The validator proves every piece is necessary. That is what makes the split fair and voice-proof. A model cannot invent a mechanic that passes it. |
| **Worlds** (setting, art, tone brief, premises) | Authored once, `worlds.ts` + `WorldArt.tsx` | Reviewed before release | Art, translation and humour safety need review. |
| **Episode** (title, cold open, scenes, reactions, challenge, teaser, in-world names) | The model, `game-master.ts` call A | At game time | This is the part that should feel new every time. |
| **Structure** (world, premise, round order, twists) | Code, `episode.ts` | At game time, seeded by the game id | Deterministic, so a retried generation plans the same episode. |

## How an episode is built

1. **Lobby vote.** When everyone has joined, the lobby offers three worlds: ones nobody on the team has played first, then the ones played longest ago. Each player taps one or "Surprise us". Most votes wins; a tie goes to the host's pick if it is tied, else a seeded draw. Stored in the event log (`episode_offer`, `world_vote`).
2. **Plan** (`planEpisode`). Round 1 is always the calendar (its hour feeds the memory round and the key). Round 2 carries the sticky note. The last round is memory. The middle is sampled with weights that favour talk rounds; the constraints below are tested on every build. One premise of the world the team hasn't had. One twist in a 6-round episode, two in longer ones.
3. **Game Master** (call A). Gets the world brief, how the team's answers live in that world, the premise, the round list with twists, and the previous episode's title. Returns the episode text plus a **skin**: in-world names for shelves, decoy snacks, the chat log, the secret code and the sticky note. Every skin field is validated (no digits, no quotes, lengths, counts) and falls back to the office text field by field. If the model fails entirely, the game plays the classic office episode.
4. **Rounds** are generated after the content so they can use the skin.

### Plan constraints (`episode.test.ts`)

- 2 × team size rounds; everyone solves exactly twice; no template twice in a row.
- At least two-thirds of the middle rounds are talk rounds, using at least two different talk mechanics.
- At most one deduction round (desks), and only in 8- and 10-round episodes.
- At least two different fact rounds, so the key ceremony always has three facts.
- Twists never on round 1, the sticky-note round or the memory round. Flash only on picture rounds.

## Talk rounds (new, `talk.ts`)

All pieces are pictures drawn by the UI, so they have to be described, not read out.

| Round | Sources see | Solver | Answer |
|---|---|---|---|
| **Common ground** | Six picture cards (object + colour). Exactly one card is in every hand, including the solver's. Near misses (same object, other colour) force precise description. | Taps the shared card in their own hand | Card id |
| **Line-up** | One feature of a face, drawn alone on a blank head (hat, glasses, facial hair, hair colour or shirt colour) | Six faces; taps the one that matches | Face number |
| **Blueprint** | One or two rows of a coloured tile pattern | Paints an empty grid | The grid |

Tap-to-answer rounds allow two misses instead of five, because the options are visible. Faces use a neutral, non-skin tone on purpose: no round asks anyone to describe skin. Colours (red, blue, yellow, black) differ in lightness as well as hue for colour-vision deficiencies.

## Twists

- **Flash:** sources see their piece for 30 seconds, then the server stops sending it. They describe it from memory.
- **Rush:** 150-second cap and the hint at 50 seconds, instead of 270 and 90.

## Team memory

No new tables or columns. The episode record (world, premise, number, title, "previously" line, teaser) is stored inside the game's `content` JSON. Teams are matched on the player emails the orders already store:

- **Exactly the same players** = the same series: the episode number continues and the Game Master gets the previous title.
- **Any shared player** = worlds to offer last.
- Games from before this engine count as an office episode.

The episode record holds no team answers.

## Scoring

Communication first: sharing 35%, teamwork 35%, solving 15%, focus 7.5%, memory 7.5% (was 30/30/20/10/10). The component keys are unchanged, so the scorecard, emails and company diagnostic did not change. Copy now says "helping counted for 70%, solving for 30%".

## Stuck flow

"I'm stuck" now asks the solver whose piece they need again (or everyone). The named teammates get a direct ask; everyone gets a tip for that round type ("go row by row, left to right") and the Game Master's stuck nudge for the round, which was generated before but never shown.

## Adding a world

1. Add an entry to `WORLDS` in `app/lib/game/worlds.ts`: label and tagline in all 8 languages, the English brief, mapping and four premises, and an 8-object card deck.
2. Add its scene to `WorldScene` in `app/components/play/WorldArt.tsx`.
3. Add a `.world-<id>` tint in `app/globals.css`.
4. Run `npm test`.

## Known limits

- Four worlds (office, station, heist, studio). A team that plays a fifth time sees a world again, with a new premise and round sequence.
- The witness and line-up pictures have generic screen-reader labels; card and tile names are read out.
- All new strings in sv, nl, de, fr, es, it and lt were written without native review, like the rest of the game. Review sheet with every string changed on 18 October, all languages side by side: `docs/translation-review/cognitive-rewards-2026-10-18.csv`.
- Playtests without money: `docs/cognitive-rewards-playtest.md` (`npm run playtest`, `npm run playtest:cleanup`). Mock-paid games are test games: no bank details, no payout rows, no result emails.
- The model sometimes describes the setup loosely (for example "three partial memories" when two people hold rows). Setups are flavour only; the task text under them is exact.
