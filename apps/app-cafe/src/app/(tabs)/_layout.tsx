import { Tabs } from "expo-router";
import { TabBarIcon } from "@/components/navigation/tab-bar-icon";
import { useThemeStore } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-translation";

export default function TabLayout() {
  const mode = useThemeStore((state) => state.mode);
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: mode === "dark" ? "#B9AEA5" : "#5E564D",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: mode === "dark" ? "#1A1614" : "#FFFFFF",
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: "transparent",
          height: 70,
          // paddingBottom: Platform.OS === "ios" ? 45 : 5,
          paddingTop: 10,
          borderTopColor: "transparent",
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          marginTop: 4,
          lineHeight: 12,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarLabelPosition: "below-icon",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("home"),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              name={focused ? "home" : "home-outline"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t("search"),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              name={focused ? "search" : "search-outline"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t("favorites"),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              name={focused ? "heart" : "heart-outline"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("profile"),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              name={focused ? "person" : "person-outline"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
