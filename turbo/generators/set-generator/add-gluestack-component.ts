import type { Dirent } from "node:fs";
import type { PlopTypes } from "@turbo/gen";

import { execSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import {
  Node,
  type ObjectLiteralExpression,
  Project,
  type PropertyAssignment,
  type SourceFile,
  SyntaxKind,
} from "ts-morph";

type ResolverInfo = {
  resolverName: string;
  variantName: string;
  values: string[];
};

const APPLY_FLAG =
  process.argv.includes("--apply-resolver") ||
  process.argv.includes("--apply-variant-resolver") ||
  process.argv.includes("--apply");

const VERBOSE_FLAG = process.argv.includes("--verbose");

const VARIANT_SKIP_SET = new Set(["true", "false"]);

// We don't track per-file changes; Biome will run over the component directory.

// ---------------------------------------------
// Small helpers (keep cyclomatic complexity low)
// ---------------------------------------------
function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// Find the monorepo root by walking up until we find a directory that contains "apps".
// This allows running the generator from any subdirectory (e.g. apps/<app-name>).
let CACHED_REPO_ROOT: string | undefined;
function findRepoRoot(): string {
  if (CACHED_REPO_ROOT) return CACHED_REPO_ROOT;
  let dir = resolve(process.cwd());
  // Walk up to filesystem root
  while (true) {
    const appsPath = join(dir, "apps");
    if (existsSync(appsPath) && statSync(appsPath).isDirectory()) {
      CACHED_REPO_ROOT = dir;
      return dir;
    }
    const parent = resolve(dir, "..");
    if (parent === dir) {
      // Reached FS root; fallback to current working directory
      CACHED_REPO_ROOT = resolve(process.cwd());
      return CACHED_REPO_ROOT;
    }
    dir = parent;
  }
}

function buildResolverName(styleName: string, variantName: string): string {
  const base = styleName.replace(/Style$/u, "");
  return `resolve${capitalize(base)}${capitalize(variantName)}`;
}

function collectTsFiles(dir: string, output: string[]): void {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const entryPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectTsFiles(entryPath, output);
      continue;
    }
    if (entry.isFile() && /\.(tsx?|jsx?)$/u.test(entry.name)) {
      output.push(entryPath);
    }
  }
}

function getNameText(node: Node | undefined): string | undefined {
  if (!node) return undefined;
  if (Node.isIdentifier(node)) return node.getText();
  if (Node.isStringLiteral(node) || Node.isNumericLiteral(node)) {
    return node.getText().replace(/^["']|["']$/gu, "");
  }
  return undefined;
}

function isPrimitiveLiteral(node: Node | undefined): boolean {
  return Boolean(
    node && (Node.isStringLiteral(node) || Node.isNumericLiteral(node)),
  );
}

function isSkippableVariant(name: string | undefined): boolean {
  return !name || VARIANT_SKIP_SET.has(name);
}

function getParentVariantsNested(
  objectLiteral: ObjectLiteralExpression,
): ObjectLiteralExpression | undefined {
  const parentVariantsProp = objectLiteral.getProperty("parentVariants");
  if (!parentVariantsProp) return undefined;
  if (!Node.isPropertyAssignment(parentVariantsProp)) return undefined;
  return parentVariantsProp.getInitializerIfKind(
    SyntaxKind.ObjectLiteralExpression,
  );
}

function transformVariantProperty(
  objectLiteral: ObjectLiteralExpression,
  variantName: string,
  resolverName: string,
): boolean {
  const property = objectLiteral.getProperty(variantName);
  if (!property) return false;

  if (Node.isShorthandPropertyAssignment(property)) {
    property.replaceWithText(`${variantName}: ${resolverName}(${variantName})`);
    return true;
  }

  if (!Node.isPropertyAssignment(property)) return false;
  const initializer = property.getInitializer();
  if (!initializer) return false;
  const text = initializer.getText();
  if (text.includes(`${resolverName}(`)) return false;
  if (isPrimitiveLiteral(initializer)) return false;
  property.setInitializer(`${resolverName}(${text})`);
  return true;
}

function applyResolversToObject(
  objectLiteral: ObjectLiteralExpression,
  resolverMap: Map<string, string>,
): boolean {
  let changed = false;
  for (const [variantName, resolverName] of resolverMap.entries()) {
    if (transformVariantProperty(objectLiteral, variantName, resolverName)) {
      changed = true;
    }
  }
  const nested = getParentVariantsNested(objectLiteral);
  if (nested && applyResolversToObject(nested, resolverMap)) changed = true;
  return changed;
}

// ---------------------------------------------
// Context gathering and AST mapping
// ---------------------------------------------

type ResolverContext = {
  styleResolverMap: Map<string, ResolverInfo[]>;
  variantValueNodes: Set<ObjectLiteralExpression>;
  styleConfigNodes: Set<ObjectLiteralExpression>;
};

function gatherResolverContext(sourceFile: SourceFile): ResolverContext {
  const styleResolverMap = new Map<string, ResolverInfo[]>();
  const variantValueNodes = new Set<ObjectLiteralExpression>();
  const styleConfigNodes = new Set<ObjectLiteralExpression>();

  function getTvaConfigArg(variable: import("ts-morph").VariableDeclaration) {
    const init = variable.getInitializer();
    if (!Node.isCallExpression(init)) return undefined;
    const expr = init.getExpression();
    if (!Node.isIdentifier(expr) || expr.getText() !== "tva") return undefined;
    const args = init.getArguments();
    if (args.length === 0) return undefined;
    const cfg = args[0];
    return Node.isObjectLiteralExpression(cfg) ? cfg : undefined;
  }

  function collectValueKeys(valuesObj: ObjectLiteralExpression): string[] {
    const keys: string[] = [];
    for (const prop of valuesObj.getProperties()) {
      if (!Node.isPropertyAssignment(prop)) return [];
      const key = getNameText(prop.getNameNode());
      if (isSkippableVariant(key)) return [];
      keys.push(String(key));
    }
    return keys;
  }

  function addConfigSubNodes(configArg: ObjectLiteralExpression): {
    variantsObj?: ObjectLiteralExpression;
  } {
    styleConfigNodes.add(configArg);
    const variantsProp = configArg
      .getProperty("variants")
      ?.asKind(SyntaxKind.PropertyAssignment) as PropertyAssignment | undefined;
    const defaultVariantsProp = configArg
      .getProperty("defaultVariants")
      ?.asKind(SyntaxKind.PropertyAssignment) as PropertyAssignment | undefined;
    const variantsObj = variantsProp?.getInitializerIfKind(
      SyntaxKind.ObjectLiteralExpression,
    );
    const defaultVariantsObj = defaultVariantsProp?.getInitializerIfKind(
      SyntaxKind.ObjectLiteralExpression,
    );
    if (variantsObj) styleConfigNodes.add(variantsObj);
    if (defaultVariantsObj) styleConfigNodes.add(defaultVariantsObj);
    return { variantsObj };
  }

  function buildResolverInfos(
    variableName: string,
    variantsObj: ObjectLiteralExpression,
  ): ResolverInfo[] {
    const infos: ResolverInfo[] = [];
    for (const variant of variantsObj.getProperties()) {
      if (!Node.isPropertyAssignment(variant)) continue;
      const name = getNameText(variant.getNameNode());
      if (isSkippableVariant(name)) continue;
      const variantName = name as string;

      const valuesObj = variant.getInitializerIfKind(
        SyntaxKind.ObjectLiteralExpression,
      );
      if (!valuesObj) continue;
      variantValueNodes.add(valuesObj);

      const valueKeys = collectValueKeys(valuesObj);
      if (valueKeys.length === 0) continue;

      const resolverName = buildResolverName(variableName, variantName);
      infos.push({ resolverName, variantName, values: valueKeys });
    }
    return infos;
  }

  for (const variable of sourceFile.getVariableDeclarations()) {
    const configArg = getTvaConfigArg(variable);
    if (!configArg) continue;
    const { variantsObj } = addConfigSubNodes(configArg);
    if (!variantsObj) continue;
    const resolverInfos = buildResolverInfos(variable.getName(), variantsObj);
    if (resolverInfos.length > 0)
      styleResolverMap.set(variable.getName(), resolverInfos);
  }

  return { styleResolverMap, variantValueNodes, styleConfigNodes };
}

function ensureResolverDeclarations(
  sourceFile: SourceFile,
  styleResolverMap: Map<string, ResolverInfo[]>,
) {
  let changed = false;

  function ensureImport(): void {
    const needsImport = !sourceFile
      .getImportDeclarations()
      .some(
        (decl) => decl.getModuleSpecifierValue() === "@/utils/variant-resolver",
      );
    if (!needsImport) return;
    sourceFile.addImportDeclaration({
      namedImports: [{ name: "createVariantResolver" }],
      moduleSpecifier: "@/utils/variant-resolver",
    });
    changed = true;
  }

  function getInsertContext(styleName: string) {
    const variable = sourceFile.getVariableDeclaration(styleName);
    if (variable) {
      const varStatement = variable.getFirstAncestorByKind(
        SyntaxKind.VariableStatement,
      );
      if (varStatement) {
        const parent =
          varStatement.getParentIfKind(SyntaxKind.SourceFile) ??
          varStatement.getParentIfKind(SyntaxKind.Block);
        if (parent) {
          const statements = parent.getStatements();
          const insertIndex = Math.max(
            statements.findIndex((s) => s === varStatement) + 1,
            0,
          );
          return { parent, insertIndex } as const;
        }
      }
    }
    // Fallback: insert after last import at top-level
    const parent = sourceFile;
    const statements = parent.getStatements();
    let lastImportIdx = -1;
    for (let i = 0; i < statements.length; i++) {
      if (Node.isImportDeclaration(statements[i])) lastImportIdx = i;
    }
    const insertIndex = lastImportIdx + 1;
    return { parent, insertIndex } as const;
  }

  ensureImport();

  const resolverNamesByStyle = new Map<string, Map<string, string>>();
  for (const [styleName, infos] of styleResolverMap.entries()) {
    if (infos.length === 0) continue;
    const ctx = getInsertContext(styleName);
    if (!ctx) continue;

    const resolverNames = new Map<string, string>();
    resolverNamesByStyle.set(styleName, resolverNames);

    for (const info of infos) {
      resolverNames.set(info.variantName, info.resolverName);
      if (sourceFile.getVariableDeclaration(info.resolverName)) continue;
      const valuesArray = info.values.map((v) => `"${v}"`).join(", ");
      ctx.parent.insertStatements(
        ctx.insertIndex,
        `const ${info.resolverName} = createVariantResolver([${valuesArray}] as const);\n`,
      );
      changed = true;
    }
  }

  return { changed, resolverNamesByStyle };
}

function applyResolversToCalls(
  sourceFile: SourceFile,
  resolverNamesByStyle: Map<string, Map<string, string>>,
  variantValueNodes: Set<ObjectLiteralExpression>,
  styleConfigNodes: Set<ObjectLiteralExpression>,
): boolean {
  let fileChanged = false;
  if (resolverNamesByStyle.size === 0) return fileChanged;

  function isEligibleArg(arg: Node): arg is ObjectLiteralExpression {
    return (
      Node.isObjectLiteralExpression(arg) &&
      !variantValueNodes.has(arg) &&
      !styleConfigNodes.has(arg)
    );
  }

  function applyForCall(call: import("ts-morph").CallExpression): boolean {
    const callee = call.getExpression();
    if (!Node.isIdentifier(callee)) return false;
    const resolverMap = resolverNamesByStyle.get(callee.getText());
    if (!resolverMap || resolverMap.size === 0) return false;
    let changed = false;
    for (const arg of call.getArguments()) {
      if (!isEligibleArg(arg)) continue;
      if (applyResolversToObject(arg, resolverMap)) changed = true;
    }
    return changed;
  }

  const callExpressions = sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression,
  );
  for (const call of callExpressions) {
    if (applyForCall(call)) fileChanged = true;
  }

  return fileChanged;
}

function buildGlobalStyleResolverMap(
  project: Project,
  files: string[],
): Map<string, ResolverInfo[]> {
  const globalMap = new Map<string, ResolverInfo[]>();
  for (const filePath of files) {
    const sf = project.addSourceFileAtPath(filePath);
    const { styleResolverMap } = gatherResolverContext(sf);
    for (const [styleName, infos] of styleResolverMap.entries()) {
      const existing = globalMap.get(styleName) ?? [];
      const merged = [...existing];
      for (const info of infos) {
        if (!merged.some((m) => m.variantName === info.variantName)) {
          merged.push(info);
        }
      }
      globalMap.set(styleName, merged);
    }
  }
  return globalMap;
}

function getStylesUsedInFile(
  sourceFile: SourceFile,
  availableStyles: Set<string>,
): Set<string> {
  const used = new Set<string>();
  const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
  for (const call of calls) {
    const callee = call.getExpression();
    if (!Node.isIdentifier(callee)) continue;
    const name = callee.getText();
    if (availableStyles.has(name)) used.add(name);
  }
  return used;
}

async function applyVariantResolverFixes(options: {
  app: string;
  component: string;
  verbose?: boolean;
}): Promise<string> {
  function getComponentDir(repoRoot: string): string {
    const appPath = resolve(repoRoot, "apps", options.app);
    return resolve(appPath, "src", "components", "ui", options.component);
  }

  function validateInputs(repoRoot: string) {
    const componentDir = getComponentDir(repoRoot);
    if (!(existsSync(componentDir) && statSync(componentDir).isDirectory())) {
      return {
        ok: false as const,
        componentDir,
        error: `Component directory not found: ${relative(repoRoot, componentDir)}`,
      };
    }
    const appPath = resolve(repoRoot, "apps", options.app);
    const tsConfigPath = resolve(appPath, "tsconfig.json");
    if (!existsSync(tsConfigPath)) {
      return {
        ok: false as const,
        componentDir,
        error: `tsconfig.json not found for app: ${relative(repoRoot, tsConfigPath)}`,
      };
    }
    return { ok: true as const, componentDir, tsConfigPath };
  }

  function collectComponentFiles(componentDir: string): string[] {
    const files: string[] = [];
    collectTsFiles(componentDir, files);
    return files;
  }

  function processFile(
    sourceFile: SourceFile,
    availableStyles: Set<string>,
    globalStyleResolverMap: Map<string, ResolverInfo[]>,
  ): boolean {
    const { variantValueNodes, styleConfigNodes } =
      gatherResolverContext(sourceFile);
    const stylesUsed = getStylesUsedInFile(sourceFile, availableStyles);
    if (stylesUsed.size === 0) return false;
    const perFileMap = new Map<string, ResolverInfo[]>();
    for (const styleName of stylesUsed) {
      const infos = globalStyleResolverMap.get(styleName);
      if (infos && infos.length > 0) perFileMap.set(styleName, infos);
    }
    if (perFileMap.size === 0) return false;
    const { changed, resolverNamesByStyle } = ensureResolverDeclarations(
      sourceFile,
      perFileMap,
    );
    const callsChanged = applyResolversToCalls(
      sourceFile,
      resolverNamesByStyle,
      variantValueNodes,
      styleConfigNodes,
    );
    return changed || callsChanged;
  }

  const repoRoot = findRepoRoot();
  const validation = validateInputs(repoRoot);
  if (!validation.ok) return validation.error;
  const { componentDir, tsConfigPath } = validation;

  const files = collectComponentFiles(componentDir);
  if (files.length === 0)
    return "No TypeScript files detected – skipping resolver adjustments";

  const project = new Project({
    tsConfigFilePath: tsConfigPath,
    skipAddingFilesFromTsConfig: true,
  });
  const changedFiles: string[] = [];
  const globalStyleResolverMap = buildGlobalStyleResolverMap(project, files);
  const availableStyles = new Set(globalStyleResolverMap.keys());

  for (const filePath of files) {
    const sourceFile = project.addSourceFileAtPath(filePath);
    const updated = processFile(
      sourceFile,
      availableStyles,
      globalStyleResolverMap,
    );
    if (updated) changedFiles.push(filePath);
  }

  if (changedFiles.length === 0) {
    return "No resolver adjustments were required";
  }

  await project.save();

  if (options.verbose) {
    for (const file of changedFiles) {
      process.stdout.write(`Updated ${relative(repoRoot, file)}\n`);
    }
  }

  return `Applied variant resolver updates in ${changedFiles.length} file(s)`;
}

async function getApps(): Promise<string[]> {
  const basePath = resolve(findRepoRoot(), "apps");
  if (!existsSync(basePath)) {
    // Gracefully handle missing apps directory to avoid ENOENT during prompt rendering
    console.error(
      `Could not find an 'apps' directory. Looked in: ${basePath}. ` +
        "Ensure you're in a monorepo with an 'apps' folder.",
    );
    return [];
  }
  const entries: Dirent[] = await readdir(basePath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export default function addGluestackComponent(plop: PlopTypes.NodePlopAPI) {
  plop.setGenerator("add-gluestack-component", {
    description:
      "Add a Gluestack UI v3 component to an app and optionally apply variant resolver fixes",
    prompts: [
      {
        type: "list",
        name: "app",
        message: "Which app should receive the component?",
        choices: getApps,
      },
      {
        type: "input",
        name: "component",
        message: "Glues­tack component name (e.g. vstack, button)",
        validate: (value: string) =>
          value && value.trim().length > 0
            ? true
            : "Component name is required",
      },
      {
        type: "confirm",
        name: "applyResolver",
        message: "Apply createVariantResolver post-processing?",
        default: false,
        when: () => !APPLY_FLAG,
      },
    ],
    actions: (answers) => {
      const app = (answers?.app as string).trim();
      const component = (answers?.component as string).trim();
      const applyResolver = APPLY_FLAG || Boolean(answers?.applyResolver);
      const appPath = resolve(findRepoRoot(), "apps", app);

      return [
        () => {
          const command = `pnpx gluestack-ui@latest add ${component}`;
          execSync(command, { stdio: "inherit", cwd: appPath });
          return `Added Gluestack component '${component}' to ${app}`;
        },
        async () => {
          if (!applyResolver) {
            return "Skipped variant resolver post-processing";
          }
          const message = await applyVariantResolverFixes({
            app,
            component,
            verbose: VERBOSE_FLAG,
          });
          return message;
        },
        () => {
          const repoRoot = findRepoRoot();
          const componentDir = resolve(
            repoRoot,
            "apps",
            app,
            "src",
            "components",
            "ui",
            component,
          );
          if (
            !(existsSync(componentDir) && statSync(componentDir).isDirectory())
          ) {
            return "Biome step skipped: component directory not found";
          }

          const relDir = relative(repoRoot, componentDir);

          const checkCmd = `pnpx biome check --write --unsafe --no-errors-on-unmatched "${relDir}"`;
          execSync(checkCmd, { stdio: "inherit" });

          return `Ran Biome check+format on ${relDir}`;
        },
      ];
    },
  });
}
