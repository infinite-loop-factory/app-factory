import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";

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
          title: "홈",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "검색",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={"search"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "코스 추가",
          tabBarIcon: ({ color }) => <TabBarIcon name={"add"} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "프로필",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={"person"} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
