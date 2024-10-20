import { execSync } from "node:child_process";
import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import type { PlopTypes } from "@turbo/gen";

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
        const appPath = join(getDirectoryPath("apps"), appName);
        const isDirectory = (await stat(appPath)).isDirectory();

        if (!isDirectory || appName.startsWith(".")) return null;

        const packageJson = await readFile(
          join(appPath, "package.json"),
          "utf-8",
        );

        const hasDependency =
          packageName in JSON.parse(packageJson).dependencies;

        const displayName = hasDependency ? `🟢 ${appName}` : `🔴 ${appName}`;

        return { name: displayName, value: appName, checked: hasDependency };
      }),
    );

    return appNames.filter(Boolean);
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

      return [
        async () => {
          const packageName = await getPackageName(selectedPackage);

          // 모든 앱에서 해당 패키지를 제거하고 선택된 앱에 다시 추가
          execSync(`pnpm --filter "*" remove ${packageName}`);
          execSync(
            [
              "pnpm",
              selectedApps.map((app) => `--filter ${app}`).join(" "),
              "add",
              `${packageName}@workspace:*`,
            ].join(" "),
          );

          execSync("pnpm install");

          return "Package linked successfully to the selected apps";
        },
      ];
    },
  });
}
