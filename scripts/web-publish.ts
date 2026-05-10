import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { parseArgs } from "node:util";
import { uniq } from "es-toolkit";

const appsDir = path.join(process.cwd(), "apps");
const distDir = path.join(process.cwd(), "dist");
const baseUrl = "https://infinite-loop-factory.github.io/app-factory/";
const appListFileName = "app-list.json";
const docsPagesDirName = "docs/pages";

function markdownToHtml(md: string, slug: string, appName: string): string {
  const lines = md.split("\n");
  let body = "";
  let title = slug;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      body += "\n";
      continue;
    }
    if (trimmed.startsWith("# ")) {
      title = trimmed.slice(2);
      body += `<h1>${escapeHtml(title)}</h1>\n`;
    } else if (trimmed.startsWith("## ")) {
      body += `<h2>${escapeHtml(trimmed.slice(3))}</h2>\n`;
    } else if (trimmed.startsWith("### ")) {
      body += `<h3>${escapeHtml(trimmed.slice(4))}</h3>\n`;
    } else {
      body += `<p>${escapeHtml(trimmed)}</p>\n`;
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)} - ${escapeHtml(appName)}</title>
<style>
body{font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:640px;margin:0 auto;padding:2rem 1rem;line-height:1.7;color:#1a1a1a;background:#fff}
h1{font-size:1.75rem;margin-bottom:.25rem}
h2{font-size:1.25rem;margin-top:2rem}
h3{font-size:1.1rem;margin-top:1.5rem}
p{margin:.5rem 0;color:#374151}
@media(prefers-color-scheme:dark){body{background:#0f172a;color:#e2e8f0}p{color:#94a3b8}}
</style>
</head>
<body>
${body}</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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

function getPackageName(appDir: string): string | undefined {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(appsDir, appDir, "package.json"), "utf-8"),
  );
  return packageJson.name.split("/").pop();
}

function buildStaticPages() {
  for (const app of getApps()) {
    const pagesDir = path.join(appsDir, app, docsPagesDirName);
    if (!fs.existsSync(pagesDir)) continue;

    const packageName = getPackageName(app);
    if (!packageName) continue;

    const mdFiles = fs.readdirSync(pagesDir).filter((f) => f.endsWith(".md"));

    for (const mdFile of mdFiles) {
      const slug = mdFile.replace(/\.md$/, "");
      const md = fs.readFileSync(path.join(pagesDir, mdFile), "utf-8");
      const html = markdownToHtml(md, slug, packageName);
      const outDir = path.join(distDir, packageName, slug);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, "index.html"), html);
      // biome-ignore lint/suspicious/noConsole: script output
      console.log(`  Static page: ${packageName}/${slug}`);
    }
  }
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

    const packageName = getPackageName(app);
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

  buildStaticPages();

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
