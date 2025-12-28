import type { PlopTypes } from "@turbo/gen";

import { execSync } from "node:child_process";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

export default function linkPackageToApps(plop: PlopTypes.NodePlopAPI) {
  // 패키지 또는 앱 디렉토리 경로 반환
  const getDirectoryPath = (type: "packages" | "apps") =>
    join(process.cwd(), type);

  // 패키지 이름을 가져오는 함수
  const listPackageNames = async () => {
    const files = await readdir(getDirectoryPath("packages"));

    const packageNames = await Promise.all(
      files.map(async (fileName: string) => {
        const filePath = join(getDirectoryPath("packages"), fileName);
        const isDirectory = (await stat(filePath)).isDirectory();
        return isDirectory && !fileName.startsWith(".") ? fileName : null;
      }),
    );

    return packageNames.filter(Boolean);
  };

  // 앱에서 패키지 종속성을 확인하는 함수
  const getAppDependencies = async (packageName: string) => {
    const appFiles = await readdir(getDirectoryPath("apps"));

    const appNames = await Promise.all(
      appFiles.map(async (appName: string) => {
        try {
          const appPath = join(getDirectoryPath("apps"), appName);
          const isDirectory = (await stat(appPath)).isDirectory();

          if (!isDirectory || appName.startsWith(".")) return null;

          // package.json 파일 존재 여부 체크
          const packageJsonPath = join(appPath, "package.json");
          try {
            await stat(packageJsonPath);
          } catch {
            console.error(`⚠️ Warning: No package.json found in ${appName}`);
            return null;
          }

          const packageJson = await readFile(packageJsonPath, "utf-8");
          const dependencies = JSON.parse(packageJson).dependencies || {};

          const hasDependency = packageName in dependencies;
          const displayName = hasDependency ? `🟢 ${appName}` : `🔴 ${appName}`;

          return { name: displayName, value: appName, checked: hasDependency };
        } catch (error) {
          console.error(`⚠️ Warning: Error processing ${appName}:`, error);
          return null;
        }
      }),
    );

    const validApps = appNames.filter(Boolean);

    if (validApps.length === 0) {
      throw new Error("\n❌ Error: No valid apps found in the workspace");
    }

    return validApps;
  };

  // 특정 패키지의 이름을 가져오는 함수
  const getPackageName = async (packageFolder: string) => {
    try {
      const packageJson = await readFile(
        join(getDirectoryPath("packages"), packageFolder, "package.json"),
        "utf-8",
      );
      const packageData = JSON.parse(packageJson);

      return packageData.name;
    } catch (error) {
      console.error(`Error reading package.json in ${packageFolder}:`, error);
      return undefined;
    }
  };

  plop.setGenerator("link-package", {
    description: "Link an existing package to the selected apps",
    prompts: [
      {
        type: "list",
        name: "selectedPackage",
        message: "Which package would you like to link?",
        choices: listPackageNames,
      },
      {
        type: "checkbox",
        name: "selectedApps",
        message: "Select the apps to link with the package:",
        choices: async ({ selectedPackage }) => {
          const packageName = await getPackageName(selectedPackage);
          return getAppDependencies(packageName);
        },
      },
    ],

    actions: (actions) => {
      const { selectedPackage, selectedApps } = actions as {
        selectedPackage: string;
        selectedApps: string[];
      };

      if (!selectedApps?.length) {
        throw new Error("\n❌ Error: No apps selected");
      }

      return [
        async () => {
          try {
            const packageName = await getPackageName(selectedPackage);
            if (!packageName)
              throw new Error(`Package name not found for ${selectedPackage}`);

            // 패키지 설치
            execSync(`pnpm --filter "*" remove ${packageName}`);
            execSync(
              `pnpm ${selectedApps.map((app) => `--filter ${app}`).join(" ")} add ${packageName}@workspace:*`,
            );
            execSync("pnpm install");

            // 각 선택된 앱의 tsconfig.json 수정
            for (const app of selectedApps) {
              const tsconfigPath = join(
                getDirectoryPath("apps"),
                app,
                "tsconfig.json",
              );
              const tsconfig = JSON.parse(
                await readFile(tsconfigPath, "utf-8"),
              );

              // compilerOptions 설정
              tsconfig.compilerOptions = {
                ...tsconfig.compilerOptions,
                baseUrl: ".",
                paths: {
                  ...tsconfig.compilerOptions?.paths,
                  [packageName]: [`../../packages/${selectedPackage}/dist`],
                },
              };

              await writeFile(tsconfigPath, JSON.stringify(tsconfig, null, 2));
            }

            return "✅ Package linked and tsconfig.json updated successfully";
          } catch (error) {
            throw new Error(`\n❌ Error: ${(error as Error).message}`);
          }
        },
      ];
    },
  });
}
