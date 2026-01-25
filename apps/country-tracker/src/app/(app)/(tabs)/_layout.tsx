import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import type { LucideProps } from "lucide-react-native";
import type { ComponentType } from "react";

import { Tabs } from "expo-router";
import { Globe, Home, Settings } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n from "@/lib/i18n";

type TabInfo = {
  name: string;
  title: string;
  icon: BottomTabNavigationOptions["tabBarIcon"];
};

const createTabBarIcon = (
  IconComponent: ComponentType<LucideProps>,
): BottomTabNavigationOptions["tabBarIcon"] => {
  return ({ color }) => <IconComponent color={color} />;
};

const tabs: TabInfo[] = [
  {
    name: "index",
    title: i18n.t("home.tab"),
    icon: createTabBarIcon(Home),
  },
  {
    name: "map",
    title: i18n.t("map.tab"),
    icon: createTabBarIcon(Globe),
  },
  {
    name: "settings",
    title: i18n.t("settings.tab"),
    icon: createTabBarIcon(Settings),
  },
];

export default function TabsLayout() {
  const [iconHighlightColor, tabBackgroundColor, borderColor] = useThemeColor([
    "primary-500",
    "background",
    "outline-200",
  ]);
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: iconHighlightColor,
        headerShown: false,
        tabBarLabelPosition: "below-icon",
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarIconStyle: {
          marginTop: 5,
          marginBottom: -3,
        },
        tabBarStyle: {
          borderTopColor: borderColor,
          backgroundColor: tabBackgroundColor,
          height: 60 + insets.bottom,
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: tab.icon,
          }}
        />
      ))}
    </Tabs>
  );
}
