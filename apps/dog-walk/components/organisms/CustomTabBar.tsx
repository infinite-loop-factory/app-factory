import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import { Home, Plus, Search, User } from "lucide-react-native";
import { useMemo } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TabItem, { type TabDef } from "../molecules/TabItem";

export const TAB_BAR_HEIGHT = 64;

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const tabs: TabDef[] = useMemo(
    () => [
      { key: "index", label: "홈", icon: Home },
      { key: "search", label: "검색", icon: Search },
      { key: "add", label: "코스 등록", icon: Plus },
      { key: "profile", label: "내 정보", icon: User },
    ],
    [],
  );

  const containerBottom = Math.max(insets.bottom, 10);

  return (
    <View
      className="absolute right-0 bottom-0 left-0 z-50 px-4"
      pointerEvents="box-none"
      style={{ paddingBottom: containerBottom }}
    >
      <View className="w-full self-center" style={{ maxWidth: 420 }}>
        <View className="h-16 rounded-full bg-white shadow-lg">
          <View className="h-full overflow-hidden rounded-full border border-slate-200/60 bg-white/90">
            <View className="flex-1 flex-row items-center justify-around px-2">
              {tabs.map((tab) => {
                const routeIndex = state.routes.findIndex(
                  (r) => r.name === tab.key,
                );
                const isActive = routeIndex === state.index;

                const onPress = () => {
                  const route = state.routes[routeIndex];
                  if (!route) return;

                  const event = navigation.emit({
                    type: "tabPress",
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (!(isActive || event.defaultPrevented)) {
                    navigation.navigate(route.name as never);
                  }
                };

                return (
                  <TabItem
                    isActive={isActive}
                    key={tab.key}
                    onPress={onPress}
                    tab={tab}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
