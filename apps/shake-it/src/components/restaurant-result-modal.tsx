import type { KakaoRestaurant } from "@/services/kakao-api";

import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

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
  onClose: () => void;
  onOpenMap: () => void;
  onRefresh: () => void;
}

export function RestaurantResultModal({
  visible,
  restaurant,
  isRecommending,
  onClose,
  onOpenMap,
  onRefresh,
}: RestaurantResultModalProps) {
  const [showLoadingText, setShowLoadingText] = useState(false);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shownAtRef = useRef<number | null>(null);

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

  if (!(visible && restaurant)) {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View className="flex-1 items-center justify-center bg-black/70 px-4">
        <Pressable className="absolute inset-0" onPress={onClose} />

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

        <Text className="mt-6 font-medium text-sm text-white/70">
          Not what you craved? Shake again!
        </Text>
      </View>
    </Modal>
  );
}
