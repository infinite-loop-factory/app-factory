import type { ReactNode } from "react";

import { Animated, Text, View } from "react-native";

const C = {
  primary: "#3d6bf5",
  textMain: "#191F28",
  textSub: "#8B95A1",
};

interface ShakeHomeHeroProps {
  pulseStyle: Animated.WithAnimatedValue<Record<string, unknown>>;
  rippleStyle: Animated.WithAnimatedValue<Record<string, unknown>>;
  phoneIllustration: ReactNode;
}

export function ShakeHomeHero({
  pulseStyle,
  rippleStyle,
  phoneIllustration,
}: ShakeHomeHeroProps) {
  return (
    <View className="flex-1 items-center justify-center px-6">
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

      <View className="relative mb-8 h-[280px] w-[280px] items-center justify-center">
        <Animated.View
          className="absolute h-[260px] w-[260px] rounded-full"
          style={[
            { borderWidth: 1, borderColor: `${C.primary}30` },
            rippleStyle,
          ]}
        />
        <View
          className="absolute h-[320px] w-[320px] rounded-full"
          style={{
            borderWidth: 1,
            borderColor: `${C.primary}15`,
            opacity: 0.2,
          }}
        />

        {phoneIllustration}
      </View>
    </View>
  );
}
