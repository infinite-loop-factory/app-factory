import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.resolve(__dirname, "../src/i18n/locales");

function unflatten(flat) {
  const nested = {};
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split(".").filter(Boolean);
    if (!parts.length) continue;
    let cursor = nested;
    for (let i = 0; i < parts.length - 1; i += 1) {
      const part = parts[i];
      if (typeof cursor[part] !== "object" || cursor[part] === null) {
        cursor[part] = {};
      }
      cursor = cursor[part];
    }
    cursor[parts[parts.length - 1]] = value;
  }
  return nested;
}

const generated = [];
for (const locale of ["en", "ko"]) {
  const flat = JSON.parse(
    fs.readFileSync(path.join(localesDir, `${locale}.json`), "utf8"),
  );
  const nested = unflatten(flat);
  const out = `// Generated from ${locale}.json — edit JSON then run: pnpm i18n:build\nexport default ${JSON.stringify(nested, null, 2)} as const\n`;
  const file = path.join(localesDir, `${locale}.generated.ts`);
  fs.writeFileSync(file, out);
  generated.push(file);
}

// Match the repo formatter so regeneration never dirties the tree.
execFileSync("npx", ["biome", "format", "--write", ...generated], {
  cwd: path.resolve(__dirname, ".."),
  stdio: "ignore",
});
