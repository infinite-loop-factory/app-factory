const path = require("node:path");
// Learn more: https://docs.expo.dev/guides/monorepos/
const { getDefaultConfig } = require("expo/metro-config");
const { FileStore } = require("metro-cache");
const { withNativeWind } = require("nativewind/metro");

const config = withTurborepoManagedCache(
  withMonorepoPaths(
    withNativeWind(getDefaultConfig(__dirname), {
      input: "./src/global.css",
      configPath: "./tailwind.config.ts",
    }),
  ),
);

// XXX: Resolve our exports in workspace packages
// https://github.com/expo/expo/issues/26926
config.resolver.unstable_enablePackageExports = false;

// Locale JSON must bundle as modules, not static assets
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "json",
);
if (!config.resolver.sourceExts.includes("json")) {
  config.resolver.sourceExts.push("json");
}

// Add path alias configuration to resolve TypeScript paths
const workspaceRoot = path.resolve(__dirname, "../..");
const ketEntry = path.resolve(
  workspaceRoot,
  "node_modules/@kirkelliott/ket/dist/ket.js",
);
config.resolver.alias = {
  "@": path.resolve(__dirname, "src"),
  "@kirkelliott/ket": ketEntry,
};

const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "@kirkelliott/ket") {
    return { filePath: ketEntry, type: "sourceFile" };
  }
  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

// Prevent duplicate react-native-svg registration in monorepo
// Force ALL imports of react-native-svg to resolve to this project's version
const svgPath = path.resolve(__dirname, "../../node_modules/react-native-svg");
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  "react-native-svg": svgPath,
  "node:worker_threads": path.resolve(
    __dirname,
    "src/lib/shims/worker-threads.js",
  ),
  worker_threads: path.resolve(__dirname, "src/lib/shims/worker-threads.js"),
};
config.resolver.blockList = [
  ...(Array.isArray(config.resolver.blockList)
    ? config.resolver.blockList
    : []),
  /node_modules\/.*\/node_modules\/react-native-svg\/.*/,
];

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
