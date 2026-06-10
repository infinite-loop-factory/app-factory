# Snake & Ladder — Epic #208 checklist

Tracking progress against `[Epic] app/snake-ladder`.

## Core gameplay

| Item | Status |
|------|--------|
| 100-cell board, snakes/ladders via vectors | Done |
| Classic board layout (cell 1 bottom-left, 100 top-left) | Done (`cellToVisualCoord`) |
| Qubit setup (cells 6–95) | Done |
| Local quantum sim (`local-sim.ts`, no Quokka) | Done |
| Entanglement / interference / tunneling | Done |
| vs computer 1:1 (easy/normal/hard) | Done |
| Overshoot bounce at 100 | Done |
| Winner path replay (dotted polyline) | Done |
| Craft Board light + dark palette | Done |

## UX & polish

| Item | Status |
|------|--------|
| Settings (speed, sound, haptics, theme) | Done |
| Stats + reset | Done |
| Player / opponent nicknames | Done |
| Onboarding (first launch) | Done |
| App logo (splash, boot, home, onboarding) | Done (`AppLogo`, `BootScreen`) |
| Qubit markers distinct from player tokens | Done (`QubitMarker`) |
| Animated dice roll (3D expo-gl/three + gold variant) | Done |
| Victory confetti | Done |
| `expo-audio` SFX (roll/hop/collapse/slide/win) | Done |
| Haptics via controller feedback (hop/tunnel/ladder/snake) | Done |
| New game confirmation | Done |
| Accessibility labels (back/restart/roll/difficulty) | Done |
| i18n (en/ko, nested keys via `i18n:build`) | Done |

## Store release prep

| Item | Status |
|------|--------|
| Privacy policy screen + public URL | Done (publish web for live URL) |
| EAS build config (`eas.json`) | Done |
| IAP receipt verify (iOS StoreKit; Android token/server) | Done |
| Interstitial only resets cooldown when ad shown | Done |
| Settings shop link + monetization status | Done |
| Game shop CTA when gold dice empty | Done |
| Web guard on shop screen | Done |

## Deferred / store release

| Item | Status |
|------|--------|
| Reanimated 3D dice + confetti cannon | Done |
| `@kirkelliott/ket` circuit diagram in log UI | Done (web SVG; native text fallback) |
| Gold dice IAP (50% bias, consumable) | Done |
| Gold dice visual (gold material, expo-gl) | Done |
| AdMob interstitial (3 games / 60s cap) | Done (env-based prod IDs, test fallback) |
| Ad removal IAP + Restore Purchases | Done |
| iOS ATT + privacy policy URL | Done (skipped in E2E via `EXPO_PUBLIC_E2E`) |
| App Store / Play Console product registration | Manual (`store/products.json`) |
| Production AdMob app + ad unit IDs | Manual (`.env` + `store/admob.md`, rebuild) |
| Epic issue screenshots | Run `maestro:screenshots` → `screenshots:copy` → attach to #208 |
| Android server-side Play receipt verify | Done (optional `EXPO_PUBLIC_PLAY_VERIFY_URL`) |
| Maestro E2E (smoke / gold / settings) | Done (run sequentially; ATT uses optional taps) |
| iOS simulator QA | Done (`ios:e2e` + Maestro) |
| Android prebuild | Done (`expo prebuild --platform android`) |
| Android Maestro E2E | Pending (no emulator flow yet) |

## Verify

```bash
pnpm --filter @infinite-loop-factory/snake-ladder test   # runs i18n:build via pretest
pnpm --filter @infinite-loop-factory/snake-ladder type-check
pnpm --filter @infinite-loop-factory/snake-ladder lint
```

`pretest` runs `i18n:build` so locale JSON edits stay in sync with `*.generated.ts`.

## E2E (Maestro)

Native dev build required (Expo Go not supported). Metro must use E2E env (ATT suppressed).

```bash
# Terminal 1 — Metro with E2E seed
pnpm --filter @infinite-loop-factory/snake-ladder start:metro:e2e

# Terminal 2 — connect simulator (if needed)
xcrun simctl openurl booted "exp+snake-ladder://expo-development-client/?url=http%3A%2F%2F127.0.0.1%3A8081"

# Tests (run one at a time — parallel `maestro` can flake on XCTest)
pnpm --filter @infinite-loop-factory/snake-ladder maestro:smoke
pnpm --filter @infinite-loop-factory/snake-ladder maestro:gold
pnpm --filter @infinite-loop-factory/snake-ladder maestro:settings

# Epic screenshots → store/screenshots/
pnpm --filter @infinite-loop-factory/snake-ladder maestro:screenshots
pnpm --filter @infinite-loop-factory/snake-ladder screenshots:copy
```

## Store console (manual, one-time)

1. Register products from `store/products.json` in App Store Connect + Play Console.
2. Fill production AdMob IDs in `.env` per `store/admob.md`, rebuild.
3. Attach `store/screenshots/epic-*.png` to GitHub issue #208.