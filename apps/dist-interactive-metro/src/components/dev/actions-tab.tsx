import Constants from "expo-constants";
import { AlertCircle, Bell, RefreshCw } from "lucide-react-native";
import { useCallback, useEffect, useRef } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSyncStatus } from "@/context/sync-status-context";
import { useUpdateBanner } from "@/context/update-banner-context";

const SCROLL_CONTENT = {
  paddingHorizontal: 20,
  paddingTop: 16,
  paddingBottom: 40,
} as const;
const SECTION_LABEL =
  "mb-2 text-xs font-semibold uppercase tracking-widest text-outline-400";

interface ExpoConfigExtra {
  env?: string;
}

export function ActionsTab() {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { status, items, setSyncStatus, setLastSync, resetSyncState } =
    useSyncStatus();
  const { showBanner } = useUpdateBanner();

  useEffect(() => {
    return () => {
      if (timerRef.current !== undefined) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleSimulateError = useCallback(() => {
    setSyncStatus("syncing");
    timerRef.current = setTimeout(() => {
      setLastSync(Date.now(), items, "Network error (simulated)");
    }, 1000);
  }, [setSyncStatus, setLastSync, items]);

  const handleTestBanner = useCallback(() => {
    showBanner("배너 테스트 · 4.5초 후 자동 닫힘", "info");
  }, [showBanner]);

  const appVersion = Constants.expoConfig?.version ?? "—";
  const buildNumber =
    Constants.expoConfig?.ios?.buildNumber ??
    Constants.expoConfig?.android?.versionCode?.toString() ??
    "—";
  const envName =
    (Constants.expoConfig?.extra as ExpoConfigExtra | undefined)?.env ??
    "development";

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={SCROLL_CONTENT}
      showsVerticalScrollIndicator={false}
    >
      <Text className={SECTION_LABEL}>Sync</Text>
      <View className="mb-5 gap-3">
        <Pressable
          accessibilityLabel="Force full sync"
          accessibilityRole="button"
          accessibilityState={{ disabled: status === "syncing" }}
          className={`flex-row items-center justify-center gap-3 rounded-xl border border-primary-200 bg-primary-50 py-4 ${
            status === "syncing" ? "opacity-50" : "active:bg-primary-100"
          }`}
          disabled={status === "syncing"}
          onPress={() => {
            showBanner("Overview 탭에서 Force Sync를 실행하세요.", "info");
          }}
        >
          <RefreshCw className="text-primary-600" size={18} />
          <Text className="font-semibold text-primary-700 text-sm">
            Force Full Sync
          </Text>
        </Pressable>

        <Pressable
          accessibilityLabel="Simulate sync error"
          accessibilityRole="button"
          accessibilityState={{ disabled: status === "syncing" }}
          className={`flex-row items-center justify-center gap-3 rounded-xl border border-outline-200 bg-background-0 py-4 ${
            status === "syncing" ? "opacity-50" : "active:bg-background-50"
          }`}
          disabled={status === "syncing"}
          onPress={handleSimulateError}
        >
          <AlertCircle className="text-red-500" size={18} />
          <Text className="font-semibold text-red-600 text-sm">
            Simulate Sync Error
          </Text>
        </Pressable>

        <Pressable
          accessibilityLabel="Reset sync state"
          accessibilityRole="button"
          className="flex-row items-center justify-center gap-3 rounded-xl border border-outline-200 border-dashed bg-background-50 py-4 active:bg-background-100"
          onPress={resetSyncState}
        >
          <Text className="font-medium text-outline-500 text-sm">
            Reset Sync State
          </Text>
        </Pressable>
      </View>

      <Text className={SECTION_LABEL}>UI</Text>
      <View className="mb-5">
        <Pressable
          accessibilityLabel="Test update banner"
          accessibilityRole="button"
          className="flex-row items-center justify-center gap-3 rounded-xl border border-outline-200 bg-background-0 py-4 active:bg-background-50"
          onPress={handleTestBanner}
        >
          <Bell className="text-typography-700" size={18} />
          <Text className="font-semibold text-sm text-typography-900">
            Test Update Banner
          </Text>
        </Pressable>
      </View>

      <Text className={SECTION_LABEL}>앱 정보</Text>
      <View className="overflow-hidden rounded-xl border border-outline-200 bg-background-0">
        <View className="flex-row items-center justify-between border-outline-100 border-b px-4 py-3.5">
          <Text className="text-outline-600 text-sm">Version</Text>
          <Text className="font-mono text-sm text-typography-800">
            {appVersion} ({buildNumber})
          </Text>
        </View>
        <View className="flex-row items-center justify-between px-4 py-3.5">
          <Text className="text-outline-600 text-sm">Environment</Text>
          <Text className="font-mono font-semibold text-primary-600 text-sm">
            {envName}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
