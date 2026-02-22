import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

const C = {
  surface: "#F2F4F6",
  textMain: "#191F28",
};

interface ShakeHomeHeaderProps {
  address: string;
}

export function ShakeHomeHeader({ address }: ShakeHomeHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-5 pb-4">
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
