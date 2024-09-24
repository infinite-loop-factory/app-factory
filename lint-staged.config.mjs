export default {
  "**/*.{ts,tsx,js,mjs,mts}": "biome lint --fix --unsafe",
  "**/*.{js,jsx,mjs,cjs,ts,tsx,yml,json,html,md}": [
    "biome format --write --no-errors-on-unmatched",
  ],
  "package.json": "sort-package-json",
};
