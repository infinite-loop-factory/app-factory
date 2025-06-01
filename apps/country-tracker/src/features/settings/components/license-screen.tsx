import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useThemeColor } from "@/hooks/useThemeColor";
import i18n from "@/i18n";
import { ExternalLink } from "lucide-react-native";
import { Linking, TouchableOpacity } from "react-native";

interface LicenseItem {
  name: string;
  version?: string;
  license?: string;
  author?: string;
  description?: string;
}

// 주요 패키지들의 라이센스 정보 (실제로는 package.json에서 동적으로 생성해야 함)
const licenses: LicenseItem[] = [
  {
    name: "react",
    license: "MIT",
    author: "Meta Platforms, Inc.",
    description:
      "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
  },
  {
    name: "react-native",
    license: "MIT",
    author: "Meta Platforms, Inc.",
    description: "A framework for building native apps with React.",
  },
  {
    name: "react-dom",
    license: "MIT",
    author: "Meta Platforms, Inc.",
    description: "React package for working with the DOM.",
  },
  {
    name: "expo",
    license: "MIT",
    author: "Expo",
    description:
      "An open-source platform for making universal native apps with React.",
  },
  {
    name: "expo-router",
    license: "MIT",
    author: "Expo",
    description: "File-based router for universal React Native apps.",
  },
  {
    name: "expo-constants",
    license: "MIT",
    author: "Expo",
    description:
      "Provides system information that remains constant throughout the lifetime of your app.",
  },
  {
    name: "expo-font",
    license: "MIT",
    author: "Expo",
    description:
      "Load fonts at runtime and use them in React Native components.",
  },
  {
    name: "expo-linking",
    license: "MIT",
    author: "Expo",
    description:
      "Provides utilities for your app to interact with other installed apps using deep links.",
  },
  {
    name: "expo-localization",
    license: "MIT",
    author: "Expo",
    description: "Provides access to device locale information.",
  },
  {
    name: "expo-location",
    license: "MIT",
    author: "Expo",
    description: "Provides access to reading geolocation information.",
  },
  {
    name: "expo-splash-screen",
    license: "MIT",
    author: "Expo",
    description: "Provides an API to configure the native splash screen.",
  },
  {
    name: "expo-status-bar",
    license: "MIT",
    author: "Expo",
    description:
      "Provides the same interface as the React Native StatusBar API.",
  },
  {
    name: "expo-system-ui",
    license: "MIT",
    author: "Expo",
    description: "Provides access to system UI styling APIs.",
  },
  {
    name: "expo-task-manager",
    license: "MIT",
    author: "Expo",
    description: "Provides an API that allows you to define and run tasks.",
  },
  {
    name: "expo-web-browser",
    license: "MIT",
    author: "Expo",
    description: "Provides access to the system's web browser.",
  },
  {
    name: "expo-intent-launcher",
    license: "MIT",
    author: "Expo",
    description: "Provides a way to launch Android intents.",
  },

  // UI Libraries
  {
    name: "@gluestack-ui/actionsheet",
    license: "MIT",
    author: "GlueStack",
    description: "A universal actionsheet component for React Native.",
  },
  {
    name: "@gluestack-ui/button",
    license: "MIT",
    author: "GlueStack",
    description: "A universal button component for React Native.",
  },
  {
    name: "@gluestack-ui/divider",
    license: "MIT",
    author: "GlueStack",
    description: "A universal divider component for React Native.",
  },
  {
    name: "@gluestack-ui/fab",
    license: "MIT",
    author: "GlueStack",
    description:
      "A universal floating action button component for React Native.",
  },
  {
    name: "@gluestack-ui/input",
    license: "MIT",
    author: "GlueStack",
    description: "A universal input component for React Native.",
  },
  {
    name: "@gluestack-ui/menu",
    license: "MIT",
    author: "GlueStack",
    description: "A universal menu component for React Native.",
  },
  {
    name: "@gluestack-ui/nativewind-utils",
    license: "MIT",
    author: "GlueStack",
    description: "Utilities for NativeWind integration with GlueStack UI.",
  },
  {
    name: "@gluestack-ui/overlay",
    license: "MIT",
    author: "GlueStack",
    description: "A universal overlay component for React Native.",
  },
  {
    name: "@gluestack-ui/select",
    license: "MIT",
    author: "GlueStack",
    description: "A universal select component for React Native.",
  },
  {
    name: "@gluestack-ui/switch",
    license: "MIT",
    author: "GlueStack",
    description: "A universal switch component for React Native.",
  },
  {
    name: "@gluestack-ui/toast",
    license: "MIT",
    author: "GlueStack",
    description: "A universal toast component for React Native.",
  },
  {
    name: "nativewind",
    license: "MIT",
    author: "NativeWind",
    description: "Tailwind CSS for React Native.",
  },
  {
    name: "tailwindcss",
    license: "MIT",
    author: "Tailwind Labs",
    description: "A utility-first CSS framework.",
  },

  // State Management & Utils
  {
    name: "jotai",
    license: "MIT",
    author: "Jotai",
    description: "Primitive and flexible state management for React.",
  },
  {
    name: "zod",
    license: "MIT",
    author: "Colin McDonnell",
    description:
      "TypeScript-first schema validation with static type inference.",
  },
  {
    name: "luxon",
    license: "MIT",
    author: "Isaac Cambron",
    description: "A library for working with dates and times in JS.",
  },
  {
    name: "es-toolkit",
    license: "MIT",
    author: "es-toolkit",
    description:
      "A modern JavaScript utility library that's 2-3x faster and up to 97% smaller.",
  },
  {
    name: "clsx",
    license: "MIT",
    author: "Luke Edwards",
    description:
      "A tiny utility for constructing className strings conditionally.",
  },

  // Navigation & Gestures
  {
    name: "@react-navigation/native",
    license: "MIT",
    author: "React Navigation",
    description: "Routing and navigation for your React Native apps.",
  },
  {
    name: "react-native-gesture-handler",
    license: "MIT",
    author: "Software Mansion",
    description:
      "Declarative API exposing platform native touch and gesture system to React Native.",
  },
  {
    name: "react-native-reanimated",
    license: "MIT",
    author: "Software Mansion",
    description: "React Native's Animated library reimplemented.",
  },
  {
    name: "react-native-safe-area-context",
    license: "MIT",
    author: "React Native Safe Area Context",
    description: "A flexible way to handle safe area insets in JS.",
  },
  {
    name: "react-native-screens",
    license: "MIT",
    author: "Software Mansion",
    description: "Native navigation primitives for your React Native app.",
  },

  // Maps & Location
  {
    name: "react-native-maps",
    license: "MIT",
    author: "Airbnb",
    description: "React Native Mapview component for iOS + Android.",
  },
  {
    name: "@gorhom/bottom-sheet",
    license: "MIT",
    author: "Mo Gorhom",
    description:
      "A performant interactive bottom sheet with fully configurable options.",
  },

  // Icons & SVG
  {
    name: "lucide-react-native",
    license: "ISC",
    author: "Lucide",
    description: "Beautiful & consistent icon toolkit made by the community.",
  },
  {
    name: "@expo/vector-icons",
    license: "MIT",
    author: "Expo",
    description:
      "Built-in support for popular icon fonts and the tooling to create your own Icon components.",
  },
  {
    name: "react-native-svg",
    license: "MIT",
    author: "React Native SVG",
    description: "SVG library for React Native.",
  },

  // Animation & Motion
  {
    name: "@legendapp/motion",
    license: "MIT",
    author: "Legend",
    description: "A declarative animations library for React Native.",
  },

  // Internationalization
  {
    name: "i18n-js",
    license: "MIT",
    author: "Fnando Vieira",
    description:
      "It's a small library to provide the I18n translations on the JavaScript.",
  },

  // Storage & async
  {
    name: "@react-native-async-storage/async-storage",
    license: "MIT",
    author: "React Native Async Storage",
    description:
      "An asynchronous, persistent, key-value storage system for React Native.",
  },

  // React Utilities
  {
    name: "@reactuses/core",
    license: "MIT",
    author: "ReactUses",
    description: "Collection of essential React Hooks.",
  },

  // Environment & Config
  {
    name: "@t3-oss/env-core",
    license: "MIT",
    author: "T3 OSS",
    description: "Validate your environment variables with a simple schema.",
  },

  // Error Tracking
  {
    name: "@sentry/react-native",
    license: "MIT",
    author: "Sentry",
    description: "Official Sentry SDK for React Native.",
  },

  // HTML Elements
  {
    name: "@expo/html-elements",
    license: "MIT",
    author: "Expo",
    description: "Primitive HTML elements for universal React apps.",
  },

  // Web
  {
    name: "react-native-web",
    license: "MIT",
    author: "Nicolas Gallagher",
    description: "React Native Components and APIs for the Web.",
  },

  // Code Transformation
  {
    name: "jscodeshift",
    license: "MIT",
    author: "Facebook",
    description: "A JavaScript codemod toolkit.",
  },
];

export default function LicenseScreen() {
  const [
    background,
    borderColor,
    headingColor,
    textColor,
    secondaryTextColor,
    linkColor,
  ] = useThemeColor([
    "background",
    "outline-200",
    "typography-900",
    "typography",
    "typography-600",
    "primary-600",
  ]);

  const openNpmPage = (packageName: string) => {
    const url = `https://www.npmjs.com/package/${packageName}`;
    Linking.openURL(url);
  };

  const renderLicenseItem = (item: LicenseItem, index: number) => {
    const isLast = index === licenses.length - 1;

    return (
      <TouchableOpacity
        key={item.name}
        className={`p-4 ${!isLast ? "border-b" : ""}`}
        style={{ borderBottomColor: borderColor }}
        onPress={() => openNpmPage(item.name)}
      >
        <Box className="flex-row items-start justify-between">
          <Box className="mr-3 flex-1">
            <Box className="mb-1 flex-row items-center">
              <Text
                className="font-bold text-base"
                style={{ color: textColor }}
              >
                {item.name}
              </Text>
              {item.version && (
                <Text
                  className="ml-2 text-sm"
                  style={{ color: secondaryTextColor }}
                >
                  {item.version}
                </Text>
              )}
            </Box>

            {item.license && (
              <Text className="mb-1 text-sm" style={{ color: linkColor }}>
                {item.license}
              </Text>
            )}

            {item.author && (
              <Text
                className="mb-1 text-sm"
                style={{ color: secondaryTextColor }}
              >
                by {item.author}
              </Text>
            )}

            {item.description && (
              <Text
                className="text-sm leading-5"
                style={{ color: secondaryTextColor }}
              >
                {item.description}
              </Text>
            )}
          </Box>

          <ExternalLink size={16} color={linkColor} />
        </Box>
      </TouchableOpacity>
    );
  };

  return (
    <ParallaxScrollView>
      <Box className="mb-4 px-1 pt-2">
        <Text
          className="text-base leading-6"
          style={{ color: secondaryTextColor }}
        >
          {i18n.t("settings.license.description")}
        </Text>
      </Box>

      <Box
        className="mx-1 mb-4 rounded-lg border shadow-xs"
        style={{ backgroundColor: background, borderColor }}
      >
        <Box
          className="border-b p-4"
          style={{ borderBottomColor: borderColor }}
        >
          <Heading
            className="font-bold text-xl"
            style={{ color: headingColor }}
          >
            {i18n.t("settings.license.libraries")}
          </Heading>
          <Text className="mt-1 text-sm" style={{ color: secondaryTextColor }}>
            {i18n.t("settings.license.tap-to-view")}
          </Text>
        </Box>

        {licenses.map((item, index) => renderLicenseItem(item, index))}
      </Box>
    </ParallaxScrollView>
  );
}
