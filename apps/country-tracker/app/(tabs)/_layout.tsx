import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import i18n from "@/i18n";

const HomeTabBarIcon = ({
  color,
  focused,
}: { color: string; focused: boolean }) => (
  <TabBarIcon name={focused ? "home" : "home-outline"} color={color} />
);

const ExploreTabBarIcon = ({
  color,
  focused,
}: { color: string; focused: boolean }) => (
  <TabBarIcon
    name={focused ? "code-slash" : "code-slash-outline"}
    color={color}
  />
);

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: i18n.t("home"),
          tabBarIcon: HomeTabBarIcon,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ExploreTabBarIcon,
        }}
      />
    </Tabs>
  );
}
