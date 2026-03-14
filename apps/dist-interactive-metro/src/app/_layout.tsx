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
import { useEffect } from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { RouteSearchProvider } from "@/context/route-search-context";
import {
  SyncStatusProvider,
  useSyncStatus,
} from "@/context/sync-status-context";
import { syncKricStations } from "@/data/kric-station-sync";
import "@/i18n";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const hiddenHeaderOptions = { headerShown: false } as const;

/** Triggers the KRIC station sync once fonts are loaded. */
function KricSyncTrigger() {
  const { setSyncStatus, setLastSync } = useSyncStatus();

  useEffect(() => {
    setSyncStatus("syncing");
    syncKricStations()
      .then((result) => {
        setLastSync(Date.now(), {
          lines: result.linesSucceeded,
          stations: result.dynamicStationsAdded,
          distances: 0,
          transfers: result.codeMapEntries,
        });
      })
      .catch((err: unknown) => {
        setLastSync(
          Date.now(),
          { lines: 0, stations: 0, distances: 0, transfers: 0 },
          err instanceof Error ? err.message : "Sync failed",
        );
      });
    // Run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setLastSync, setSyncStatus]);

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
            <KricSyncTrigger />
            <Stack>
              <Stack.Screen name="(tabs)" options={hiddenHeaderOptions} />
              <Stack.Screen name="route-result" options={hiddenHeaderOptions} />
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
          </SyncStatusProvider>
        </RouteSearchProvider>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
