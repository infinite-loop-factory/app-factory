import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocation } from "@/hooks/use-location";

const C = {
  primary: "#3d6bf5",
  primaryDark: "#254db5",
  surface: "#F2F4F6",
  textMain: "#191F28",
  textSub: "#8B95A1",
};

function useShakeAnimation() {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
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
    ).start();
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
    Animated.loop(
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
    ).start();
  }, [translateY]);

  return { transform: [{ translateY }] };
}

function usePulseAnimation() {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
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
    ).start();
  }, [opacity]);

  return { opacity };
}

function useRippleAnimation() {
  const scale = useRef(new Animated.Value(1.1)).current;
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
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
    ).start();
  }, [scale, opacity]);

  return { transform: [{ scale }], opacity };
}

/** Motion lines decorating the phone illustration */
function MotionLines({ side }: { side: "left" | "right" }) {
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
}

/** The phone illustration at the center of the screen */
function PhoneIllustration() {
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
}

export default function HomeScreen() {
  const pulseStyle = usePulseAnimation();
  const rippleStyle = useRippleAnimation();
  const { address, refreshLocation } = useLocation();

  useEffect(() => {
    refreshLocation();
  }, [refreshLocation]);

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
            흔들지 않고 터치하기
          </Text>
        </Pressable>
        <Text className="mt-4 text-center text-xs" style={{ color: C.textSub }}>
          흔들기가 동작하지 않나요? 설정을 확인해주세요.
        </Text>
      </View>
    </SafeAreaView>
  );
}
