# Snake & Ladder

Quantum computing meets Snakes & Ladders — qubit superposition dice, entanglement, interference, and tunneling. Offline 1v1 vs the computer on a Craft Board.

Epic: [app-factory#208](https://github.com/infinite-loop-factory/app-factory/issues/208)

Reference: [uts-iqc-group15/snake-ladder](https://github.com/uts-iqc-group15/snake-ladder)

## Run

```bash
pnpm --filter @infinite-loop-factory/snake-ladder start
```

IAP and AdMob require a **native dev build** (Expo Go is not supported):

```bash
pnpm --filter @infinite-loop-factory/snake-ladder ios
pnpm --filter @infinite-loop-factory/snake-ladder android
```

EAS builds use `apps/snake-ladder/eas.json`.

## Core loop

1. **Setup** — place qubits (ladder/snake probability configs + entangled pair) on cells 6–95
2. **Play** — roll quantum dice, hop the board, collapse qubits on landing
3. **Win** — reach cell 100 exactly (overshoot bounces back)

All quantum circuits run locally on-device (no network).

## Settings

- Movement / dice animation speed
- Sound effects and haptics
- Light / dark Craft Board theme
- Your nickname and opponent nickname (default: You / Computer)

## Monetization (native only)

- **Gold dice** — consumable IAP; 50% bias toward chosen face (shop + in-game toggle)
- **Ad removal** — non-consumable IAP; disables interstitials
- **AdMob interstitials** — every 3 new games, 60s cooldown (test IDs in dev)

Configure store products matching `src/lib/monetization/constants.ts` before release.

Privacy policy: in-app **Settings → Privacy policy**, public URL in `PRIVACY_POLICY_URL`.

## Verify

```bash
pnpm --filter @infinite-loop-factory/snake-ladder test
pnpm --filter @infinite-loop-factory/snake-ladder type-check
pnpm --filter @infinite-loop-factory/snake-ladder lint
```
