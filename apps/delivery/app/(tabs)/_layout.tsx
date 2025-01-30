import { Colors } from "@/constants/Colors";
import { useColorToken } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import { Text, View } from "react-native";

type TabScreensType = {
  name: string;
  title: string;
  icon: "home" | "search" | "heart-outline" | "person-outline" | "menu-outline";
};
export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const { background50 } = useColorToken({
    background50: true,
  });

  const tabScreens: TabScreensType[] = [
    { name: "index", title: "홈", icon: "home" },
    { name: "shopping", title: "장보기", icon: "search" },
    { name: "orderHistory", title: "주문내역", icon: "person-outline" },
    { name: "mypage", title: "마이배민", icon: "menu-outline" },
  ];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarShowLabel: false,

        tabBarStyle: {
          backgroundColor: background50,
          paddingVertical: 10,
          height: 60,
        },
        tabBarItemStyle: {
          paddingHorizontal: 30,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
      }}
    >
      {tabScreens.map(({ name, title, icon }, index) => (
        <Tabs.Screen
          key={`screen-${`${index}`}`}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color }) => (
              <View className={"mt-[-5px] flex items-center justify-center"}>
                <Ionicons name={icon} size={24} color={color} />
                <Text
                  className={
                    "flex items-center justify-center whitespace-nowrap text-center font-bold text-[12px] text-gray-400"
                  }
                >
                  {title}
                </Text>
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
