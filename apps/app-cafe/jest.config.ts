import type { Config } from "jest";

const config: Config = {
  verbose: true,
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transformIgnorePatterns: [
    "node_modules/(?!(?:.pnpm/)?((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg)|@gluestack-ui/.*)",
  ],
  moduleNameMapper: {
    "^react-native-reanimated$":
      "<rootDir>/__mocks__/react-native-reanimated.js",
  },
};

export default config;
