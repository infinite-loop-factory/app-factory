import type { PlopTypes } from "@turbo/gen";
import type { PackageJson } from "type-fest";

import { execSync } from "node:child_process";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

interface LicenseInfo {
  name: string;
  version?: string;
  license?: string;
  author?: string;
  description?: string;
  repository?: string;
  homepage?: string;
  source?: "local" | "npm" | "fallback";
}

function fetchPackageInfoFromNpm(depName: string): LicenseInfo | null {
  try {
    const npmInfo = execSync(`npm view ${depName} --json`, {
      encoding: "utf8",
      timeout: 15000,
    });
    const pkgInfo = JSON.parse(npmInfo);

    return {
      name: depName,
      version: pkgInfo.version,
      license: pkgInfo.license,
      author:
        typeof pkgInfo.author === "string"
          ? pkgInfo.author
          : pkgInfo.author?.name || pkgInfo.author?.email,
      description: pkgInfo.description,
      repository:
        typeof pkgInfo.repository === "string"
          ? pkgInfo.repository
          : pkgInfo.repository?.url,
      homepage: pkgInfo.homepage,
      source: "npm",
    };
  } catch {
    return null;
  }
}

async function getPackageInfoFromLocal(
  depName: string,
): Promise<LicenseInfo | null> {
  try {
    const depPackageJsonPath = resolve(`node_modules/${depName}/package.json`);
    const content = await readFile(depPackageJsonPath, "utf8");
    const depPkg = JSON.parse(content) as PackageJson;

    return {
      name: depName,
      version: depPkg.version,
      license: depPkg.license as string,
      author:
        typeof depPkg.author === "string"
          ? depPkg.author
          : depPkg.author?.name || depPkg.author?.email,
      description: depPkg.description,
      repository:
        typeof depPkg.repository === "string"
          ? depPkg.repository
          : depPkg.repository?.url,
      homepage: depPkg.homepage,
      source: "local",
    };
  } catch {
    return null;
  }
}

async function processPackageDependencies(
  dependencies: Record<string, string>,
): Promise<LicenseInfo[]> {
  const licenses: LicenseInfo[] = [];
  const processedPackages = new Set<string>();

  for (const [depName, depVersion] of Object.entries(dependencies)) {
    // Skip duplicates and scoped packages that are already processed
    if (processedPackages.has(depName)) continue;
    processedPackages.add(depName);

    // Try local first (faster), then npm registry
    let licenseInfo = await getPackageInfoFromLocal(depName);

    if (!licenseInfo) {
      licenseInfo = fetchPackageInfoFromNpm(depName);
    }

    if (!licenseInfo) {
      // Add minimal info as fallback
      licenseInfo = {
        name: depName,
        version: depVersion.replace(/[\^~>=<]|[\d.]+/g, "").trim() || "unknown",
        license: "Unknown",
        source: "fallback",
      };
    }

    licenses.push(licenseInfo);
  }

  return licenses;
}

function filterAndCleanDependencies(
  packageJson: PackageJson,
): Record<string, string> {
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  // Filter out local workspace packages and clean up versions
  const cleanedDeps: Record<string, string> = {};

  for (const [name, version] of Object.entries(allDeps || {})) {
    if (!name.startsWith("@infinite-loop-factory/") && version) {
      cleanedDeps[name] = version;
    }
  }

  return cleanedDeps;
}

interface GeneratorAnswers {
  appName: string;
}

export default function generateLicense(plop: PlopTypes.NodePlopAPI) {
  const getApps = async () => {
    const apps = await readdir(resolve("apps"));
    return apps.filter((app) => !app.startsWith("."));
  };

  // Helper function to get app name from process args
  const getAppNameFromArgs = (): string | undefined => {
    const argv = process.argv;

    // Look for JSON argument that contains args
    for (const arg of argv) {
      try {
        const parsed = JSON.parse(arg);
        if (
          parsed.args &&
          Array.isArray(parsed.args) &&
          parsed.args.length > 0
        ) {
          return parsed.args[0];
        }
      } catch {
        // Not JSON, continue
      }
    }

    return undefined;
  };

  // Helper function to generate license for a given app name
  const generateLicenseForApp = async (appName: string): Promise<string> => {
    // Validate app exists
    const apps = await getApps();
    if (!apps.includes(appName)) {
      throw new Error(
        `App '${appName}' not found. Available apps: ${apps.join(", ")}`,
      );
    }

    try {
      // Read app's package.json to get dependencies
      const appPackageJsonPath = resolve(`apps/${appName}/package.json`);
      const packageJsonContent = await readFile(appPackageJsonPath, "utf8");
      const packageJson = JSON.parse(packageJsonContent) as PackageJson;

      // Filter and clean dependencies
      const dependencies = filterAndCleanDependencies(packageJson);

      // Process dependencies
      const licenses = await processPackageDependencies(dependencies);

      // Sort licenses alphabetically by name
      licenses.sort((a, b) => a.name.localeCompare(b.name));

      // Group by source for statistics
      const stats = {
        local: licenses.filter((l) => l.source === "local").length,
        npm: licenses.filter((l) => l.source === "npm").length,
        fallback: licenses.filter((l) => l.source === "fallback").length,
      };

      // Ensure assets directory exists (try src/assets first, then assets)
      let assetsDir = resolve(`apps/${appName}/src/assets`);

      try {
        await mkdir(assetsDir, { recursive: true });
      } catch {
        // If src/assets fails, try just assets
        assetsDir = resolve(`apps/${appName}/assets`);
        await mkdir(assetsDir, { recursive: true });
      }

      // Prepare license data
      const licenseData = {
        generated: new Date().toISOString(),
        app: appName,
        totalPackages: licenses.length,
        stats,
        appVersion: packageJson.version || "1.0.0",
        licenses: licenses.map(({ source, ...license }) => license), // Remove source from output
      };

      // Write licenses.json file
      const licensesFilePath = join(assetsDir, "licenses.json");
      await writeFile(
        licensesFilePath,
        JSON.stringify(licenseData, null, 2),
        "utf8",
      );

      return `Generated licenses.json for ${appName} (${licenses.length} packages: ${stats.local} local, ${stats.npm} npm, ${stats.fallback} fallback)`;
    } catch (error) {
      throw new Error(`Error generating licenses for ${appName}: ${error}`);
    }
  };

  // Smart generator that handles both args and prompts
  plop.setGenerator("license", {
    description:
      "Generate licenses.json file for an app (use --args <app-name> or select interactively)",
    prompts: [
      {
        type: "list",
        name: "appName",
        message: "Which app would you like to generate licenses for?",
        choices: getApps,
      },
    ],
    actions: [
      async (answers: object) => {
        // Try args first, then answers
        const argAppName = getAppNameFromArgs();
        const appName = argAppName || (answers as GeneratorAnswers).appName;

        if (!appName) {
          const apps = await getApps();
          throw new Error(
            `App name is required. Usage: turbo gen license --args <app-name>\nAvailable apps: ${apps.join(", ")}`,
          );
        }

        return await generateLicenseForApp(appName);
      },
    ],
  });

  // Keep interactive-only generator for explicit use
  plop.setGenerator("license-interactive", {
    description:
      "Generate licenses.json file for an app (interactive selection only)",
    prompts: [
      {
        type: "list",
        name: "appName",
        message: "Which app would you like to generate licenses for?",
        choices: getApps,
      },
    ],
    actions: [
      async (answers: object) => {
        const typedAnswers = answers as GeneratorAnswers;
        return await generateLicenseForApp(typedAnswers.appName);
      },
    ],
  });
}
