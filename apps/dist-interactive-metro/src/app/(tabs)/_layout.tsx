import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { TabBarIcon } from "@/components/navigation/tab-bar-icon";
import { COLORS } from "@/constants/colors";
import { type DefaultHomeTab, getDefaultHomeTab } from "@/data/app-preferences";
import i18n from "@/i18n";

const isDev = typeof __DEV__ !== "undefined" && __DEV__;

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  // initialRouteName must be known at first mount, so wait for the stored
  // preference before rendering the navigator.
  const [initialTab, setInitialTab] = useState<DefaultHomeTab | null>(null);

  useEffect(() => {
    getDefaultHomeTab().then(setInitialTab);
  }, []);

  if (!initialTab) return null;

  return (
    <Tabs
      initialRouteName={initialTab}
      screenOptions={{
        tabBarActiveTintColor: COLORS[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: i18n.t("tabs.goNow"),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              name={focused ? "location" : "location-outline"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: i18n.t("tabs.routeGuide"),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              name={focused ? "navigate" : "navigate-outline"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: i18n.t("tabs.notifications"),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              name={focused ? "notifications" : "notifications-outline"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: i18n.t("tabs.favorites"),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              name={focused ? "heart" : "heart-outline"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: i18n.t("tabs.settings"),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              name={focused ? "settings" : "settings-outline"}
            />
          ),
        }}
      />
      {isDev && (
        <Tabs.Screen
          name="dev"
          options={{
            title: "Dev",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                color={color}
                name={focused ? "terminal" : "terminal-outline"}
              />
            ),
          }}
        />
      )}
    </Tabs>
  );
}
