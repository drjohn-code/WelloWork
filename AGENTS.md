<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# WelloWork marketing site

Single-page marketing site for **WelloWork** — a Swedish B2B workplace performance platform combining cognitive training (WelloRise), assessments (WelloWize), longitudinal trend monitoring, live health workshops, and biomarker sample testing.

## Stack

- Next.js 16 App Router, React 19, TypeScript strict.
- Plain CSS in `app/globals.css` (design tokens + utility classes). Tailwind packages are installed but not imported — leave it that way unless the design changes direction.
- Fonts are wired through `next/font/google` in `app/layout.tsx` and exposed as `--font-display-jakarta`, `--font-body-inter`, `--font-italic-instrument`. The design references them via `--font-display` / `--font-body` / `--font-italic` (composed in `globals.css`).

## File layout

- `app/page.tsx` — assembles sections in display order
- `app/layout.tsx` — fonts, metadata
- `app/globals.css` — all design tokens, glass utilities, responsive breakpoints, keyframes
- `app/components/` — one file per concern. `Header.tsx`, `PlatformTabs.tsx`, `Reveal.tsx` are `'use client'`; everything else is a Server Component.
- `public/logo.png` — cube mark from the Claude Design handoff bundle

The original handoff bundle (HTML/JS prototype, chats, screenshots) is not checked in; treat the Next.js components as the source of truth.

## Design language ("Wello-Glass")

- **Palette** — Periwinkle. Primary `#162B5C` (deep navy), accent `#5C73FB`, secondary `#E3EEF9`. The original prototype shipped palette swaps (sapphire, forest); they were dropped during the port because the production site is single-palette.
- **Typography** — Plus Jakarta Sans (display), Inter (body), Instrument Serif italic (`.italic-serif` accent phrases inside headings).
- **Glass cards** — `.glass` / `.glass-strong` use backdrop-filter blur + translucent white. The page sits on a multi-stop radial `.page-bg` gradient with a faint SVG-noise overlay.
- **Reveal-on-scroll** — wrap blocks in `<Reveal delay={1..4}>`. Uses IntersectionObserver; no library.

## Content rules (load-bearing — see Claude Design chat history)

The hero originally invented metrics, customer logos, and a clinician/CBT vocabulary. The user explicitly rejected that direction. When editing content, hold these lines:

1. **No invented numbers, customer logos, testimonials, or third-party validations.** If a metric is needed, use a placeholder like `[METRIC TBD]`. Sample data shown in the dashboard mocks must be labelled as such.
2. **No mental-health-benefits vocabulary.** WelloWork is not a therapy/CBT/care-navigator platform. The only health services depicted are live workshops and blood/urine sample testing.
3. **Employee-first privacy framing.** Anywhere employee data appears, frame it as "employees own their data; managers see aggregated, anonymised insights." Use the `<PrivacyChip>` primitive.
4. **Hero must communicate the unique combination** in under 3 seconds: daily cognitive training + team composition intelligence + biomarker health data + longitudinal performance trends.
5. **Swedish identity is subtle, not kitsch.** `<SwedenChip>` ("Built in Stockholm") and the "Made in Stockholm · GDPR-native · ISO 27001 in progress" footnote — no flags, no fika clichés.

## Section order (don't reorder without checking the chat history)

Nav → Hero (with manager-dashboard mock) → Problem ("The gap") → Platform tabs (Train / Assess / Measure / Workshops / Samples) → Solutions by role → WelloWork advantage → Research & evidence → Pricing teaser → Final CTA → Footer.
