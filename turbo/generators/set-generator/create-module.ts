import { execSync } from "node:child_process";
import { access, readdir, rename } from "node:fs/promises";
import { join, resolve } from "node:path";
import type { PlopTypes } from "@turbo/gen";
import { kebabCase } from "es-toolkit/string";
import type { PackageJson } from "type-fest";

export default function createModule(plop: PlopTypes.NodePlopAPI) {
  const getTemplates = async () => {
    const templates = await readdir(resolve("turbo/generators/templates"));
    return templates;
  };
  plop.setGenerator("create-module", {
    description: "Generate a new app or package for the monorepo",
    prompts: [
      {
        type: "list",
        name: "type",
        message: "What type of module should be created?",
        choices: getTemplates,
      },
      {
        type: "input",
        name: "title",
        message: "What is the name of the new module?",
        validate: (input: string) => {
          if (input.includes(".")) {
            return "Module name cannot include an extension.";
          }
          if (input.includes(" ")) {
            return "Module name cannot include spaces.";
          }
          if (!input) {
            return "Module name is required.";
          }
          return true;
        },
      },
    ],
    actions: (answers) => {
      const isPackage = answers?.type === "package";
      const destinationBase = isPackage ? "packages" : "apps";
      const kebabTitle = kebabCase(answers?.title);

      return [
        {
          type: "addMany",
          templateFiles: "templates/{{ type }}/**/*",
          destination: `${destinationBase}/${kebabTitle}`,
          base: "templates/{{ type }}",
        },
        {
          type: "modify",
          path: `${destinationBase}/${kebabTitle}/package.json`,
          async transform(content) {
            const pkg = JSON.parse(content) as PackageJson;
            pkg.name = `@infinite-loop-factory/${kebabTitle}`;

            return JSON.stringify(pkg, null, 2);
          },
        },
        async () => {
          const oldPath = join(`${destinationBase}/${kebabTitle}`, "gitignore");
          const newPath = join(
            `${destinationBase}/${kebabTitle}`,
            ".gitignore",
          );

          // ? 필요시 fs-extra 사용
          if (
            await access(oldPath)
              .then(() => true)
              .catch(() => false)
          ) {
            await rename(oldPath, newPath);
          }

          execSync("pnpm install", { stdio: "inherit" });

          return "Package installed";
        },
      ];
    },
  });
}
