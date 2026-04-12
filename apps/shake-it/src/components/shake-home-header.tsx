import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

const C = {
  surface: "#F2F4F6",
  textMain: "#191F28",
};

interface ShakeHomeHeaderProps {
  address: string;
  radiusLabel: string;
  onPressRadius: () => void;
}

export function ShakeHomeHeader({
  address,
  radiusLabel,
  onPressRadius,
}: ShakeHomeHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-5 pb-4">
      <Pressable className="gap-1" onPress={onPressRadius}>
        <View className="flex-row items-center gap-1.5">
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
        </View>
        <View className="self-start rounded-full bg-[#EFF6FF] px-3 py-1">
          <Text className="font-medium text-[#3366FF] text-xs">
            검색 반경 {radiusLabel}
          </Text>
        </View>
      </Pressable>

      <Pressable
        className="relative h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: C.surface }}
      >
        <MaterialIcons color={C.textMain} name="person" size={24} />
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
  );
}
