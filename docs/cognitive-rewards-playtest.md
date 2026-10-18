# Cognitive Rewards: running a playtest (no money)

A real game for 3–5 colleagues, played on their own phones or laptops, served from your Mac. Nothing is charged and nothing is paid out. Stripe and Vercel are not touched.

| What | Cost |
|---|---|
| Payment | None. Checkout is skipped (mock payment); the order is marked `mock_paid`. |
| Payouts | None. Test games show the split but never ask for bank details and create no payout rows. |
| Emails | Real invitation emails via Resend (free tier). Result emails are not sent for test games. |
| Game Master | About €0.02–0.05 per game on OpenRouter. |

## Before the day

- Everyone, including your Mac, must be on **the same Wi-Fi** (or your phone's hotspot). The invitation links point to your Mac's address on that network, so they do not work from home or on mobile data.
- 3–5 players plus you as observer. Book 40 minutes: 5 to set up, 25 to play, 10 for feedback.
- Players on a call or in one room. They will be talking the whole time.
- Use their real work emails so they get the real invitation.

## On the day

1. Connect your Mac to the Wi-Fi the players will use.
2. In the project folder run:

```bash
npm run playtest
```

   It builds the site (about a minute) and prints two addresses, for example `http://192.168.1.23:3000`. If macOS asks whether "node" may accept incoming connections, click **Allow**.
3. On your Mac open the printed **order** address and order a game like a customer would: team size, the players' names and emails, any reward pool. The checkout completes instantly without payment.
4. Everyone gets an invitation email. They open it **on the same Wi-Fi** and press Join.
5. Let them play. Don't explain the game; the briefing and rules should be enough. Note where they get confused.
6. When the scorecard shows, hand out the feedback questions below.
7. Stop the server with `Ctrl+C`.

## Afterwards

```bash
npm run playtest:cleanup
```

shows the test orders it would remove. Then remove them:

```bash
npm run playtest:cleanup -- --yes
```

Only orders with status `mock_paid` are ever touched. Real orders are not.

Note: `npm run playtest` leaves a build in `.next` that points at your network address. `npm run dev` is unaffected; if you ever run `npm start` afterwards, run `npm run build` first.

## Troubleshooting

| Problem | Fix |
|---|---|
| A player's link doesn't load | They are not on the same Wi-Fi, or the Mac firewall blocked node. Check System Settings → Network → Firewall. |
| The printed address is wrong (VPN) | Turn the VPN off and restart `npm run playtest`. |
| "Building the game" takes over a minute | The Game Master call is slow; it retries automatically and falls back to the classic office episode. |
| Someone closes the tab | Their personal link reopens their seat. |

## What to watch (observer sheet)

Write down the round number and what happened. These are the open questions:

1. **Do the talk rounds make people talk?** Who describes, who asks back, does anyone go quiet?
2. **Common ground (cards):** do they find the shared card by describing, or by guessing? How long does it take?
3. **Line-up (faces):** too easy or too hard? Do witnesses describe the picture or just name it?
4. **Blueprint (grid):** does the solver repeat things back? Do rows get mixed up?
5. **Flash twist (pieces vanish after 30 s):** fun pressure or frustrating?
6. **Rush twist (150 s):** enough time?
7. **"I'm stuck":** does anyone use it? Does asking a named teammate help?
8. **The vote and the episode title:** do people react to the world and the cold open?
9. **The Game Master:** any line that falls flat, confuses, or is not okay in a work setting? Write it down word for word.
10. **The results:** does everyone seem okay with their title? Does anyone ask about the money split?

## Feedback questions (players, 3 minutes)

Copy these into a form or ask them out loud.

1. How much did you talk with your teammates? (1 = barely, 5 = the whole time)
2. How mentally tiring was it? (1 = relaxing, 5 = exhausting)
3. Which round did you enjoy most, and which least? Why?
4. Was anything unclear about what to do? Where?
5. Did the world and story make it more fun, or did you ignore them?
6. How did you feel about your title at the end? (1 = bad, 5 = great)
7. Did any joke or line feel off?
8. Would you play another episode with the same team? (yes / maybe / no)
9. Anything else?
