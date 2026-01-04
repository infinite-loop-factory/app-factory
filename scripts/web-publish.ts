import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { parseArgs } from "node:util";
import { uniq } from "es-toolkit";

const appsDir = path.join(process.cwd(), "apps");
const distDir = path.join(process.cwd(), "dist");
const baseUrl = "https://infinite-loop-factory.github.io/app-factory/";
const appListFileName = "app-list.json";

// Ensure dist dir exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

async function getAppList() {
  const localPath = path.join(distDir, appListFileName);
  if (fs.existsSync(localPath)) {
    try {
      return JSON.parse(fs.readFileSync(localPath, "utf-8"));
    } catch {
      // biome-ignore lint/suspicious/noConsole: script output
      console.warn("Failed to read local app list, trying fetch.");
    }
  }

  try {
    const response = await fetch(`${baseUrl}${appListFileName}`);
    if (!response.ok) return [];
    return await response.json();
  } catch {
    // biome-ignore lint/suspicious/noConsole: script output
    console.warn("Failed to fetch app list, starting fresh.");
    return [];
  }
}

function getApps() {
  return fs.readdirSync(appsDir).filter((file) => {
    return (
      fs.statSync(path.join(appsDir, file)).isDirectory() &&
      fs.existsSync(path.join(appsDir, file, "package.json"))
    );
  });
}

(async () => {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      app: {
        type: "string",
        multiple: true,
      },
    },
  });

  const targetApps =
    values.app && values.app.length > 0 ? values.app : getApps();
  const existingApps = (await getAppList()) as { name: string }[];
  const builtApps: string[] = [];

  for (const app of targetApps) {
    const appPath = path.join(appsDir, app);
    if (!fs.existsSync(appPath)) {
      // biome-ignore lint/suspicious/noConsole: script output
      console.warn(`App ${app} not found, skipping.`);
      continue;
    }

    const packageJson = JSON.parse(
      fs.readFileSync(path.join(appPath, "package.json"), "utf-8"),
    );
    const packageName = packageJson.name.split("/").pop();

    if (!packageName) continue;

    // biome-ignore lint/suspicious/noConsole: script output
    console.log(`Building ${app} (${packageName})...`);

    const appOutputDir = path.join(distDir, packageName);

    try {
      // Use pnpm exec expo to ensure we use the local expo version
      execSync(`pnpm exec expo export --output-dir ${appOutputDir}`, {
        stdio: "inherit",
        cwd: appPath,
        env: { ...process.env, BUILD_FLAG: "true" },
      });

      builtApps.push(packageName);
    } catch {
      console.error(`Failed to build ${app}`);
    } finally {
      // Restore global.css if temp_global.css exists
      const tempCssPath = path.join(appPath, "temp_global.css");
      const cssPath = path.join(appPath, "global.css");
      if (fs.existsSync(tempCssPath)) {
        // biome-ignore lint/suspicious/noConsole: script output
        console.log(`Restoring global.css for ${app}...`);
        fs.renameSync(tempCssPath, cssPath);
      }
    }
  }

  const allApps = uniq([...existingApps.map((d) => d.name), ...builtApps]).map(
    (name) => ({ name }),
  );

  fs.writeFileSync(
    path.join(distDir, appListFileName),
    JSON.stringify(allApps, null, 2),
  );

  // biome-ignore lint/suspicious/noConsole: script output
  console.log("Build complete. Output in dist/");
})();
