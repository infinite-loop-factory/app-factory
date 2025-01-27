const path = require("node:path");
// Learn more: https://docs.expo.dev/guides/monorepos/
const { getDefaultConfig } = require("expo/metro-config");
const { FileStore } = require("metro-cache");
const { withNativeWind } = require("nativewind/metro");
const { execSync } = require("node:child_process");
const { copyFileSync, renameSync } = require("node:fs");

function patchNativeWind(config) {
  const platforms = ["android", "ios", "web"];

  execSync(
    "npx tailwindcss --input global.css --output node_modules/nativewind/.cache/src/global.css --minify",
    { stdio: "inherit" },
  );

  const source = "node_modules/nativewind/.cache/src/global.css";

  for (const platform of platforms) {
    const destination = `node_modules/nativewind/.cache/src/global.css.${platform}.css`;
    copyFileSync(source, destination);
  }

  renameSync("global.css", "temp_global.css");

  copyFileSync(source, "global.css");

  return config;
}
const defaultConfig = getDefaultConfig(__dirname);

const config = withTurborepoManagedCache(
  withMonorepoPaths(
    process.env.BUILD_FLAG
      ? patchNativeWind(defaultConfig)
      : withNativeWind(defaultConfig, {
          input: "./src/global.css",
          configPath: "./tailwind.config.ts",
        }),
  ),
);

// XXX: Resolve our exports in workspace packages
// https://github.com/expo/expo/issues/26926
config.resolver.unstable_enablePackageExports = true;

module.exports = config;

/**
 * Add the monorepo paths to the Metro config.
 * This allows Metro to resolve modules from the monorepo.
 *
 * @see https://docs.expo.dev/guides/monorepos/#modify-the-metro-config
 * @param {import('expo/metro-config').MetroConfig} config
 * @returns {import('expo/metro-config').MetroConfig}
 */
function withMonorepoPaths(config) {
  const projectRoot = __dirname;
  const workspaceRoot = path.resolve(projectRoot, "../..");

  // #1 - Watch all files in the monorepo
  config.watchFolders = [workspaceRoot];

  // #2 - Resolve modules within the project's `node_modules` first, then all monorepo modules
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, "node_modules"),
    path.resolve(workspaceRoot, "node_modules"),
  ];

  return config;
}

/**
 * Move the Metro cache to the `.cache/metro` folder.
 * If you have any environment variables, you can configure Turborepo to invalidate it when needed.
 *
 * @see https://turbo.build/repo/docs/reference/configuration#env
 * @param {import('expo/metro-config').MetroConfig} config
 * @returns {import('expo/metro-config').MetroConfig}
 */
function withTurborepoManagedCache(config) {
  config.cacheStores = [
    new FileStore({ root: path.join(__dirname, ".cache/metro") }),
  ];
  return config;
}
