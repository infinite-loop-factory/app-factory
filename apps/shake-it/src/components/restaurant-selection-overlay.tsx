import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Easing, Modal, Text, View } from "react-native";

interface RestaurantSelectionOverlayProps {
  visible: boolean;
  categories: string[];
  activeIndex: number;
}

export function RestaurantSelectionOverlay({
  visible,
  categories,
  activeIndex,
}: RestaurantSelectionOverlayProps) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      spin.stopAnimation();
      spin.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animation.start();

    return () => {
      animation.stop();
    };
  }, [spin, visible]);

  if (!visible) {
    return null;
  }

  const safeCategories =
    categories.length > 0 ? categories : ["한식", "중식", "일식", "양식"];
  const size = safeCategories.length;
  const current = safeCategories[activeIndex % size] ?? "맛집";
  const prev = safeCategories[(activeIndex - 1 + size) % size] ?? current;
  const next = safeCategories[(activeIndex + 1) % size] ?? current;

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View className="flex-1 items-center justify-center bg-black/55 px-6">
        <View className="w-full max-w-xs items-center rounded-3xl bg-white/95 px-6 py-8">
          <View className="mb-5 h-14 w-14 items-center justify-center rounded-full bg-blue-50">
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: spin.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              }}
            >
              <MaterialIcons color="#3366FF" name="sync" size={30} />
            </Animated.View>
          </View>

          <Text className="mb-3 font-semibold text-slate-500 text-sm">
            카테고리 룰렛 돌리는 중...
          </Text>

          <View className="w-full items-center rounded-2xl bg-slate-100/80 px-4 py-4">
            <Text className="font-semibold text-slate-400 text-sm">{prev}</Text>
            <Text className="my-2 font-extrabold text-[#3366FF] text-[30px]">
              {current}
            </Text>
            <Text className="font-semibold text-slate-400 text-sm">{next}</Text>
          </View>

          <Text className="mt-4 text-center font-medium text-slate-500 text-sm">
            카테고리 확정 후 맛집을 추천해드려요
          </Text>
        </View>
      </View>
    </Modal>
  );
}
