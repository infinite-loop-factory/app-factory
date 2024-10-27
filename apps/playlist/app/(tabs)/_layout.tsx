import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TapsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#F2F2F2",
        headerStyle: {
          backgroundColor: "#0D0D0D",
        },
        headerShadowVisible: false,
        headerTintColor: "#FFFFFE",
        tabBarStyle: {
          backgroundColor: "#0D0D0D",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Playlist",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={23}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          headerTitle: "Search",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              color={color}
              size={23}
            />
          ),
        }}
      />
      <Tabs.Screen name="+not-found" options={{}} />
    </Tabs>
  );
}
