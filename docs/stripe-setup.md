# Stripe setup — Cognitive Rewards checkout

Hosted Stripe Checkout for the Cognitive Rewards order flow. Buyer pays
**game fee + VAT (Stripe Tax) + reward pool** in one payment, guest checkout,
currency EUR. This doc covers what's already wired in code and — separately —
what only you can do in the Stripe Dashboard.

Related code:
- `app/api/orders/route.ts` — creates the pending order (unchanged by this integration).
- `app/api/orders/[orderId]/checkout/route.ts` — creates the Checkout Session.
- `app/api/stripe/webhook/route.ts` — the only place an order is ever marked `paid`.
- `app/lib/stripe.ts` — Stripe client + tax code constants.
- `app/lib/order-fulfillment.ts` — the `onOrderPaid` seam (see §5).
- `supabase/migrations/20260702_000001_cognitive_rewards_orders_stripe.sql` — schema migration (see §6).

## 1. Environment variables

Server-side only — never prefix either with `NEXT_PUBLIC_`. The buyer's
browser is redirected to the Checkout Session's own `url`, so no publishable
key is used anywhere in this integration.

| Variable | Where it comes from | Notes |
|---|---|---|
| `STRIPE_SECRET_KEY` | Dashboard → [API keys](https://dashboard.stripe.com/test/apikeys) | `sk_test_…` while in sandbox, `sk_live_…` after go-live. |
| `STRIPE_WEBHOOK_SECRET` | `stripe listen` (local) or Dashboard → Webhooks (deployed) | Different value for local vs. each deployed environment — see §3. |

Set both in `.env.local` for local dev, and in your deploy target's env var
settings (e.g. Vercel project settings) for staging/production. See
`.env.example` for the same entries with inline comments.

If either is missing, the checkout route and webhook route both fail
gracefully (503 with a logged error) instead of crashing — same pattern as
`getSupabaseServerClient()` / the Resend client elsewhere in this codebase.

## 2. Manual Stripe Dashboard steps (cannot be done in code)

Do these once per Stripe account/mode (test and live are separate):

1. **Enable Stripe Tax.** Dashboard → Tax → "Get started" / Settings. Without
   this, `automatic_tax: { enabled: true }` on the Checkout Session will error.
2. **Add your tax registrations.** Tax → Registrations:
   - Swedish domestic VAT registration (WelloWork AB is Swedish, so this is
     the baseline — VAT applies to the game fee for Swedish buyers and,
     absent a registration elsewhere, is the fallback for EU sales).
   - Register for the **EU OSS (One-Stop Shop)** scheme if WelloWork sells to
     consumer (non-VAT-registered) buyers in *other* EU countries — OSS lets
     you remit their local VAT without registering in each country
     individually. B2B buyers who supply a valid VAT ID get reverse charge
     instead (see §4) and don't need OSS.
   - Without registrations, Stripe Tax calculates what tax *would* apply but
     WelloWork won't be registered to collect it in that jurisdiction — do
     this before going live.
3. **Confirm the product tax codes.** This integration sets tax codes
   per-line-item in code (`app/lib/stripe.ts` → `STRIPE_TAX_CODE`), so the
   Dashboard's account-level default tax code doesn't apply to these two line
   items — but check Tax → Settings for the account default anyway in case
   other products get added later.
4. **Set Checkout branding.** Settings → Branding: logo, brand color,
   business name. Also confirm **support email** and **Terms of Service /
   Privacy Policy URLs** under Checkout settings — Stripe surfaces these on
   the hosted payment page.
5. **Enable card payment methods.** Settings → Payment methods → make sure
   Cards is on (it is by default in test mode). Add others (e.g. SEPA Direct
   Debit) later if WelloWork wants them — no code change needed, Checkout
   auto-offers whatever's enabled and eligible for the currency/locale.
6. **Register the webhook endpoint + copy its signing secret** — for both
   environments:
   - **Local**: no Dashboard registration needed — see §3, `stripe listen`
     prints a `whsec_…` secret each time you run it.
   - **Deployed**: Dashboard → Developers → Webhooks → "Add endpoint".
     - URL: `https://<your-deployed-domain>/api/stripe/webhook`
     - Events to send: `checkout.session.completed`,
       `checkout.session.expired`, `payment_intent.payment_failed`.
     - Copy the "Signing secret" into `STRIPE_WEBHOOK_SECRET` for that
       environment. It's shown once at creation and re-viewable from the
       endpoint's detail page afterward.

## 3. Testing in sandbox

1. Install the [Stripe CLI](https://docs.stripe.com/stripe-cli) if you
   haven't (`brew install stripe/stripe-cli/stripe`), then `stripe login`.
2. Run the app locally (`npm run dev`) and, in a second terminal:
   ```
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   This prints a `whsec_…` value — put it in `STRIPE_WEBHOOK_SECRET` in
   `.env.local` and restart `npm run dev` so it picks it up.
3. Walk through the wizard at `/cognitive-rewards/order`, submit, and you'll
   be redirected to a real (sandbox) Stripe-hosted Checkout page.
4. **Test cards** ([full list](https://docs.stripe.com/testing)):
   - `4242 4242 4242 4242` — succeeds immediately, any future expiry/CVC/ZIP.
   - `4000 0025 0000 3155` — requires 3-D Secure; Checkout shows an
     authentication challenge modal, click "Complete" to simulate approval.
   - `4000 0000 0000 9995` — always declines (`payment_intent.payment_failed`).
5. **Tax scenarios to verify** (billing address entered at Checkout drives
   this, since `automatic_tax` is on):
   - **Swedish buyer** (billing address in Sweden, no VAT ID entered): VAT
     charged on the game fee at the Swedish rate.
   - **Consumer in another EU country** (e.g. billing address in Germany, no
     VAT ID): VAT charged at that country's rate (requires OSS registration
     per §2 to be legally collectable — Stripe Tax will still calculate it
     regardless of registration status).
   - **EU business with a VAT ID** (enter a valid VAT ID at the
     `tax_id_collection` prompt during Checkout): reverse charge applies — €0
     VAT on the game fee, VAT ID recorded on the invoice.
   - **Reward pool never taxed**, in every scenario above — it's tagged
     `txcd_00000000` (Nontaxable), so its VAT line should always read €0
     regardless of buyer location or VAT ID.
6. After a successful test payment, confirm in order:
   - The Stripe CLI terminal logs `checkout.session.completed` and your dev
     server logs `[order-fulfillment] Order <id> paid — fulfillment not yet
     implemented.` (see §5).
   - The order row in Supabase (`cognitive_rewards_orders`) has
     `status = 'paid'`, `stripe_payment_intent_id` set, `paid_at` set.
   - The browser lands on `/cognitive-rewards/order/success` showing the
     "Payment received" summary.
7. Test the **decline card** and confirm the order ends up `status = 'failed'`.
8. Test **cancelling** (leave the Checkout page via its back link) and
   confirm you land back on `/cognitive-rewards/order?checkout=cancelled…`
   with the cancelled banner, and that the order is left in whatever state it
   was in (still `pending_payment`/`awaiting_payment` — cancelling from the
   Checkout page itself does not fire `checkout.session.expired`; that event
   only fires ~24h later if the session is simply abandoned. Both paths are
   handled — see `app/api/stripe/webhook/route.ts`).

## 4. Go-live checklist

1. Switch `STRIPE_SECRET_KEY` to the `sk_live_…` key (Dashboard → API keys,
   toggle out of test mode first) in your production environment variables.
2. Register the **live** webhook endpoint (§2, step 6) — this is a *separate*
   endpoint registration from the test one, with its own signing secret. Set
   `STRIPE_WEBHOOK_SECRET` in production to that secret.
3. Re-confirm §2 steps 1–5 are done in **live mode** specifically — test-mode
   configuration (tax registrations, branding) does not carry over.
4. Run one small real transaction end-to-end (e.g. the 3-player game with the
   €100 minimum reward pool) with a real card, and verify it appears correctly
   in Stripe Dashboard → Payments, generates an invoice, and marks the order
   `paid` in Supabase.
5. Monitor Dashboard → Developers → Webhooks → your endpoint for delivery
   failures in the days after launch (a non-2xx response there means an order
   silently didn't get marked paid — check server logs for
   `[stripe-webhook]` entries first).

## 5. The `onOrderPaid` fulfillment seam

`app/api/stripe/webhook/route.ts` calls `onOrderPaid(orderId)`
(`app/lib/order-fulfillment.ts`) exactly once, immediately after a webhook
verifies `checkout.session.completed` and marks the order `paid`. Today it
only logs — **no emails, no player onboarding, no payout are triggered**.
Player invitations, OTP login, the game itself, and the reward payout
(Tremendous or similar) are separate, later tasks that will fill in this
function. Do not add that logic anywhere else — this is the one place
fulfillment should hook in, and it must stay webhook-driven (never triggered
from the success page, which is display-only).

## 6. Data model

Migration: `supabase/migrations/20260702_000001_cognitive_rewards_orders_stripe.sql`.
Adds `stripe_checkout_session_id`, `stripe_payment_intent_id`, `paid_at`,
`stripe_tax_amount`, `stripe_total` to `cognitive_rewards_orders`, and extends
the status enum to `pending_payment → awaiting_payment → paid / failed /
expired` (plus the pre-existing `cancelled`). This migration hasn't been
applied to the remote Supabase project yet — run it via your normal Supabase
migration flow (`supabase db push` or paste into the SQL editor) before
testing checkout end-to-end.

Stripe amounts are integer cents on the wire; the app converts to euros
(divide by 100) before storing, matching the existing `numeric(10,2)` euro
columns from the original order migration.

## 7. Tax codes — confirm with an accountant

`app/lib/stripe.ts` → `STRIPE_TAX_CODE`:

| Line item | Tax code | Category |
|---|---|---|
| Game fee | `txcd_10000000` | General - Electronically Supplied Services |
| Reward pool | `txcd_00000000` | Nontaxable |

Both IDs were checked against Stripe's published tax code list
(`docs.stripe.com/tax/tax-codes`) at integration time. The **reward pool
code is a placeholder pending accountant sign-off** — changing it later is a
one-line edit in `app/lib/stripe.ts`. The reasoning: the pool isn't a good or
service WelloWork sells, it's money collected from the buyer and later
disbursed to the players (a separate payout step, not built yet) — so it's
modeled as non-taxable pass-through rather than revenue. Flag this
explicitly to whoever handles WelloWork's VAT filings before relying on it
for a real transaction. The game-fee code is a reasonable general-purpose fit
for a paid digital game/service but a more specific digital-services code may
apply better once the accountant reviews WelloWork's actual delivery model.
