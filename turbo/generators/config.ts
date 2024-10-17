import type { PlopTypes } from "@turbo/gen";
import createModule from "./set-generator/create-module";
import linkPackageToApps from "./set-generator/link-package";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  createModule(plop);
  linkPackageToApps(plop);
}
