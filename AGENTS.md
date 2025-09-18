# Repository Guidelines

This guide orients agents and contributors working inside the Turborepo monorepo. Keep this close while making changes; it distills the conventions the team expects.

## Project Structure & Module Organization
- `apps/` holds Expo apps such as `reaction-speed-test`, `cafe`, `delivery`, `country-tracker`, `playlist`, and `dog-walk`. Each app keeps feature code under `app/` with colocated assets and tests (or in `__tests__/`).
- `packages/` contains shared libraries. Reach for `@infinite-loop-factory/common` for cross-app utilities, `@infinite-loop-factory/ui` for design primitives, and `config-typescript` for reusable build settings.
- `turbo/` provides Turborepo generators and templates. Update these if you change scaffolding logic, otherwise leave untouched.

## Build, Test, and Development Commands
- Install dependencies: `pnpm install` (run once per checkout or lockfile change).
- Launch an Expo app: `pnpm --filter @infinite-loop-factory/reaction-speed-test start` plus `-- --tunnel` or `--android` based on your target.
- Build a package: `pnpm --filter @infinite-loop-factory/ui build` to validate reusable components.
- Lint or type-check: `pnpm --filter <pkg> lint` and `pnpm --filter <pkg> type-check` keep Biome and TS happy before committing.
- Test: `pnpm --filter <pkg> test` (append `-- --coverage` when updating metrics). For multi-package builds, run `pnpm dlx turbo run build --filter <pkg>`.

## Coding Style & Naming Conventions
- Language defaults: TypeScript, React/React Native, Expo Router. Indent with two spaces, omit semicolons, and rely on Biome for formatting.
- Components follow `PascalCase`, hooks `useThing.ts`, tests `*-test.ts(x)`. Prefer workspace aliases (`@infinite-loop-factory/common`) over relative paths.

## Testing Guidelines
- Test with Jest and `@testing-library/react-native` for UI flows. Keep tests deterministic by mocking network/time.
- Place tests beside the code they cover or under `__tests__/`. Snapshot tests are fine when outputs stabilize; update intentionally.

## Commit & Pull Request Guidelines
- Use Conventional Commits: `feat(app-name): summary` or `fix(ui): adjust button variant`. Match scopes to workspace directories.
- Pre-commit hooks run Biome; pre-push hooks run tests. Ensure both are green before raising a PR.
- PRs need a clear summary, linked issue, coverage notes, and screenshots or screen recordings for UI changes.

## Security & Configuration Tips
- Never commit secrets. Copy `.env.example` to `.env` per app and populate required Expo/Supabase keys.
- Clean build artifacts with `pnpm --filter <pkg> clean`. Rotate credentials promptly if mis-shared.
