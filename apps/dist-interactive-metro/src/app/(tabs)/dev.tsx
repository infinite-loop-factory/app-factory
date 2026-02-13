import type { SyncStatus } from "@/types/sync-status";

import { useRouter } from "expo-router";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Database,
  Loader2,
  RefreshCw,
} from "lucide-react-native";
import { useCallback, useEffect, useRef } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSyncStatus } from "@/context/sync-status-context";

const DB_ENTITIES = [
  {
    key: "lines",
    label: "Lines (노선)",
    schema: "id, name, nameEn, color, stations[]",
    description: "Subway line info",
  },
  {
    key: "stations",
    label: "Stations (역)",
    schema: "id, name, nameEn, lineIds[], stationNumber, coordinates?",
    description: "Station info",
  },
  {
    key: "distances",
    label: "Distances (역간 거리)",
    schema: "fromStationId, toStationId, distance, lineId",
    description: "Inter-station distance (meters)",
  },
  {
    key: "transfers",
    label: "Transfers (환승)",
    schema: "stationId, fromLineId, toLineId, transferDistance, transferTime?",
    description: "Transfer path info",
  },
] as const;

const contentContainerStyle = {
  paddingHorizontal: 24,
  paddingTop: 24,
  paddingBottom: 32,
} as const;

function formatTimestamp(ms: number | null): string {
  if (ms == null) return "—";
  const d = new Date(ms);
  return d.toLocaleString("ko-KR", {
    dateStyle: "short",
    timeStyle: "medium",
  });
}

function StatusBadge({ status }: { status: SyncStatus }) {
  const config = {
    idle: { label: "Idle", color: "text-outline-500", Icon: Clock },
    syncing: { label: "Syncing…", color: "text-primary-500", Icon: Loader2 },
    success: { label: "Success", color: "text-green-600", Icon: CheckCircle2 },
    error: { label: "Error", color: "text-red-600", Icon: AlertCircle },
  };
  const { label, color, Icon } = config[status];
  return (
    <View className="flex-row items-center gap-1.5">
      {status === "syncing" ? (
        <Loader2 className="text-primary-500" size={16} />
      ) : (
        <Icon className={color} size={16} />
      )}
      <Text className={`font-medium text-sm ${color}`}>{label}</Text>
    </View>
  );
}

const isDev = typeof __DEV__ !== "undefined" && __DEV__;

export default function DevScreen() {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!isDev) {
      router.replace("/(tabs)");
    }
  }, [router]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const {
    status,
    lastSyncTimestamp,
    lastSyncError,
    items,
    setSyncStatus,
    setLastSync,
    resetSyncState,
  } = useSyncStatus();

  const handleSimulateSync = useCallback(() => {
    setSyncStatus("syncing");
    timerRef.current = setTimeout(() => {
      setLastSync(Date.now(), {
        lines: 18,
        stations: 600,
        distances: 12000,
        transfers: 200,
      });
    }, 1500);
  }, [setSyncStatus, setLastSync]);

  const handleSimulateError = useCallback(() => {
    setSyncStatus("syncing");
    timerRef.current = setTimeout(() => {
      setLastSync(Date.now(), items, "Network error (simulated)");
    }, 1000);
  }, [setSyncStatus, setLastSync, items]);

  if (!isDev) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-background-0" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6 flex-row items-center gap-2">
          <Database className="text-outline-600" size={24} />
          <Text className="font-semibold text-typography-900 text-xl">
            Developer Mode
          </Text>
        </View>

        {/* DB visualization */}
        <Text className="mb-3 font-semibold text-outline-600 text-sm uppercase tracking-wide">
          Database entities
        </Text>
        <View className="mb-8 gap-3">
          {DB_ENTITIES.map((entity) => (
            <View
              className="rounded-xl border border-outline-200 bg-background-50 p-4"
              key={entity.key}
            >
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="font-medium text-typography-900">
                  {entity.label}
                </Text>
                <Text className="font-medium text-outline-600 text-sm">
                  {items[entity.key]} items
                </Text>
              </View>
              <Text className="mb-1 font-mono text-outline-500 text-xs">
                {entity.schema}
              </Text>
              <Text className="text-outline-400 text-xs">
                {entity.description}
              </Text>
            </View>
          ))}
        </View>

        {/* Sync status */}
        <Text className="mb-3 font-semibold text-outline-600 text-sm uppercase tracking-wide">
          Sync status (API → local)
        </Text>
        <View className="mb-6 rounded-xl border border-outline-200 bg-background-0 p-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="font-medium text-typography-900">Status</Text>
            <StatusBadge status={status} />
          </View>
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-outline-600 text-sm">Last sync</Text>
            <Text className="font-mono text-sm text-typography-800">
              {formatTimestamp(lastSyncTimestamp)}
            </Text>
          </View>
          {lastSyncError ? (
            <View className="mt-2 rounded-lg bg-red-50 p-2">
              <Text className="text-red-700 text-xs">{lastSyncError}</Text>
            </View>
          ) : null}
          <View className="mt-4 border-outline-100 border-t pt-4">
            <Text className="mb-2 font-medium text-outline-500 text-xs">
              Synced items
            </Text>
            <View className="gap-1.5">
              {DB_ENTITIES.map((entity) => (
                <View
                  className="flex-row items-center justify-between"
                  key={entity.key}
                >
                  <Text className="text-sm text-typography-700">
                    {entity.label}
                  </Text>
                  <Text className="font-mono text-sm text-typography-900">
                    {items[entity.key]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Dev actions */}
        <View className="gap-3">
          <Text className="mb-1 font-medium text-outline-500 text-xs">
            Actions (dev only)
          </Text>
          <Pressable
            accessibilityLabel="Simulate successful sync"
            accessibilityRole="button"
            accessibilityState={{ disabled: status === "syncing" }}
            className="flex-row items-center justify-center gap-2 rounded-xl border border-outline-200 bg-background-0 py-3"
            disabled={status === "syncing"}
            onPress={handleSimulateSync}
          >
            <RefreshCw className="text-typography-700" size={18} />
            <Text className="font-medium text-typography-900">
              Simulate successful sync
            </Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Simulate sync error"
            accessibilityRole="button"
            accessibilityState={{ disabled: status === "syncing" }}
            className="flex-row items-center justify-center gap-2 rounded-xl border border-outline-200 bg-background-0 py-3"
            disabled={status === "syncing"}
            onPress={handleSimulateError}
          >
            <AlertCircle className="text-red-600" size={18} />
            <Text className="font-medium text-typography-900">
              Simulate sync error
            </Text>
          </Pressable>
          <Pressable
            accessibilityLabel="Reset sync state"
            accessibilityRole="button"
            className="flex-row items-center justify-center gap-2 rounded-xl border border-outline-200 border-dashed bg-background-50 py-3"
            onPress={resetSyncState}
          >
            <Text className="font-medium text-outline-600">
              Reset sync state
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
