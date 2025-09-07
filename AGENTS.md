# Repository Guidelines

This guide helps contributors (and agents) work effectively in this Turborepo monorepo.

## Project Structure & Module Organization
- `apps/`: Expo apps (e.g., `reaction-speed-test`, `cafe`, `delivery`, `country-tracker`, `playlist`, `dog-walk`).
- `packages/`: Shared libraries (e.g., `common`, `ui`, `config-typescript`).
- `turbo/`: Turborepo generators and templates.
- Tests live next to features or in `__tests__/` within each app/package.

## Build, Test, and Development Commands
- Install deps: `pnpm install`
- Start an app (Expo): `pnpm --filter @infinite-loop-factory/reaction-speed-test start`
  - Target: `android`, `ios`, or `web` (e.g., `pnpm --filter @infinite-loop-factory/cafe web`).
- Build a package: `pnpm --filter @infinite-loop-factory/ui build`
- Lint: `pnpm --filter <pkg> lint`
- Type-check: `pnpm --filter <pkg> type-check`
- Test: `pnpm --filter <pkg> test` (watch: `test:watch`)
- Cross-package build: `pnpm dlx turbo run build --filter <pkg>`

## Coding Style & Naming Conventions
- Language: TypeScript, React/React Native, Expo Router.
- Formatting/Linting: Biome via lint-staged and `pnpm lint`.
- Indentation: 2 spaces; prefer no semicolons (Biome defaults).
- Naming: Components `PascalCase` (e.g., `ThemedText.tsx`); hooks `useXxx.ts`; tests `*-test.tsx?`.
- Imports: Prefer workspace aliases (e.g., `@infinite-loop-factory/common`).

## Testing Guidelines
- Framework: Jest (+ `@testing-library/react-native` for apps).
- Run tests: `pnpm --filter <pkg> test` (coverage: `-- --coverage`).
- Keep tests deterministic; mock network/time; snapshots allowed when stable.
- Place tests next to code or in `__tests__/`.

## Commit & Pull Request Guidelines
- Conventional Commits required; scopes match workspace dirs.
  - Examples: `feat(reaction-speed-test): add guest menu`, `fix(ui): correct button variant)`.
- Hooks: pre-commit runs Biome; pre-push runs tests.
- PRs: include clear description, linked issue, tests updated, and screenshots for UI changes.

## Security & Configuration Tips
- Never commit secrets. Copy `.env.example` to `.env` per app.
- For Expo/Supabase, check `apps/*/supabase` and `.env` for required keys.
- Clean local builds safely: `pnpm --filter <pkg> clean`.

