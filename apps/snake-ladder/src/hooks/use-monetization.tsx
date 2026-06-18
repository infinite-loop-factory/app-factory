import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { prepareE2EStorage } from "@/lib/e2e-storage";
import {
  afterInterstitialShown,
  afterNewGameStarted,
  shouldShowInterstitial as computeShouldShowAd,
} from "@/lib/monetization/ads-policy";
import {
  DEFAULT_MONETIZATION,
  type MonetizationState,
  parseMonetization,
} from "@/lib/monetization/state";
import { STORAGE_KEYS } from "@/lib/storage-keys";

type MonetizationContextValue = {
  monetization: MonetizationState;
  addGoldDice: (count: number) => void;
  consumeGoldDice: (count?: number) => boolean;
  setAdRemovalPurchased: (purchased: boolean) => void;
  notifyNewGameStarted: () => void;
  notifyInterstitialShown: () => void;
  shouldShowInterstitial: () => boolean;
};

const MonetizationContext = createContext<MonetizationContextValue | null>(
  null,
);

export function MonetizationProvider({ children }: { children: ReactNode }) {
  const [monetization, setMonetization] =
    useState<MonetizationState>(DEFAULT_MONETIZATION);

  const updateMonetization = useCallback(
    (updater: (prev: MonetizationState) => MonetizationState) => {
      setMonetization((prev) => {
        const next = updater(prev);
        void AsyncStorage.setItem(
          STORAGE_KEYS.monetization,
          JSON.stringify(next),
        );
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    void (async () => {
      await prepareE2EStorage();
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.monetization);
      setMonetization(parseMonetization(raw));
    })();
  }, []);

  const addGoldDice = useCallback(
    (count: number) => {
      if (count <= 0) return;
      updateMonetization((prev) => ({
        ...prev,
        goldDiceCount: prev.goldDiceCount + count,
      }));
    },
    [updateMonetization],
  );

  const consumeGoldDice = useCallback(
    (count = 1) => {
      let consumed = false;
      updateMonetization((prev) => {
        if (prev.goldDiceCount < count) return prev;
        consumed = true;
        return {
          ...prev,
          goldDiceCount: prev.goldDiceCount - count,
        };
      });
      return consumed;
    },
    [updateMonetization],
  );

  const setAdRemovalPurchased = useCallback(
    (purchased: boolean) => {
      updateMonetization((prev) => ({
        ...prev,
        adRemovalPurchased: purchased,
      }));
    },
    [updateMonetization],
  );

  const sessionGamesRef = useRef(0);

  const notifyNewGameStarted = useCallback(() => {
    sessionGamesRef.current += 1;
    updateMonetization((prev) => afterNewGameStarted(prev));
  }, [updateMonetization]);

  const notifyInterstitialShown = useCallback(() => {
    updateMonetization((prev) => afterInterstitialShown(prev));
  }, [updateMonetization]);

  const shouldShowInterstitial = useCallback(
    () => computeShouldShowAd(monetization, sessionGamesRef.current),
    [monetization],
  );

  const value = useMemo(
    () => ({
      monetization,
      addGoldDice,
      consumeGoldDice,
      setAdRemovalPurchased,
      notifyNewGameStarted,
      notifyInterstitialShown,
      shouldShowInterstitial,
    }),
    [
      addGoldDice,
      consumeGoldDice,
      monetization,
      notifyInterstitialShown,
      notifyNewGameStarted,
      setAdRemovalPurchased,
      shouldShowInterstitial,
    ],
  );

  return (
    <MonetizationContext.Provider value={value}>
      {children}
    </MonetizationContext.Provider>
  );
}

export function useMonetization(): MonetizationContextValue {
  const ctx = useContext(MonetizationContext);
  if (!ctx) {
    throw new Error("useMonetization must be used within MonetizationProvider");
  }
  return ctx;
}
