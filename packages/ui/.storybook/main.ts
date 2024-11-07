import type { StorybookConfig } from "@storybook/react-webpack5";

import { dirname, join, resolve } from "node:path";

// ? for monorepo support
function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, "package.json")));
}

// ? https://github.com/storybookjs/addon-react-native-web/issues/45
export default {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-webpack5-compiler-babel"),
    getAbsolutePath("@storybook/addon-onboarding"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-interactions"),
    {
      name: getAbsolutePath("@storybook/addon-react-native-web"),
      options: {
        modulesToTranspile: [
          "react-native-reanimated",
          "nativewind",
          "react-native-css-interop",
        ],
        babelPresets: ["nativewind/babel"],
        babelPresetReactOptions: { jsxImportSource: "nativewind" },
        babelPlugins: [
          "react-native-reanimated/plugin",
          [
            "@babel/plugin-transform-react-jsx",
            {
              runtime: "automatic",
              importSource: "nativewind",
            },
          ],
        ],
      },
    },
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: { fastRefresh: true },
  },
  typescript: {
    check: false,
    checkOptions: {},
  },
  docs: {
    autodocs: "tag",
  },
  webpackFinal: (config) => {
    if (config.module?.rules) {
      config.module.rules.push({
        test: /\.css$/,
        use: [
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [require("tailwindcss"), require("autoprefixer")],
              },
            },
          },
        ],
        include: resolve(__dirname, "../"),
      });
    }

    return {
      ...config,
    };
  },
} satisfies StorybookConfig;
