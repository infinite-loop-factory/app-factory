/** biome-ignore-all lint/suspicious/noConsole: cli task */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { createInterface } from "node:readline";
import chalk from "chalk";

function execOut(cmd: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    let err = "";
    child.stdout.on("data", (d) => {
      out += d.toString();
    });
    child.stderr.on("data", (d) => {
      err += d.toString();
    });
    child.on("close", (code) => {
      if (code === 0) resolve(out.trim());
      else
        reject(new Error(`${cmd} ${args.join(" ")} failed (${code}):\n${err}`));
    });
  });
}

async function getFirstCommit(sha: string): Promise<string> {
  const out = await execOut("git", ["rev-list", "--max-parents=0", sha]);
  const lines = out.split(/\r?\n/).filter(Boolean);
  return lines[lines.length - 1];
}

async function getChangedFiles(base: string, head: string): Promise<string[]> {
  const out = await execOut("git", ["diff", "--name-only", base, head]);
  return out ? out.split(/\r?\n/).filter(Boolean) : [];
}

async function getUpstreamMergeBaseOrRoot(): Promise<string> {
  try {
    await execOut("git", [
      "rev-parse",
      "--abbrev-ref",
      "--symbolic-full-name",
      "@{u}",
    ]);
    return await execOut("git", ["merge-base", "HEAD", "@{u}"]);
  } catch {
    // Fallback to default branch merge-base rather than repo root
    return getDefaultMergeBase("HEAD");
  }
}

async function getDefaultMergeBase(local: string): Promise<string> {
  const candidates = ["origin/HEAD", "origin/main", "main"];
  for (const ref of candidates) {
    try {
      const base = await execOut("git", ["merge-base", local, ref]);
      if (base) return base.trim();
    } catch {
      // try next candidate
    }
  }
  return getFirstCommit(local);
}

function runPnpm(args: string[]): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn("pnpm", args, { stdio: "inherit" });
    child.on("close", (code) => resolve(code ?? 1));
  });
}

type RefLine = {
  localRef: string;
  localSha: string;
  remoteRef: string;
  remoteSha: string;
};

function readRefLinesFromStdin(timeoutMs = 500): Promise<RefLine[]> {
  // If running manually (stdin is a TTY), skip waiting for input.
  if (process.stdin.isTTY) return Promise.resolve([]);
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, terminal: false });
    const lines: RefLine[] = [];
    let resolved = false;
    const finish = () => {
      if (resolved) return;
      resolved = true;
      try {
        rl.close();
      } catch {
        // intentionally ignored
      }
      resolve(lines);
    };
    const timer = setTimeout(finish, timeoutMs);
    rl.on("line", (line) => {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 4) {
        const [localRef, localSha, remoteRef, remoteSha] = parts;
        lines.push({ localRef, localSha, remoteRef, remoteSha });
      }
    });
    rl.on("close", () => {
      clearTimeout(timer);
      finish();
    });
  });
}

function collectTargetsFromFiles(files: Set<string>): string[] {
  const targets = new Set<string>();
  for (const f of files) {
    const m = f.match(/^(apps|packages)\/([^/]+)\//);
    if (m) {
      targets.add(`${m[1]}/${m[2]}`);
    }
  }
  return Array.from(targets).filter((p) => existsSync(p));
}

async function collectChangedFiles(
  refLines: RefLine[],
  zeroSha: string,
): Promise<Set<string>> {
  const changed = new Set<string>();
  if (refLines.length > 0) {
    for (const { localSha, remoteSha } of refLines) {
      if (!localSha || localSha === zeroSha) continue; // ignore deletes
      let baseSha: string;
      if (!remoteSha || remoteSha === zeroSha) {
        // New branch push: diff against merge-base with default branch
        baseSha = await getDefaultMergeBase(localSha);
      } else {
        baseSha = remoteSha;
      }
      const files = await getChangedFiles(baseSha, localSha);
      files.forEach((f) => changed.add(f));
    }
  } else {
    const base = await getUpstreamMergeBaseOrRoot();
    const files = await getChangedFiles(base, "HEAD");
    files.forEach((f) => changed.add(f));
  }
  return changed;
}

async function main() {
  const zeroSha = "0000000000000000000000000000000000000000";
  const refLines = await readRefLinesFromStdin();
  const changed = await collectChangedFiles(refLines, zeroSha);

  // List changed files first, narrowed to apps/packages
  const isRelevant = (f: string) => /^(apps|packages)\/[^/]+\//.test(f);
  const relevantChanged = Array.from(changed).filter(isRelevant).sort();
  const ignoredCount = changed.size - relevantChanged.length;

  console.log(chalk.cyan("Changed files (apps/packages):"));
  if (relevantChanged.length === 0) {
    console.log(chalk.dim("- (none)"));
  } else {
    relevantChanged.forEach((f) => console.log(chalk.dim(`- ${f}`)));
  }
  if (ignoredCount > 0) {
    console.log(
      chalk.gray(`${ignoredCount} other file(s) outside apps/packages`),
    );
  }

  // If certain root config files changed, run full test suite
  const FULL_RUN_ROOT_FILES = new Set([
    "package.json",
    "pnpm-workspace.yaml",
    "pnpm-lock.yaml",
    "turbo.json",
  ]);
  const fullRunTriggers = Array.from(changed)
    .filter((f) => !f.includes("/")) // root-level only
    .filter((f) => FULL_RUN_ROOT_FILES.has(f) || f.startsWith("tsconfig"));

  if (fullRunTriggers.length > 0) {
    console.log(
      chalk.yellow(
        `Root config changed (${fullRunTriggers.join(", ")}); running full test suite`,
      ),
    );
    const code = await runPnpm(["test"]);
    process.exit(code);
  }

  const targets = collectTargetsFromFiles(changed);
  if (targets.length === 0) {
    console.log(chalk.gray("No app/package changes detected; skipping tests."));
    process.exit(0);
  }

  console.log(chalk.cyan("Running tests for filtered packages:"));
  targets.forEach((t) => console.log(chalk.dim(`- ${t}`)));

  const args: string[] = [];
  for (const t of targets) {
    args.push("--filter", `./${t}`);
  }
  // Use --if-present to avoid failing on packages without a test script
  // Important: pass --if-present to pnpm (before the script name),
  // otherwise it will be forwarded to the underlying script (e.g. Jest)
  // and cause "Unrecognized option \"if-present\"" errors.
  args.push("run", "--if-present", "test");

  const code = await runPnpm(args);
  process.exit(code);
}

main().catch((err) => {
  console.error(chalk.red(err?.stack || String(err)));
  process.exit(1);
});
