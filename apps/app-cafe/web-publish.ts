import { execSync } from "node:child_process";
import * as fs from "node:fs";

const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const packageName = packageJson.name.split("/").splice(1).join();

const outputDir = `./dist/${packageName}`;

function runCommand(command: string) {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error: unknown) {
    console.error(
      error instanceof Error
        ? `Error: ${error.message}`
        : "An unknown error occurred",
    );
    process.exit(1);
  }
}

runCommand(`cross-env BUILD_FLAG=true expo export --output-dir ${outputDir}`);

runCommand(
  `gh-pages -t -d dist -m "feat: ✨ auto-generate" --nojekyll --remove "${packageName}"`,
);
