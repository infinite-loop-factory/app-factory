import type { PlopTypes } from "@turbo/gen";

import addGluestackComponent from "./set-generator/add-gluestack-component";
import createModule from "./set-generator/create-module";
import generateLicense from "./set-generator/generate-license";
import linkPackageToApps from "./set-generator/link-package";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  createModule(plop);
  linkPackageToApps(plop);
  generateLicense(plop);
  addGluestackComponent(plop);
}
