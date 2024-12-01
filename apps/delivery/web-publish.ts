import { execSync } from "node:child_process";
import * as fs from "node:fs";
import { renameSync, writeFileSync } from "node:fs";
import * as path from "node:path";
import { uniq } from "es-toolkit";

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

(async () => {
  const baseURl = "https://infinite-loop-factory.github.io/app-factory/";
  const appName = "app-list.json";

  const data: { name: string }[] = await fetch(`${baseURl}${appName}`).then(
    (d) => d.json(),
  );

  const apps = [...uniq([...data.map((d) => d.name), packageName])].map(
    (name) => ({ name }),
  );

  runCommand(`cross-env BUILD_FLAG=true expo export --output-dir ${outputDir}`);

  writeFileSync(path.join("dist", appName), JSON.stringify(apps));

  runCommand(
    `gh-pages -t -d dist -m "feat: ✨ auto-generate" --nojekyll --remove "${packageName}"  --remove "${appName} --prefix dist"`,
  );
})().finally(() => {
  renameSync("temp_global.css", "global.css");
});
