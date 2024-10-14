export default {
  "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": [
    "biome check --fix --unsafe --no-errors-on-unmatched", // Format, sort imports, lints, apply safe/unsafe fixes
  ],
  // Alternatively you can pass every files and ignore unknown extensions
  "*": [
    "biome check --fix --no-errors-on-unmatched --files-ignore-unknown=true", // Check formatting and lint
  ],
  "package.json": "sort-package-json",
};
