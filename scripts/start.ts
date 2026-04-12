import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { cancel, isCancel, log, select } from "@clack/prompts";

const appsDir = path.join(process.cwd(), "apps");
const PLATFORMS = ["ios", "android", "web"] as const;
type Platform = (typeof PLATFORMS)[number];

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const positional = args.filter((a) => !a.startsWith("--"));

const isCI = flags.has("--ci") || !!process.env.CI;
const devClient = flags.has("--dev");

function parseSelectionArgs(): {
  platform: Platform | undefined;
  selectedApp: string | undefined;
} {
  let selectedApp = positional[0];
  let platform: Platform | undefined;

  if (selectedApp && PLATFORMS.includes(selectedApp as Platform)) {
    platform = selectedApp as Platform;
    selectedApp = positional[1];
  } else {
    platform = positional.find(
      (a, i) => i > 0 && PLATFORMS.includes(a as Platform),
    ) as Platform | undefined;
  }

  return { platform, selectedApp };
}

async function getApps(): Promise<string[]> {
  const entries = await fs.readdir(appsDir, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

async function selectAppFromPrompt(apps: string[]) {
  if (isCI) {
    log.error("No app specified. Available apps:");
    for (const a of apps) {
      log.message(`  - ${a}`);
    }
    process.exit(1);
  }

  const result = await select({
    message: "Which app would you like to start?",
    options: apps.map((a) => ({ label: a, value: a })),
  });

  if (isCancel(result)) {
    cancel("Cancelled.");
    process.exit(0);
  }

  return result as string;
}

function ensureAppExists(selectedApp: string, apps: string[]) {
  if (apps.includes(selectedApp)) {
    return;
  }

  log.error(`App "${selectedApp}" not found. Available apps:`);
  for (const a of apps) {
    log.message(`  - ${a}`);
  }
  process.exit(1);
}

async function main() {
  let { platform, selectedApp } = parseSelectionArgs();

  const apps = await getApps();

  if (!selectedApp) {
    selectedApp = await selectAppFromPrompt(apps);
  }

  ensureAppExists(selectedApp, apps);

  let script = "start";
  if (platform) {
    script = platform;
  }

  let command = `pnpm --filter "@infinite-loop-factory/${selectedApp}" ${script}`;
  if (!platform) {
    command += " --clear";
  }
  if (devClient) {
    command += " --dev-client";
  }

  execSync(command, { stdio: "inherit" });
}

void main();
