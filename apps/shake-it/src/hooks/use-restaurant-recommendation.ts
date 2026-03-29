import type { KakaoRestaurant } from "@/services/kakao-api";
import type { Location } from "@/types";

import { useCallback, useEffect, useRef, useState } from "react";
import { APP_CONFIG } from "@/constants/config";
import { searchNearbyRestaurants } from "@/services/kakao-api";

const ROULETTE_INTERVAL_MS = 70;
const ROULETTE_DURATION_MS = 700;
const DEFAULT_CATEGORIES = ["한식", "중식", "일식", "양식"];

function getCategoryLabel(path: string) {
  const categories = path
    .split(">")
    .map((item) => item.trim())
    .filter(Boolean);

  return categories.at(-1) ?? "맛집";
}

type RefreshLocation = () => Promise<Location | null>;

export function useRestaurantRecommendation() {
  const [isRecommending, setIsRecommending] = useState(false);
  const [isSelectingRestaurant, setIsSelectingRestaurant] = useState(false);
  const [rouletteCategories, setRouletteCategories] =
    useState<string[]>(DEFAULT_CATEGORIES);
  const [rouletteIndex, setRouletteIndex] = useState(0);
  const [showRecommendLoadingText, setShowRecommendLoadingText] =
    useState(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(
    null,
  );
  const [recommendedRestaurant, setRecommendedRestaurant] =
    useState<KakaoRestaurant | null>(null);

  const showRecommendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const hideRecommendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const recommendShownAtRef = useRef<number | null>(null);
  const selectionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const rouletteIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  useEffect(() => {
    if (showRecommendTimerRef.current) {
      clearTimeout(showRecommendTimerRef.current);
      showRecommendTimerRef.current = null;
    }
    if (hideRecommendTimerRef.current) {
      clearTimeout(hideRecommendTimerRef.current);
      hideRecommendTimerRef.current = null;
    }

    if (isRecommending) {
      showRecommendTimerRef.current = setTimeout(() => {
        recommendShownAtRef.current = Date.now();
        setShowRecommendLoadingText(true);
      }, 180);
      return;
    }

    if (!showRecommendLoadingText) {
      return;
    }

    const elapsed = recommendShownAtRef.current
      ? Date.now() - recommendShownAtRef.current
      : 0;
    const remaining = Math.max(0, 500 - elapsed);

    hideRecommendTimerRef.current = setTimeout(() => {
      recommendShownAtRef.current = null;
      setShowRecommendLoadingText(false);
    }, remaining);
  }, [isRecommending, showRecommendLoadingText]);

  useEffect(() => {
    return () => {
      if (showRecommendTimerRef.current) {
        clearTimeout(showRecommendTimerRef.current);
      }
      if (hideRecommendTimerRef.current) {
        clearTimeout(hideRecommendTimerRef.current);
      }
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current);
      }
      if (rouletteIntervalRef.current) {
        clearInterval(rouletteIntervalRef.current);
      }
    };
  }, []);

  const clearRouletteTimers = useCallback(() => {
    if (selectionTimeoutRef.current) {
      clearTimeout(selectionTimeoutRef.current);
      selectionTimeoutRef.current = null;
    }
    if (rouletteIntervalRef.current) {
      clearInterval(rouletteIntervalRef.current);
      rouletteIntervalRef.current = null;
    }
  }, []);

  const playSelectionRoulette = useCallback(
    async (restaurants: KakaoRestaurant[], selected: KakaoRestaurant) => {
      clearRouletteTimers();
      const categories = Array.from(
        new Set(restaurants.map((item) => getCategoryLabel(item.category))),
      );
      const roulettePool =
        categories.length > 0 ? categories : DEFAULT_CATEGORIES;
      const selectedCategory = getCategoryLabel(selected.category);
      const selectedCategoryIndex = roulettePool.indexOf(selectedCategory);

      let nextIndex = Math.max(
        0,
        Math.floor(Math.random() * roulettePool.length),
      );

      setIsSelectingRestaurant(true);
      setRouletteCategories(roulettePool);
      setRouletteIndex(nextIndex);

      await new Promise<void>((resolve) => {
        rouletteIntervalRef.current = setInterval(() => {
          nextIndex = (nextIndex + 1) % roulettePool.length;
          setRouletteIndex(nextIndex);
        }, ROULETTE_INTERVAL_MS);

        selectionTimeoutRef.current = setTimeout(() => {
          clearRouletteTimers();
          if (selectedCategoryIndex >= 0) {
            setRouletteIndex(selectedCategoryIndex);
          }
          setIsSelectingRestaurant(false);
          resolve();
        }, ROULETTE_DURATION_MS);
      });
    },
    [clearRouletteTimers],
  );

  const recommendRestaurant = useCallback(
    async (
      location: Location | null,
      refreshLocation: RefreshLocation,
      radius = APP_CONFIG.DEFAULT_SEARCH_RADIUS,
    ) => {
      if (isRecommending || isSelectingRestaurant) {
        return;
      }

      setIsRecommending(true);
      setRecommendationError(null);

      try {
        const currentLocation = location ?? (await refreshLocation());
        if (!currentLocation) {
          setRecommendationError("현재 위치를 확인할 수 없습니다.");
          return;
        }

        const restaurants = await searchNearbyRestaurants(
          currentLocation.latitude,
          currentLocation.longitude,
          APP_CONFIG.SEARCH_RADIUS_OPTIONS.includes(
            radius as (typeof APP_CONFIG.SEARCH_RADIUS_OPTIONS)[number],
          )
            ? radius
            : APP_CONFIG.DEFAULT_SEARCH_RADIUS,
        );

        if (restaurants.length === 0) {
          setRecommendationError("주변에서 추천할 음식점을 찾지 못했습니다.");
          setRecommendedRestaurant(null);
          return;
        }

        const randomIndex = Math.floor(Math.random() * restaurants.length);
        const selected = restaurants[randomIndex];
        if (!selected) {
          setRecommendationError(
            "추천 결과를 선택하지 못했습니다. 다시 시도해주세요.",
          );
          setRecommendedRestaurant(null);
          return;
        }

        await playSelectionRoulette(restaurants, selected);
        setRecommendedRestaurant(selected);
      } catch {
        setRecommendationError("음식점 추천 중 오류가 발생했습니다.");
        setRecommendedRestaurant(null);
        clearRouletteTimers();
        setIsSelectingRestaurant(false);
      } finally {
        setIsRecommending(false);
      }
    },
    [
      clearRouletteTimers,
      isRecommending,
      isSelectingRestaurant,
      playSelectionRoulette,
    ],
  );

  const clearRecommendation = useCallback(() => {
    setRecommendedRestaurant(null);
  }, []);

  return {
    isRecommending,
    isSelectingRestaurant,
    rouletteCategories,
    rouletteIndex,
    showRecommendLoadingText,
    recommendationError,
    recommendedRestaurant,
    recommendRestaurant,
    clearRecommendation,
  };
}
