import "../global.css";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "nativewind";
import { useEffect, useRef } from "react";
import { AppState, View } from "react-native";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { UpdateBanner } from "@/components/update-banner";
import { RouteSearchProvider } from "@/context/route-search-context";
import {
  SyncStatusProvider,
  useSyncStatus,
} from "@/context/sync-status-context";
import {
  UpdateBannerProvider,
  useUpdateBanner,
} from "@/context/update-banner-context";
import {
  checkAndRefreshData,
  syncKricStations,
} from "@/data/kric-station-sync";
import { getAllStations } from "@/data/station-store";
import { lines as metroLines } from "@/data/stations";
import "@/i18n";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const hiddenHeaderOptions = { headerShown: false } as const;

/** Triggers the KRIC station sync once on mount.
 *  On failure the app continues with the static-only station bundle —
 *  all core routes remain functional, only dynamic lines (6, 8, etc.)
 *  will be missing until the next successful sync.
 */
function KricSyncTrigger() {
  const { setSyncStatus, setLastSync } = useSyncStatus();
  const hasSynced = useRef(false);

  useEffect(() => {
    if (hasSynced.current) return;
    hasSynced.current = true;

    setSyncStatus("syncing");
    syncKricStations()
      .then((result) => {
        setLastSync(Date.now(), {
          lines: metroLines.length,
          stations: getAllStations().length,
          routes: result.routeEntries,
          transfers: result.codeMapEntries,
        });
      })
      .catch((err: unknown) => {
        // Fallback: static-only mode — dynamic lines unavailable until next sync
        setLastSync(
          Date.now(),
          { lines: 0, stations: 0, routes: 0, transfers: 0 },
          err instanceof Error ? err.message : "Sync failed",
        );
      });
  }, [setSyncStatus, setLastSync]);

  return null;
}

const REFRESH_COOLDOWN_MS = 30 * 60 * 1000; // 30분

/** Listens for app foreground events and refreshes KRIC data if it changed. */
function DataRefreshTrigger() {
  const { showBanner } = useUpdateBanner();
  const { setLastSync } = useSyncStatus();
  const prevAppState = useRef<string>("active");
  const lastRefreshAt = useRef<number>(0);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState) => {
      const comingToForeground =
        prevAppState.current !== "active" && nextState === "active";
      prevAppState.current = nextState;
      if (!comingToForeground) return;

      // 마지막 체크로부터 30분이 지나지 않았으면 스킵
      const now = Date.now();
      if (now - lastRefreshAt.current < REFRESH_COOLDOWN_MS) return;
      lastRefreshAt.current = now;

      checkAndRefreshData()
        .then((result) => {
          if (!result.updated) return;
          setLastSync(Date.now(), {
            lines: metroLines.length,
            stations: getAllStations().length,
            routes: result.routes,
            transfers: result.transfers,
          });
          showBanner(
            `역 데이터 업데이트됨 · ${result.transfers}개 역 코드`,
            "success",
          );
        })
        .catch(() => {
          // silent — background refresh failures are non-critical
        });
    });

    return () => sub.remove();
  }, [showBanner, setLastSync]);

  return null;
}

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GluestackUIProvider mode={colorScheme ?? "light"}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <RouteSearchProvider>
          <SyncStatusProvider>
            <UpdateBannerProvider>
              <KricSyncTrigger />
              <DataRefreshTrigger />
              <View style={{ flex: 1 }}>
                <Stack>
                  <Stack.Screen name="(tabs)" options={hiddenHeaderOptions} />
                  <Stack.Screen
                    name="route-result"
                    options={hiddenHeaderOptions}
                  />
                  <Stack.Screen
                    name="departure-select"
                    options={hiddenHeaderOptions}
                  />
                  <Stack.Screen
                    name="station-select"
                    options={hiddenHeaderOptions}
                  />
                  <Stack.Screen
                    name="notification-settings"
                    options={hiddenHeaderOptions}
                  />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <UpdateBanner />
              </View>
            </UpdateBannerProvider>
          </SyncStatusProvider>
        </RouteSearchProvider>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
