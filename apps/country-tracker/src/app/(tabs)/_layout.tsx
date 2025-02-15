import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import type { LucideProps } from "lucide-react-native";
import type { ComponentType } from "react";

import { useThemeColor } from "@/hooks/useThemeColor";
import i18n from "@/i18n";
import { Tabs } from "expo-router";
import { Globe, Home, Settings } from "lucide-react-native";

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

export default function TabLayout() {
  const iconHighlightColor = useThemeColor("primary-500");

  const tabs: TabInfo[] = [
    {
      name: "index",
      title: i18n.t("home"),
      icon: createTabBarIcon(Home),
    },
    {
      name: "map",
      title: i18n.t("map"),
      icon: createTabBarIcon(Globe),
    },
    {
      name: "settings",
      title: i18n.t("settings"),
      icon: createTabBarIcon(Settings),
    },
  ];

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
