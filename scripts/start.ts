import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { select } from "@inquirer/prompts";
import chalk from "chalk";

const appsDir = path.join(process.cwd(), "apps");
const PLATFORMS = ["ios", "android", "web"] as const;
type Platform = (typeof PLATFORMS)[number];

(async () => {
  try {
    const args = process.argv.slice(2);
    let selectedApp = args[0]; // 첫 번째 인자를 앱 이름으로 간주

    // 첫 번째 인자가 플랫폼인 경우 앱 선택 필요
    if (selectedApp && PLATFORMS.includes(selectedApp as Platform)) {
      selectedApp = undefined;
    }

    // 인자가 없으면 Inquirer로 앱 목록에서 선택
    if (!selectedApp) {
      const appDirs = await fs.readdir(appsDir);
      const apps: string[] = [];

      for (const file of appDirs) {
        const stat = await fs.stat(path.join(appsDir, file));
        if (stat.isDirectory()) {
          apps.push(file);
        }
      }

      selectedApp = await select({
        message: chalk.blue("Which app would you like to start?"),
        choices: apps.map((app) => ({ name: app, value: app })),
      });
    }

    // 플랫폼 및 플래그 파싱
    const platform = args.find((arg) => PLATFORMS.includes(arg as Platform)) as
      | Platform
      | undefined;
    const devClient = args.includes("--dev");

    // 실행할 스크립트 결정
    let script = "start";
    if (platform) {
      script = platform;
    }

    // 명령어 구성
    let command = `pnpm --filter "@infinite-loop-factory/${selectedApp}" ${script}`;
    if (!platform) {
      command += " --clear";
    }
    if (devClient) {
      command += " --dev-client";
    }
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(chalk.red("An error occurred:"), error);
  }
})();
