import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { APP_CONFIG, STORAGE_KEYS } from "@/constants/config";
import { formatSearchRadius } from "@/utils/search-radius";

function normalizeSearchRadius(value: unknown) {
  return APP_CONFIG.SEARCH_RADIUS_OPTIONS.includes(
    value as (typeof APP_CONFIG.SEARCH_RADIUS_OPTIONS)[number],
  )
    ? (value as number)
    : APP_CONFIG.DEFAULT_SEARCH_RADIUS;
}

export function useSearchRadius() {
  const [radius, setRadiusState] = useState<number>(
    APP_CONFIG.DEFAULT_SEARCH_RADIUS,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadRadius() {
      try {
        const storedValue = await AsyncStorage.getItem(
          STORAGE_KEYS.SEARCH_RADIUS,
        );
        if (!(isMounted && storedValue)) {
          return;
        }

        const parsedValue = Number.parseInt(storedValue, 10);
        setRadiusState(normalizeSearchRadius(parsedValue));
      } catch (error) {
        console.error("Failed to load search radius:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRadius();

    return () => {
      isMounted = false;
    };
  }, []);

  const setRadius = useCallback(async (nextRadius: number) => {
    const normalizedRadius = normalizeSearchRadius(nextRadius);

    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SEARCH_RADIUS,
        normalizedRadius.toString(),
      );
      setRadiusState(normalizedRadius);
    } catch (error) {
      console.error("Failed to save search radius:", error);
    }
  }, []);

  return {
    formatSearchRadius,
    radius,
    isLoading,
    setRadius,
  };
}
