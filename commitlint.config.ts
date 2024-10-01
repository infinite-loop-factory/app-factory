import type { UserConfig } from "@commitlint/types";

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { parse } from "yaml";

/**
 * ? pnpm-workspace.yaml 모노레포 디렉토리 반환
 *
 * @returns string[] 1뎁스 폴더명
 */
function getScopesFromPnpmWorkspace(): string[] {
  const workspaceFilePath = resolve(process.cwd(), "pnpm-workspace.yaml");

  // ? pnpm-workspace.yaml 파일 동기적으로 읽기
  const workspaceFile = readFileSync(workspaceFilePath, "utf8");
  const workspaceConfig = parse(workspaceFile) as { packages: string[] };

  const scopes: string[] = [];
  // ? packages 배열을 읽어서 폴더 경로에서 디렉토리명 추출
  for (const packagePathPattern of workspaceConfig.packages) {
    const basePath = packagePathPattern.split("/*")[0]; // apps/* -> apps
    const fullPath = resolve(process.cwd(), basePath);

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

const allowedScopes = getScopesFromPnpmWorkspace();

export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [2, "always", allowedScopes], // 동적으로 가져온 스코프를 적용
  },
} as UserConfig;
