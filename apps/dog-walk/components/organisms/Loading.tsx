import { PawPrint } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface LoadingProps {
  title: string;
  description: string;
  tip: string;
}

export default function Loading({ title, description, tip }: LoadingProps) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 3,
          duration: 700,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 700,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    pulseLoop.start();
    return () => {
      pulseLoop.stop();
    };
  }, [pulse]);

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06], // 살짝 커졌다 줄어드는 느낌(animate-pulse 대체)
  });

  return (
    <VStack className="flex-1 bg-white">
      <VStack className="flex-1 items-center justify-center p-6">
        <VStack className="items-center">
          <View
            className="relative mb-8 items-center justify-center"
            style={{ width: 96, height: 96 }}
          >
            <Animated.View
              className={
                "mb-4 h-20 w-20 items-center justify-center rounded-full bg-[#5CAD5D]/10"
              }
              style={{
                position: "absolute",
                width: 96,
                height: 96,
                borderRadius: "100%",
              }}
            />
            <Animated.View
              style={{
                transform: [{ scale }],
              }}
            >
              <Icon as={PawPrint} className="h-10 w-10 text-[#5CAD5D]" />
            </Animated.View>
          </View>
          <Text className="mt-8 mb-3 font-semibold text-xl">{title}</Text>
          <Text className="text-center text-slate-500 text-sm">
            {description}
          </Text>
          <VStack className="mt-8 items-center gap-2 rounded-xl bg-[#5CAD5D]/5 p-4">
            <Text className="font-bold text-slate-600 text-xs">💡 팁</Text>
            <Text className="text-slate-600 text-xs">{tip}</Text>
          </VStack>
        </VStack>
      </VStack>
    </VStack>
  );
}
