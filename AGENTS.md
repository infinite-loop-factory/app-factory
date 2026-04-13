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

<!-- OMA:START — managed by oh-my-agent. Do not edit this block manually. -->

# oh-my-agent

## Architecture

- **SSOT**: `.agents/` directory (do not modify directly)
- **Response language**: Follows `language` in `.agents/oma-config.yaml`
- **Skills**: `.agents/skills/` (domain specialists)
- **Workflows**: `.agents/workflows/` (multi-step orchestration)
- **Subagents**: `oma agent:spawn {agent} {prompt} {sessionId}`

## Workflows

Execute by naming the workflow in your prompt. Keywords are auto-detected via hooks.

| Workflow | File | Description |
|----------|------|-------------|
| orchestrate | `orchestrate.md` | Parallel subagents + Review Loop |
| work | `work.md` | Step-by-step with remediation loop |
| ultrawork | `ultrawork.md` | 5-Phase Gate Loop (11 reviews) |
| plan | `plan.md` | PM task breakdown |
| brainstorm | `brainstorm.md` | Design-first ideation |
| review | `review.md` | QA audit |
| debug | `debug.md` | Root cause + minimal fix |
| scm | `scm.md` | SCM + Git operations + Conventional Commits |

To execute: read and follow `.agents/workflows/{name}.md` step by step.

## Auto-Detection

Hooks: `UserPromptSubmit` (keyword detection), `PreToolUse`, `Stop` (persistent mode)
Keywords defined in `.agents/hooks/core/triggers.json` (multi-language).
Persistent workflows (orchestrate, ultrawork, work) block termination until complete.
Deactivate: say "workflow done".

## Rules

1. **Do not modify `.agents/` files** — SSOT protection
2. Workflows execute via keyword detection or explicit naming — never self-initiated
3. Response language follows `.agents/oma-config.yaml`

## Project Rules

Read the relevant file from `.agents/rules/` when working on matching code.

| Rule | File | Scope |
|------|------|-------|
| backend | `.agents/rules/backend.md` | on request |
| commit | `.agents/rules/commit.md` | on request |
| database | `.agents/rules/database.md` | **/*.{sql,prisma} |
| debug | `.agents/rules/debug.md` | on request |
| design | `.agents/rules/design.md` | on request |
| dev-workflow | `.agents/rules/dev-workflow.md` | on request |
| frontend | `.agents/rules/frontend.md` | **/*.{tsx,jsx,css,scss} |
| i18n-guide | `.agents/rules/i18n-guide.md` | always |
| infrastructure | `.agents/rules/infrastructure.md` | **/*.{tf,tfvars,hcl} |
| mobile | `.agents/rules/mobile.md` | **/*.{dart,swift,kt} |
| quality | `.agents/rules/quality.md` | on request |

<!-- OMA:END -->
