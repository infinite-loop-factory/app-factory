import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import CustomTabBar from "@/components/organisms/CustomTabBar";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor:
          Colors[colorScheme ?? "light"]["--color-primary-0"],
        headerShown: false,
        sceneStyle: { backgroundColor: "white" },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
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
          title: "검색",
          tabBarIcon: ({ color }) => (
            <TabBarIcon color={color} name={"search"} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "코스 추가",
          tabBarIcon: ({ color }) => <TabBarIcon color={color} name={"add"} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "프로필",
          tabBarIcon: ({ color }) => (
            <TabBarIcon color={color} name={"person"} />
          ),
        }}
      />
    </Tabs>
  );
}
