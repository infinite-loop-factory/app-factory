import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import type { LucideProps } from "lucide-react-native";
import type { ComponentType } from "react";

import { themeAtom } from "@/atoms/theme.atom";
import { COLORS } from "@/constants/colors";
import i18n from "@/i18n";
import { Tabs } from "expo-router";
import { useAtomValue } from "jotai";
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
  const savedTheme = useAtomValue(themeAtom);

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
        tabBarActiveTintColor: COLORS[savedTheme].tint,
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
