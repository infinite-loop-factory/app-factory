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

// Add path alias configuration to resolve TypeScript paths
config.resolver.alias = {
  "@": path.resolve(__dirname, "src"),
};

// Prevent duplicate native module registration in monorepo.
// Several expo packages (expo-dev-client, expo-keep-awake, etc.) ship their
// own nested copies of these packages. Force every import to resolve to the
// single root-level copy so the native view is only registered once.
const rootModules = path.resolve(__dirname, "../../node_modules");
const deduped = [
  "react-native-safe-area-context",
  "react-native-screens",
  "react-native-gesture-handler",
  "react-native-svg",
  "react-native-reanimated",
];
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  ...Object.fromEntries(
    deduped.map((pkg) => [pkg, path.join(rootModules, pkg)]),
  ),
};
config.resolver.blockList = [
  ...(Array.isArray(config.resolver.blockList)
    ? config.resolver.blockList
    : []),
  // Block any nested copy of the deduped packages
  new RegExp(
    `node_modules/.*?/node_modules/(${deduped.map((p) => p.replace(/-/g, "\\-")).join("|")})/.*`,
  ),
];

// dom-helpers@6 uses package exports (./*  → cjs/*.js) but Metro has
// unstable_enablePackageExports disabled for workspace compat. Map each
// sub-path that @gluestack-ui/core web overlays import directly to cjs/.
const domHelpersRoot = path.resolve(
  __dirname,
  "../../node_modules/dom-helpers/cjs",
);
const prevResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith("dom-helpers/")) {
    const subpath = moduleName.slice("dom-helpers/".length);
    return {
      filePath: path.join(domHelpersRoot, `${subpath}.js`),
      type: "sourceFile",
    };
  }
  if (prevResolveRequest)
    return prevResolveRequest(context, moduleName, platform);
  return context.resolveRequest(context, moduleName, platform);
};

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
