import type { KakaoRestaurant } from "@/services/kakao-api";

import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing, Linking, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RestaurantResultModal } from "@/components/restaurant-result-modal";
import { useLocation } from "@/hooks/use-location";
import { searchNearbyRestaurants } from "@/services/kakao-api";

const C = {
  primary: "#3d6bf5",
  primaryDark: "#254db5",
  surface: "#F2F4F6",
  textMain: "#191F28",
  textSub: "#8B95A1",
};

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

function useShakeAnimation() {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(rotation, {
          toValue: 2,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: -2,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: 0,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(750),
      ]),
    );

    animation.start();
    return () => {
      animation.stop();
    };
  }, [rotation]);

  return {
    transform: [
      {
        rotate: rotation.interpolate({
          inputRange: [-2, 0, 2],
          outputRange: ["-2deg", "0deg", "2deg"],
        }),
      },
    ],
  };
}

function useBounceAnimation() {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -10,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.in(Easing.bounce),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => {
      animation.stop();
    };
  }, [translateY]);

  return { transform: [{ translateY }] };
}

function usePulseAnimation() {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => {
      animation.stop();
    };
  }, [opacity]);

  return { opacity };
}

function useRippleAnimation() {
  const scale = useRef(new Animated.Value(1.1)).current;
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.4,
            duration: 3000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 3000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    animation.start();
    return () => {
      animation.stop();
    };
  }, [scale, opacity]);

  return { transform: [{ scale }], opacity };
}

/** Motion lines decorating the phone illustration */
const MotionLines = memo(function MotionLines({
  side,
}: {
  side: "left" | "right";
}) {
  const isLeft = side === "left";
  const position = isLeft ? { top: 40, left: -24 } : { bottom: 40, right: -24 };

  return (
    <View
      className="absolute gap-2"
      style={{
        ...position,
        alignItems: isLeft ? "flex-start" : "flex-end",
        transform: [{ rotate: "-12deg" }],
      }}
    >
      <View
        className="h-1 w-4 rounded-full"
        style={{ backgroundColor: `${C.primary}66` }}
      />
      <View
        className="h-1 w-6 rounded-full"
        style={{ backgroundColor: `${C.primary}99` }}
      />
      <View
        className="h-1 w-3 rounded-full"
        style={{ backgroundColor: `${C.primary}4D` }}
      />
    </View>
  );
});

/** The phone illustration at the center of the screen */
const PhoneIllustration = memo(function PhoneIllustration() {
  const shakeStyle = useShakeAnimation();
  const bounceStyle = useBounceAnimation();

  return (
    <Animated.View style={shakeStyle}>
      <LinearGradient
        colors={[C.primary, C.primaryDark]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={{
          width: 96,
          height: 192,
          borderRadius: 24,
          alignItems: "center",
          justifyContent: "space-between",
          overflow: "hidden",
          borderWidth: 4,
          borderColor: "white",
          shadowColor: C.primary,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 10,
        }}
      >
        {/* Glare overlay */}
        <View
          className="absolute top-0 right-0 h-full w-full"
          style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        />

        {/* Notch */}
        <View
          className="mt-1 h-4 w-12 rounded-full"
          style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
        />

        {/* Screen content */}
        <View className="w-full flex-1 items-center justify-center gap-2">
          <Animated.View style={bounceStyle}>
            <MaterialIcons color="white" name="lunch-dining" size={36} />
          </Animated.View>
          <View
            className="h-1.5 w-12 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
          />
          <View
            className="h-1.5 w-8 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          />
        </View>

        {/* Home indicator */}
        <View
          className="mb-1 h-1 w-10 rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
        />
      </LinearGradient>

      <MotionLines side="left" />
      <MotionLines side="right" />
    </Animated.View>
  );
});

export default function HomeScreen() {
  const pulseStyle = usePulseAnimation();
  const rippleStyle = useRippleAnimation();
  const { address, location, refreshLocation } = useLocation();
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
    refreshLocation();
  }, [refreshLocation]);

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

  const handleRecommendRestaurant = useCallback(async () => {
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
  }, [
    clearRouletteTimers,
    isRecommending,
    isSelectingRestaurant,
    location,
    playSelectionRoulette,
    refreshLocation,
  ]);

  const handleCloseRecommendation = useCallback(() => {
    setRecommendedRestaurant(null);
  }, []);

  const handleOpenMap = useCallback(async () => {
    if (!recommendedRestaurant?.placeUrl) {
      return;
    }

    const supported = await Linking.canOpenURL(recommendedRestaurant.placeUrl);
    if (!supported) {
      setRecommendationError("지도를 열 수 없습니다.");
      return;
    }

    await Linking.openURL(recommendedRestaurant.placeUrl);
  }, [recommendedRestaurant]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* ── Header ── */}
      <View className="flex-row items-center justify-between px-5 pb-4">
        {/* Location selector */}
        <Pressable className="flex-row items-center gap-1.5">
          <Text
            className="font-bold text-xl"
            style={{ color: C.textMain, letterSpacing: -0.5 }}
          >
            {address || "위치 확인 중..."}
          </Text>
          <MaterialIcons
            color={C.textMain}
            name="keyboard-arrow-down"
            size={24}
          />
        </Pressable>

        {/* Profile icon */}
        <Pressable
          className="relative h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: C.surface }}
        >
          <MaterialIcons color={C.textMain} name="person" size={24} />
          {/* Notification dot */}
          <View
            className="absolute h-2 w-2 rounded-full"
            style={{
              top: 8,
              right: 8,
              backgroundColor: "#ef4444",
              borderWidth: 2,
              borderColor: C.surface,
            }}
          />
        </Pressable>
      </View>

      {/* ── Main Content ── */}
      <View className="flex-1 items-center justify-center px-6">
        {/* Background blobs */}
        <Animated.View
          className="absolute h-64 w-64 rounded-full"
          style={[
            {
              top: "20%",
              left: "5%",
              backgroundColor: `${C.primary}18`,
            },
            pulseStyle,
          ]}
        />
        <View
          className="absolute h-48 w-48 rounded-full"
          style={{
            bottom: "28%",
            right: "5%",
            backgroundColor: `${C.primary}10`,
          }}
        />

        {/* Title */}
        <View className="mb-12 items-center">
          <Text
            className="text-center font-extrabold text-3xl"
            style={{ color: C.textMain, letterSpacing: -0.5, lineHeight: 42 }}
          >
            오늘의 점심 운명,{"\n"}
            <Text style={{ color: C.primary }}>흔들어서</Text> 결정하세요!
          </Text>
          <Text
            className="mt-3 font-medium text-base"
            style={{ color: C.textSub }}
          >
            폰을 가볍게 흔들면 맛집을 찾아드려요
          </Text>
        </View>

        {/* Phone container with ripple rings */}
        <View className="relative mb-8 h-[280px] w-[280px] items-center justify-center">
          {/* Animated ripple ring */}
          <Animated.View
            className="absolute h-[260px] w-[260px] rounded-full"
            style={[
              { borderWidth: 1, borderColor: `${C.primary}30` },
              rippleStyle,
            ]}
          />
          {/* Static outer ring */}
          <View
            className="absolute h-[320px] w-[320px] rounded-full"
            style={{
              borderWidth: 1,
              borderColor: `${C.primary}15`,
              opacity: 0.2,
            }}
          />

          <PhoneIllustration />
        </View>
      </View>

      {/* ── Footer ── */}
      <View className="items-center px-6 pb-6">
        <Pressable
          className="h-14 w-full max-w-xs flex-row items-center justify-center gap-2 rounded-2xl"
          disabled={isRecommending || isSelectingRestaurant}
          onPress={handleRecommendRestaurant}
          style={{
            backgroundColor: C.surface,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <MaterialIcons color={C.primary} name="touch-app" size={20} />
          <Text className="font-bold" style={{ color: C.textMain }}>
            {showRecommendLoadingText ? "추천 중..." : "흔들지 않고 터치하기"}
          </Text>
        </Pressable>
        {recommendationError ? (
          <Text
            className="mt-3 text-center text-xs"
            style={{ color: "#dc2626" }}
          >
            {recommendationError}
          </Text>
        ) : null}
        <Text className="mt-4 text-center text-xs" style={{ color: C.textSub }}>
          흔들기가 동작하지 않나요? 설정을 확인해주세요.
        </Text>
      </View>

      <RestaurantResultModal
        isRecommending={isRecommending || isSelectingRestaurant}
        isSelecting={isSelectingRestaurant}
        onClose={handleCloseRecommendation}
        onOpenMap={handleOpenMap}
        onRefresh={handleRecommendRestaurant}
        restaurant={recommendedRestaurant}
        rouletteCategories={rouletteCategories}
        rouletteIndex={rouletteIndex}
        visible={Boolean(recommendedRestaurant)}
      />
    </SafeAreaView>
  );
}
