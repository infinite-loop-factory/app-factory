import type { KakaoRestaurant } from "@/services/kakao-api";

import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Modal, Pressable, Text, View } from "react-native";

function getCuisineText(category: string) {
  const categories = category
    .split(">")
    .map((item) => item.trim())
    .filter(Boolean);

  return categories.at(-1) ?? "음식점";
}

interface RestaurantResultModalProps {
  visible: boolean;
  restaurant: KakaoRestaurant | null;
  isRecommending: boolean;
  isSelecting: boolean;
  rouletteCategories: string[];
  rouletteIndex: number;
  onClose: () => void;
  onOpenMap: () => void;
  onRefresh: () => void;
}

export function RestaurantResultModal({
  visible,
  restaurant,
  isRecommending,
  isSelecting,
  rouletteCategories,
  rouletteIndex,
  onClose,
  onOpenMap,
  onRefresh,
}: RestaurantResultModalProps) {
  const [showLoadingText, setShowLoadingText] = useState(false);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shownAtRef = useRef<number | null>(null);
  const spin = useRef(new Animated.Value(0)).current;
  const dots = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (isRecommending) {
      showTimerRef.current = setTimeout(() => {
        shownAtRef.current = Date.now();
        setShowLoadingText(true);
      }, 180);
      return;
    }

    if (!showLoadingText) {
      return;
    }

    const elapsed = shownAtRef.current ? Date.now() - shownAtRef.current : 0;
    const remaining = Math.max(0, 500 - elapsed);

    hideTimerRef.current = setTimeout(() => {
      shownAtRef.current = null;
      setShowLoadingText(false);
    }, remaining);
  }, [isRecommending, showLoadingText]);

  useEffect(() => {
    return () => {
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
      }
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isSelecting) {
      spin.stopAnimation();
      spin.setValue(0);
      dots.stopAnimation();
      dots.setValue(0);
      return;
    }

    const spinAnimation = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    const dotsAnimation = Animated.loop(
      Animated.timing(dots, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    spinAnimation.start();
    dotsAnimation.start();

    return () => {
      spinAnimation.stop();
      dotsAnimation.stop();
    };
  }, [dots, isSelecting, spin]);

  const shouldShowModal = isSelecting || visible;
  if (!shouldShowModal) {
    return null;
  }

  const categories =
    rouletteCategories.length > 0
      ? rouletteCategories
      : ["한식", "중식", "일식", "양식"];
  const size = categories.length;
  const current = categories[rouletteIndex % size] ?? "맛집";

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={shouldShowModal}
    >
      <View className="flex-1 items-center justify-center bg-black/70 px-4">
        {isSelecting ? null : (
          <Pressable className="absolute inset-0" onPress={onClose} />
        )}

        {isSelecting ? (
          <View className="w-full max-w-[340px] items-center rounded-[28px] bg-white px-6 pt-10 pb-8 shadow-2xl">
            <Text className="mb-5 font-medium text-slate-400 text-xs tracking-wide">
              Shake-It!
            </Text>

            <View className="relative mb-10 h-72 w-72 items-center justify-center">
              <View
                className="absolute -top-3 z-20"
                style={{
                  left: "50%",
                  marginLeft: -12,
                  width: 0,
                  height: 0,
                  borderLeftWidth: 12,
                  borderRightWidth: 12,
                  borderTopWidth: 20,
                  borderLeftColor: "transparent",
                  borderRightColor: "transparent",
                  borderTopColor: "#191F28",
                }}
              />

              <Animated.View
                className="h-full w-full overflow-hidden rounded-full border-4 border-white"
                style={{
                  backgroundColor: "white",
                  transform: [
                    {
                      rotate: spin.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "1800deg"],
                      }),
                    },
                  ],
                }}
              >
                <View className="absolute top-0 left-0 h-1/2 w-1/2 items-center justify-center bg-[#FF6B6B]">
                  <MaterialIcons color="white" name="local-pizza" size={38} />
                </View>
                <View className="absolute top-0 right-0 h-1/2 w-1/2 items-center justify-center bg-[#4ECDC4]">
                  <MaterialIcons color="white" name="lunch-dining" size={38} />
                </View>
                <View className="absolute right-0 bottom-0 h-1/2 w-1/2 items-center justify-center bg-[#FFD93D]">
                  <MaterialIcons color="white" name="ramen-dining" size={38} />
                </View>
                <View className="absolute bottom-0 left-0 h-1/2 w-1/2 items-center justify-center bg-[#6C5CE7]">
                  <MaterialIcons color="white" name="rice-bowl" size={38} />
                </View>

                <View className="absolute top-1/2 left-1/2 z-10 h-12 w-12 -translate-x-6 -translate-y-6 items-center justify-center rounded-full bg-white">
                  <View className="h-3 w-3 rounded-full bg-[#3d6bf5]" />
                </View>
              </Animated.View>
            </View>

            <View className="items-center">
              <Text className="mb-2 text-center font-bold text-2xl text-[#191F28]">
                운명의 맛집을 찾는 중
              </Text>
              <View className="mb-3 flex-row items-end gap-1">
                <Animated.View
                  className="h-1.5 w-1.5 rounded-full bg-[#3d6bf5]"
                  style={{
                    opacity: dots.interpolate({
                      inputRange: [0, 0.2, 0.5, 1],
                      outputRange: [0, 0, 1, 0],
                    }),
                    transform: [
                      {
                        translateY: dots.interpolate({
                          inputRange: [0, 0.2, 0.5, 1],
                          outputRange: [0, 0, -4, 0],
                        }),
                      },
                    ],
                  }}
                />
                <Animated.View
                  className="h-1.5 w-1.5 rounded-full bg-[#3d6bf5]"
                  style={{
                    opacity: dots.interpolate({
                      inputRange: [0, 0.35, 0.65, 1],
                      outputRange: [0, 0, 1, 0],
                    }),
                    transform: [
                      {
                        translateY: dots.interpolate({
                          inputRange: [0, 0.35, 0.65, 1],
                          outputRange: [0, 0, -4, 0],
                        }),
                      },
                    ],
                  }}
                />
                <Animated.View
                  className="h-1.5 w-1.5 rounded-full bg-[#3d6bf5]"
                  style={{
                    opacity: dots.interpolate({
                      inputRange: [0, 0.5, 0.8, 1],
                      outputRange: [0, 0, 1, 0],
                    }),
                    transform: [
                      {
                        translateY: dots.interpolate({
                          inputRange: [0, 0.5, 0.8, 1],
                          outputRange: [0, 0, -4, 0],
                        }),
                      },
                    ],
                  }}
                />
              </View>
              <Text className="mb-1 text-slate-500 text-sm">
                잠시만 기다려주세요!
              </Text>
              <Text className="font-semibold text-[#3366FF] text-sm">
                현재 카테고리: {current}
              </Text>
            </View>
          </View>
        ) : null}

        {!isSelecting && restaurant ? (
          <View className="relative w-full max-w-[340px] overflow-hidden rounded-[24px] bg-white shadow-2xl">
            <Pressable
              className="absolute top-4 right-4 z-30 h-8 w-8 items-center justify-center rounded-full bg-slate-100"
              onPress={onClose}
            >
              <MaterialIcons color="#64748b" name="close" size={20} />
            </Pressable>

            <View className="items-center px-6 pt-10 pb-6">
              <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                <MaterialIcons color="#3d6bf5" name="storefront" size={48} />
              </View>

              <View className="mb-6 w-full items-center gap-1">
                <Text
                  className="text-center font-bold text-[22px]"
                  style={{ color: "#191F28" }}
                >
                  {restaurant.name}
                </Text>

                <View className="mt-1 flex-row items-center gap-2">
                  <View className="flex-row items-center">
                    <MaterialIcons color="#3d6bf5" name="star" size={16} />
                    <Text className="ml-0.5 font-semibold text-[#3366FF] text-sm">
                      {getCuisineText(restaurant.category)}
                    </Text>
                  </View>
                  <Text className="text-slate-300">|</Text>
                  <Text className="text-slate-500 text-sm">
                    {restaurant.distanceMeter}m
                  </Text>
                </View>
              </View>

              <View className="mb-8 w-full gap-4 rounded-xl bg-slate-50 p-4">
                <View className="flex-row items-start gap-3">
                  <MaterialIcons
                    color="#94a3b8"
                    name="location-on"
                    size={20}
                    style={{ marginTop: 2 }}
                  />
                  <View className="flex-1">
                    <Text className="mb-0.5 font-semibold text-slate-400 text-xs uppercase tracking-wide">
                      Address
                    </Text>
                    <Text className="font-medium text-[15px] text-slate-700 leading-snug">
                      {restaurant.roadAddress || restaurant.address}
                    </Text>
                  </View>
                </View>

                <View className="h-px w-full bg-slate-200" />

                <View className="flex-row items-start gap-3">
                  <MaterialIcons
                    color="#94a3b8"
                    name="call"
                    size={20}
                    style={{ marginTop: 2 }}
                  />
                  <View className="flex-1">
                    <Text className="mb-0.5 font-semibold text-slate-400 text-xs uppercase tracking-wide">
                      Phone
                    </Text>
                    <Text className="font-medium text-[15px] text-slate-700">
                      {restaurant.phone || "전화번호 정보 없음"}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="w-full gap-3">
                <Pressable
                  className="h-14 w-full flex-row items-center justify-center gap-2 rounded-xl"
                  onPress={onOpenMap}
                  style={{ backgroundColor: "#3366FF" }}
                >
                  <MaterialIcons color="white" name="map" size={20} />
                  <Text className="font-bold text-[15px] text-white tracking-tight">
                    카카오맵에서 보기
                  </Text>
                </Pressable>

                <Pressable
                  className="h-12 w-full flex-row items-center justify-center gap-2 rounded-xl"
                  disabled={isRecommending}
                  onPress={onRefresh}
                >
                  <MaterialIcons color="#64748b" name="refresh" size={18} />
                  <Text className="font-semibold text-slate-500 text-sm">
                    {showLoadingText ? "다시 찾는 중..." : "다시 추천받기"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        ) : null}

        <Text className="mt-6 font-medium text-sm text-white/70">
          Not what you craved? Shake again!
        </Text>
      </View>
    </Modal>
  );
}
