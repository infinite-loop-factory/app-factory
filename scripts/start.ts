import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import chalk from "chalk";
import inquirer from "inquirer";

// Get the list of top-level folders in the apps directory.
const appsDir = path.join(process.cwd(), "apps");

(async () => {
  try {
    const apps = (await fs.readdir(appsDir)).filter(async (file) => {
      return (await fs.stat(path.join(appsDir, file))).isDirectory();
    });

    // Prompt the user to select an app.
    const { selectedApp } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedApp",
        message: chalk.blue("Which app would you like to start?"),
        choices: await Promise.all(apps),
      },
    ]);

    // Run the selected app using pnpm
    const command = `pnpm --filter ${selectedApp} start --clear`;
    // biome-ignore lint/suspicious/noConsole: cmd
    console.log(chalk.green(`Running: ${command}`));

    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(chalk.red("An error occurred:"), error);
  }
})();
