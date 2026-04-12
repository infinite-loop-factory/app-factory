#!/usr/bin/env bun

/**
 * oh-my-agent — Stop Hook (Persistent Mode)
 *
 * Works with: Claude Code (Stop), Codex CLI (Stop), Gemini CLI (AfterAgent)
 *
 * Prevents the agent from stopping while a long-running workflow
 * (ultrawork, orchestrate, work) is active.
 *
 * stdin : JSON  — { sessionId|session_id, hook_event_name?, ... }
 * stdout: JSON  — { decision: "block", reason } | {}
 * exit 0 = allow stop
 * exit 2 = block stop
 */

import {
  existsSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { isDeactivationRequest } from "./keyword-detector.ts";
import {
  type ModeState,
  makeBlockOutput,
  resolveGitRoot,
  type Vendor,
} from "./types.ts";

const MAX_REINFORCEMENTS = 5;
const STALE_HOURS = 2;

function detectLanguage(projectDir: string): string {
  const prefsPath = join(projectDir, ".agents", "oma-config.yaml");
  if (!existsSync(prefsPath)) return "en";
  try {
    const content = readFileSync(prefsPath, "utf-8");
    const match = content.match(/^language:\s*(\S+)/m);
    return match?.[1] ?? "en";
  } catch {
    return "en";
  }
}

// ── Config Loading ────────────────────────────────────────────

interface TriggerConfig {
  workflows: Record<string, { persistent: boolean }>;
}

function loadPersistentWorkflows(): string[] {
  const configPath = join(dirname(import.meta.path), "triggers.json");
  try {
    const config: TriggerConfig = JSON.parse(readFileSync(configPath, "utf-8"));
    return Object.entries(config.workflows)
      .filter(([, def]) => def.persistent)
      .map(([name]) => name);
  } catch {
    return ["ultrawork", "orchestrate", "work"];
  }
}

// ── Vendor Detection ──────────────────────────────────────────

function detectVendor(input: Record<string, unknown>): Vendor {
  const event = input.hook_event_name as string | undefined;
  if (event === "AfterAgent") return "gemini";
  if (event === "Stop") {
    if ("session_id" in input && !("sessionId" in input)) return "codex";
  }
  if (process.env.QWEN_PROJECT_DIR) return "qwen";
  return "claude";
}

function getProjectDir(vendor: Vendor, input: Record<string, unknown>): string {
  let dir: string;
  switch (vendor) {
    case "codex":
      dir = (input.cwd as string) || process.cwd();
      break;
    case "gemini":
      dir = process.env.GEMINI_PROJECT_DIR || process.cwd();
      break;
    case "qwen":
      dir = process.env.QWEN_PROJECT_DIR || process.cwd();
      break;
    default:
      dir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
      break;
  }
  return resolveGitRoot(dir);
}

function getSessionId(input: Record<string, unknown>): string {
  return (
    (input.sessionId as string) || (input.session_id as string) || "unknown"
  );
}

// ── State ─────────────────────────────────────────────────────

function getStateDir(projectDir: string): string {
  return join(projectDir, ".agents", "state");
}

function readModeState(
  projectDir: string,
  workflow: string,
  sessionId: string,
): ModeState | null {
  const path = join(
    getStateDir(projectDir),
    `${workflow}-state-${sessionId}.json`,
  );
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf-8")) as ModeState;
  } catch {
    return null;
  }
}

export function isStale(state: ModeState): boolean {
  const elapsed = Date.now() - new Date(state.activatedAt).getTime();
  return elapsed > STALE_HOURS * 60 * 60 * 1000;
}

export function deactivate(
  projectDir: string,
  workflow: string,
  sessionId: string,
): void {
  const path = join(
    getStateDir(projectDir),
    `${workflow}-state-${sessionId}.json`,
  );
  if (existsSync(path)) unlinkSync(path);
}

function incrementReinforcement(
  projectDir: string,
  workflow: string,
  sessionId: string,
  state: ModeState,
): void {
  state.reinforcementCount += 1;
  writeFileSync(
    join(getStateDir(projectDir), `${workflow}-state-${sessionId}.json`),
    JSON.stringify(state, null, 2),
  );
}

// ── Main ──────────────────────────────────────────────────────

function parseInput(raw: string): Record<string, unknown> | null {
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function collectTextToCheck(input: Record<string, unknown>): string {
  return [
    input.prompt_response,
    input.response,
    input.content,
    input.message,
    input.transcript,
  ]
    .filter((v): v is string => typeof v === "string")
    .join(" ");
}

function deactivateSessionModes(projectDir: string, sessionId: string): void {
  const stateDir = join(projectDir, ".agents", "state");
  if (!existsSync(stateDir)) {
    return;
  }

  try {
    const suffix = `-state-${sessionId}.json`;
    for (const file of readdirSync(stateDir)) {
      if (file.endsWith(suffix)) {
        unlinkSync(join(stateDir, file));
      }
    }
  } catch {
    // ignore cleanup errors
  }
}

function handleDeactivation(
  textToCheck: string,
  lang: string,
  projectDir: string,
  sessionId: string,
): boolean {
  if (!(textToCheck && isDeactivationRequest(textToCheck, lang))) {
    return false;
  }

  deactivateSessionModes(projectDir, sessionId);
  return true;
}

function buildPersistentModeReason(
  workflow: string,
  sessionId: string,
  reinforcementCount: number,
): string {
  const stateFile = `.agents/state/${workflow}-state-${sessionId}.json`;
  return [
    `[OMA PERSISTENT MODE: ${workflow.toUpperCase()}]`,
    `The /${workflow} workflow is still active (reinforcement ${reinforcementCount}/${MAX_REINFORCEMENTS}).`,
    "Continue executing the workflow. If all tasks are genuinely complete:",
    `  1. Delete the state file: Bash \`rm ${stateFile}\``,
    `  2. Or ask the user to say "워크플로우 완료" / "workflow done"`,
  ].join("\n");
}

function getBlockingReason(
  projectDir: string,
  sessionId: string,
  persistentWorkflows: string[],
): string | null {
  for (const workflow of persistentWorkflows) {
    const state = readModeState(projectDir, workflow, sessionId);
    if (!state) continue;

    if (isStale(state) || state.reinforcementCount >= MAX_REINFORCEMENTS) {
      deactivate(projectDir, workflow, sessionId);
      continue;
    }

    incrementReinforcement(projectDir, workflow, sessionId, state);
    return buildPersistentModeReason(
      workflow,
      sessionId,
      state.reinforcementCount,
    );
  }

  return null;
}

function main() {
  const raw = readFileSync("/dev/stdin", "utf-8");
  const input = parseInput(raw);
  if (!input) {
    process.exit(0);
  }

  const vendor = detectVendor(input);
  const projectDir = getProjectDir(vendor, input);
  const sessionId = getSessionId(input);
  const lang = detectLanguage(projectDir);
  const textToCheck = collectTextToCheck(input);

  if (handleDeactivation(textToCheck, lang, projectDir, sessionId)) {
    process.exit(0);
  }

  const persistentWorkflows = loadPersistentWorkflows();
  const reason = getBlockingReason(projectDir, sessionId, persistentWorkflows);
  if (reason) {
    process.stdout.write(makeBlockOutput(vendor, reason));
    process.exit(2);
  }

  process.exit(0);
}

if (import.meta.main) {
  main();
}
