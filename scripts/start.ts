import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import chalk from "chalk";
import inquirer from "inquirer";

const appsDir = path.join(process.cwd(), "apps");

(async () => {
  try {
    const args = process.argv.slice(2);
    let selectedApp = args[0]; // 첫 번째 인자를 앱 이름으로 간주

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

      const { chosenApp } = await inquirer.prompt([
        {
          type: "list",
          name: "chosenApp",
          message: chalk.blue("Which app would you like to start?"),
          choices: apps,
        },
      ]);
      selectedApp = chosenApp;
    }

    // 앱 실행
    const command = `pnpm --filter "@infinite-loop-factory/${selectedApp}" start --clear`;
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(chalk.red("An error occurred:"), error);
  }
})();
