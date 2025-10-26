import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MiniPlayer from "@/components/MiniPlayer";
import { PlayerProvider } from "@/contexts/PlayerContext";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <PlayerProvider>
      <View style={{ flex: 1 }}>
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
              tabBarLabel: "Home",
              headerTitle: "Playlist",
              tabBarIcon: ({ focused, color }) => (
                <Ionicons
                  color={color}
                  name={focused ? "home-sharp" : "home-outline"}
                  size={23}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="search"
            options={{
              tabBarLabel: "Search",
              headerTitle: "Search",
              tabBarIcon: ({ focused, color }) => (
                <Ionicons
                  color={color}
                  name={focused ? "search" : "search-outline"}
                  size={23}
                />
              ),
            }}
          />
        </Tabs>
        <View
          style={{
            bottom: insets.bottom + 55,
            left: 0,
            right: 0,
          }}
        >
          <MiniPlayer />
        </View>
      </View>
    </PlayerProvider>
  );
}
