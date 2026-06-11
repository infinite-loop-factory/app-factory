# Snake & Ladder — Top-tier Casual ("AAA+") Roadmap

Grounded in deep market research (2026-06-11, 105-agent verified pipeline; all claims
3-vote adversarially verified) cross-referenced with two rounds of blind beta reviews.

## Market facts that set the strategy

| # | Verified finding | Consequence for us |
|---|---|---|
| 1 | Ludo King: 1B+ downloads but **< $0.01 IAP per download**; revenue 60–80% ads; US/high-RPD markets carry IAP | Revenue model must be **ads-primary, geo-aware**. Don't bet on gold-dice IAP scale. |
| 2 | Category's #1 complaint: **perceived dice rigging tied to payments** ("paid players win") — 1.58M one-star reviews on Ludo King, review-bombing driver | Fairness perception is the single biggest design risk. Our beta reviewers (Kevin, Hana) flagged the same thing independently. |
| 3 | Disruptive ads = first-order churn (casual players 30–50% more sensitive; 1 in 5 abandon over bad ads). **Rewarded video is the accepted format** (23–100+ views/user; luck-battle games hit $12.23 ad ARPU) | Rewarded-first ad design; keep interstitials delayed + hard-capped. |
| 4 | **Live-ops is the baseline** for top casual: streak events (loss aversion) fastest-growing; majority of IAP in top titles comes from event-tied offers | Daily seed + streak (shipped) is the seed of a live-ops calendar, not the end. |
| 5 | What separates top board games from the long tail: **multiplayer/social polish** (Sensor Tower on Ludo King), not monetization mechanics | Room codes (shipped) are the centerpiece to polish next. |

## Where the current build already stands

- ✅ Daily seeded board, streak, attempt tracking, Wordle-style share with link
- ✅ Room codes (serverless shared boards)
- ✅ Gold dice quarantined from daily/room (fairness half-done)
- ✅ No upsells during setbacks (regression-tested)
- ✅ QASM log — an unexploited **provable-fairness asset** (we literally show the circuits)
- ⚠️ Interstitial-first ads (every 3 games), no rewarded video
- ⚠️ Room mode is bare (no rematch flow, no result compare)
- ⚠️ No BGM; no weekly content cadence; no retention instrumentation

## Owner decisions (fixed — do not relitigate)

- **Gold dice stay purchasable.** IAP packs (10/30/100) are the primary acquisition
  path; the bulk amounts and the 50% probability ARE the product design.
- **Ad removal stays a paid IAP.**
- The research's fairness requirement is already satisfied **without touching IAP**:
  gold dice are structurally quarantined from daily/room (shared-score) modes, so the
  "paid players win" perception risk that sank Ludo King reviews cannot attach to our
  competitive surface. Purchases boost vs-CPU play only.

## Phases

### Phase 1 — Weaponize fairness (code-only, immediate)
1. ✅ Surface the seed: daily/room games show the board seed → "verify me".
2. ✅ Reframe the quantum log as a fairness proof in copy.
3. (Optional, owner approval required) Rewarded video as an **additive faucet** —
   watch an ad for 1 gold die as a taste that funnels into the 10/30/100 IAP packs.
   Never replaces purchases; standard top-casual funnel design.

### Phase 2 — Ad cadence tuning (IAP untouched)
1. (Optional) Add rewarded video unit alongside existing interstitials.
2. Delay first interstitial of a session; keep ≤1 per 3 games / 60s cap.

### Phase 3 — Room polish (social = the moat)
1. Rematch flow (same code, round counter).
2. End-of-game compare card (my rolls vs CPU, room code prominent).
3. Defer presence/voice/emotes until a server exists.

### Phase 4 — Live-ops lite
1. Weekly themed boards (e.g., weekend = 7 qubits, "entanglement week") — pure seed-rule variations, no server.
2. Streak-protection event (one free streak save / week).

### Phase 5 — Sound & polish gap-closers
1. BGM (looping felt-lounge track + mute toggle) — flagged by 3 beta reviewers and a known top-vs-long-tail separator.
2. Store icon flattening, snake-strike animation upgrades.

### Always-on
- Instrument D1/D7, share-tap rate, streak length (no public evidence quantifies Wordle-loop D7 — we must measure our own).
- Keep E2E green; visual evidence (video) for any fairness-related claim.

## Honest framing

"AAA+" here means **top-tier casual quality**: the production class of Ludo King's polish
with an indie's social loop — not console-AAA budgets. The research says the winners in
this category won on fairness perception, social presence, and live-ops cadence. That is
the hill we are climbing, and Phases 1–4 are all within this codebase's reach.
