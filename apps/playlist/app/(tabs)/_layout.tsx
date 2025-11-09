import "react-native-gesture-handler";

import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MiniPlayer from "@/components/MiniPlayer";
import { PlayerProvider } from "@/contexts/PlayerContext";

export default function TabsLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PlayerProvider>
        <BottomSheetModalProvider>
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

            <MiniPlayer />
          </View>
        </BottomSheetModalProvider>
      </PlayerProvider>
    </GestureHandlerRootView>
  );
}
