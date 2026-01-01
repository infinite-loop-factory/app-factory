export default {
  "*": [
    "biome check --fix --unsafe --no-errors-on-unmatched --files-ignore-unknown=true",
  ],
  "package.json": "sort-package-json",
};
