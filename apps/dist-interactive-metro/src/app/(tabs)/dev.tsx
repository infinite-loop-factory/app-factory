import type { DevTab } from "@/components/dev/pill-tab-bar";

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActionsTab } from "@/components/dev/actions-tab";
import { ApiInspector } from "@/components/dev/api-inspector";
import { DatabaseTab } from "@/components/dev/database-tab";
import { OverviewTab } from "@/components/dev/overview-tab";
import { PillTabBar } from "@/components/dev/pill-tab-bar";

const isDev = typeof __DEV__ !== "undefined" && __DEV__;

export default function DevScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DevTab>("overview");

  useEffect(() => {
    if (!isDev) router.replace("/(tabs)");
  }, [router]);

  if (!isDev) return null;

  return (
    <SafeAreaView className="flex-1 bg-background-50" edges={["top"]}>
      {/* Header */}
      <View className="border-outline-100 border-b bg-background-0 px-4 pt-3 pb-0">
        <Text className="mb-2 font-bold text-2xl text-typography-900">
          Developer Mode
        </Text>
        <PillTabBar active={activeTab} onChange={setActiveTab} />
      </View>

      {/* Tab content */}
      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "database" && <DatabaseTab />}
      {activeTab === "api" && <ApiInspector />}
      {activeTab === "actions" && <ActionsTab />}
    </SafeAreaView>
  );
}
