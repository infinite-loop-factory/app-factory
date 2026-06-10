import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDebounceFn } from "ahooks";
import { useColorScheme } from "nativewind";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CRAFT_DARK,
  CRAFT_LIGHT,
  type CraftPalette,
} from "@/game/constants/palettes";
import { prepareE2EStorage } from "@/lib/e2e-storage";
import {
  type AppSettings,
  DEFAULT_SETTINGS,
  parseSettings,
  type ResolvedTimings,
  resolveTimings,
} from "@/lib/settings";
import { DEFAULT_STATS, type GameStats, parseStats } from "@/lib/stats";
import { STORAGE_KEYS } from "@/lib/storage-keys";

type AppSettingsContextValue = {
  settings: AppSettings;
  stats: GameStats;
  timings: ResolvedTimings;
  palette: CraftPalette;
  onboardingComplete: boolean;
  loaded: boolean;
  updateSettings: (patch: Partial<AppSettings>) => void;
  recordGameResult: (won: boolean) => void;
  resetStats: () => void;
  completeOnboarding: () => void;
};

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme().colorScheme;
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void (async () => {
      await prepareE2EStorage();
      const [settingsRaw, statsRaw, onboardingRaw] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.settings),
        AsyncStorage.getItem(STORAGE_KEYS.stats),
        AsyncStorage.getItem(STORAGE_KEYS.onboardingComplete),
      ]);
      setSettings(parseSettings(settingsRaw));
      setStats(parseStats(statsRaw));
      setOnboardingComplete(onboardingRaw === "true");
      setLoaded(true);
    })();
  }, []);

  // Persist at most ~twice a second — nickname typing writes every keystroke
  // otherwise. State updates stay synchronous; only the disk write debounces.
  const { run: persistSettings } = useDebounceFn(
    (next: AppSettings) => {
      void AsyncStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(next));
    },
    { wait: 400 },
  );

  const updateSettings = useCallback(
    (patch: Partial<AppSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        persistSettings(next);
        return next;
      });
    },
    [persistSettings],
  );

  const recordGameResult = useCallback((won: boolean) => {
    setStats((prev) => {
      const next: GameStats = {
        gamesPlayed: prev.gamesPlayed + 1,
        wins: prev.wins + (won ? 1 : 0),
        losses: prev.losses + (won ? 0 : 1),
      };
      void AsyncStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(next));
      return next;
    });
  }, []);

  const resetStats = useCallback(() => {
    setStats(DEFAULT_STATS);
    void AsyncStorage.setItem(
      STORAGE_KEYS.stats,
      JSON.stringify(DEFAULT_STATS),
    );
  }, []);

  const completeOnboarding = useCallback(() => {
    setOnboardingComplete(true);
    void AsyncStorage.setItem(STORAGE_KEYS.onboardingComplete, "true");
  }, []);

  const palette = useMemo(() => {
    const mode =
      settings.theme === "system" ? (systemScheme ?? "light") : settings.theme;
    return mode === "dark" ? CRAFT_DARK : CRAFT_LIGHT;
  }, [settings.theme, systemScheme]);

  const timings = useMemo(() => resolveTimings(settings), [settings]);

  const value = useMemo(
    () => ({
      settings,
      stats,
      timings,
      palette,
      onboardingComplete,
      loaded,
      updateSettings,
      recordGameResult,
      resetStats,
      completeOnboarding,
    }),
    [
      settings,
      stats,
      timings,
      palette,
      onboardingComplete,
      loaded,
      updateSettings,
      recordGameResult,
      resetStats,
      completeOnboarding,
    ],
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings(): AppSettingsContextValue {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) {
    throw new Error("useAppSettings must be used within AppSettingsProvider");
  }
  return ctx;
}
