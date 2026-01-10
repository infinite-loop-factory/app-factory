import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";

import { objectKeys } from "@toss/utils";
import { Tabs } from "expo-router";
import { TabBarIcon } from "@/components/features/navigation/tab-bar-icon";
import { TAB_BAR_ICON } from "@/constants/tab-bar.ts";
import useTabBarOption from "@/hooks/use-tab-bar-option";
import { useTranslation } from "@/hooks/use-translation";

export default function TabLayout() {
  const { t } = useTranslation();
  const tabBarOptions = useTabBarOption();
  return (
    <Tabs
      screenOptions={
        {
          ...tabBarOptions,
          headerShown: false,
        } as BottomTabNavigationOptions
      }
    >
      {objectKeys(TAB_BAR_ICON).map((name) => (
        <Tabs.Screen
          key={name}
          name={name === "home" ? "index" : name}
          options={{
            title: t(`tabs.${name}`),
            tabBarIcon: ({ focused, color }) => (
              <TabBarIcon color={color} focused={focused} name={name} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
