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
          title: i18n.t("tabs.home"),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              color={color}
              name={focused ? "home" : "home-outline"}
            />
          ),
        }}
      />
      {/* 지도 / 페어링 / 마이 탭은 각각 Phase 2 / 3 / 4 에서 추가. */}
    </Tabs>
  );
}
