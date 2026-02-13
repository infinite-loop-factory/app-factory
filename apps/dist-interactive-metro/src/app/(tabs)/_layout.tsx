import { Tabs, useRouter, useSegments } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useRef } from "react";
import { TabBarIcon } from "@/components/navigation/tab-bar-icon";
import { COLORS } from "@/constants/colors";
import i18n from "@/i18n";
import { DEFAULT_HOME_TAB_ROUTES, getDefaultHomeTab } from "@/lib/default-home";

const isDev = typeof __DEV__ !== "undefined" && __DEV__;

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const initialRedirectDone = useRef(false);

  useEffect(() => {
    if (initialRedirectDone.current) return;
    const tabSegment = (segments as string[])[1];
    if (tabSegment !== "index") return;
    getDefaultHomeTab().then((defaultId) => {
      if (defaultId === "routeGuide") return;
      initialRedirectDone.current = true;
      const path = DEFAULT_HOME_TAB_ROUTES[defaultId];
      router.replace(path as Parameters<typeof router.replace>[0]);
    });
  }, [segments, router]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
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
