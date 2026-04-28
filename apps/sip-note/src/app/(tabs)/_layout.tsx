import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import { TabBarIcon } from "@/components/navigation/tab-bar-icon";
import { COLORS } from "@/constants/colors";
import i18n from "@/i18n";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

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
          title: i18n.t("home"),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              name={focused ? "home" : "home-outline"}
            />
          ),
        }}
      />
      {/* Phase 1 에서는 기록 탭만 노출. 다른 탭은 해당 Phase 에서 추가. */}
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
