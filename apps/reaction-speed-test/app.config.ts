import type { ConfigContext, ExpoConfig } from "expo/config";

// const validateEnv = () => {
//   const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
//   const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

//   if (!supabaseUrl) {
//     throw new Error(
//       "Required environment variable EXPO_PUBLIC_SUPABASE_URL is missing",
//     );
//   }

//   if (!supabaseAnonKey) {
//     throw new Error(
//       "Required environment variable EXPO_PUBLIC_SUPABASE_ANON_KEY is missing",
//     );
//   }

//   return { supabaseUrl, supabaseAnonKey };
// };

export default ({ config }: ConfigContext): ExpoConfig => {
  // const env = validateEnv();

  return {
    ...config,
    name: "reaction-speed-test",
    slug: "reaction-speed-test",
    scheme: "reaction-speed-test",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      bundleIdentifier: "com.infiniteloopfactory.reactionspeedtest",
      supportsTablet: true,
    },
    android: {
      package: "com.infiniteloopfactory.reactionspeedtest",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: ["expo-router", "expo-localization", "expo-font"],
    experiments: {
      tsconfigPaths: true,
      typedRoutes: true,
      baseUrl: "/app-factory/reaction-speed-test",
    },
    extra: {
      eas: {
        projectId: "bf06d3a4-f856-475c-8c2b-993178ae6c12",
      },
      // supabaseUrl: env.supabaseUrl,
      // supabaseAnonKey: env.supabaseAnonKey,
    },
  };
};
