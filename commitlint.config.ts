import type { UserConfig } from "@commitlint/types";

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

/**
 * Returns 1-depth workspace directory names from root package.json
 * (bun workspaces: `workspaces.packages` globs like "apps/*").
 */
function getScopesFromWorkspaces(): string[] {
  const rootPkgPath = resolve(process.cwd(), "package.json");
  const rootPkg = JSON.parse(readFileSync(rootPkgPath, "utf8")) as {
    workspaces?: string[] | { packages?: string[] };
  };
  const patterns = Array.isArray(rootPkg.workspaces)
    ? rootPkg.workspaces
    : (rootPkg.workspaces?.packages ?? []);

  const scopes: string[] = [];
  for (const packagePathPattern of patterns) {
    const basePath = packagePathPattern.split("/*")[0]; // apps/* -> apps
    const fullPath = resolve(process.cwd(), basePath ?? "");

    if (existsSync(fullPath)) {
      const dirs = readdirSync(fullPath).filter((file) => {
        const stat = statSync(join(fullPath, file));
        return stat.isDirectory();
      });

      scopes.push(...dirs);
    }
  }

  return scopes;
}

const allowedScopes = getScopesFromWorkspaces();

export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [2, "always", allowedScopes], // 동적으로 가져온 스코프를 적용
  },
} as UserConfig;
