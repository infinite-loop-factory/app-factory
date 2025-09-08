import { Navigation } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

const PRIMARY = "#5CAD5D";

export default function LocationLoading() {
  const outerRotate = useRef(new Animated.Value(0)).current;
  const innerRotate = useRef(new Animated.Value(0)).current;

  const centerPulse = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const dots = [
    { key: "dot1", value: dot1 },
    { key: "dot2", value: dot2 },
    { key: "dot3", value: dot3 },
  ];

  useEffect(() => {
    Animated.loop(
      Animated.timing(outerRotate, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.timing(innerRotate, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(centerPulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(centerPulse, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    const makeDotLoop = (val: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ).start();

    makeDotLoop(dot1, 0);
    makeDotLoop(dot2, 200);
    makeDotLoop(dot3, 400);
  }, [outerRotate, innerRotate, centerPulse, dot1, dot2, dot3]);

  const outerSpin = outerRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const innerSpin = innerRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-360deg"],
  });

  const centerScale = centerPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  return (
    <View className="flex-1 items-center">
      <View className="flex-1 items-center justify-center p-6">
        <View className="w-full max-w-[400px] items-center">
          {/* NOTE: 회전 */}
          <View style={styles.ringWrap}>
            {/* NOTE: 바깥 ring */}
            <Animated.View
              style={[
                styles.outerRing,
                {
                  transform: [{ rotate: outerSpin }],
                  borderColor: `${PRIMARY}33`,
                  borderTopColor: PRIMARY,
                },
              ]}
            />
            {/* NOTE: 안쪽 ring */}
            <Animated.View
              style={[
                styles.innerRing,
                {
                  transform: [{ rotate: innerSpin }],
                  borderColor: `${PRIMARY}4D`,
                  borderRightColor: PRIMARY,
                },
              ]}
            />

            {/* NOTE: 가운데 아이콘 영역 */}
            <Animated.View
              style={[
                styles.centerBubble,
                { transform: [{ scale: centerScale }] },
              ]}
            >
              <Navigation color={PRIMARY} size={24} />
            </Animated.View>
          </View>

          <Text style={styles.title}>현재 위치 정보를 불러오고 있습니다</Text>
          <Text style={styles.desc}>
            GPS를 통해 정확한 위치를 확인하고 있어요
          </Text>

          {/* NOTE: Indicators */}
          <View style={styles.dots}>
            {dots.map((data) => (
              <Animated.View
                key={`dot_${data.key}`}
                style={[
                  styles.dot,
                  {
                    opacity: data.value.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.4, 1],
                    }),
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const SIZE = 80;
const INNER = 64;

const styles = StyleSheet.create({
  ringWrap: {
    width: SIZE,
    height: SIZE,
    marginBottom: 16,
    alignSelf: "center",
  },
  outerRing: {
    position: "absolute",
    width: SIZE,
    height: SIZE,
    borderWidth: 4,
    borderRadius: SIZE / 2,
  },
  innerRing: {
    position: "absolute",
    top: (SIZE - INNER) / 2,
    left: (SIZE - INNER) / 2,
    width: INNER,
    height: INNER,
    borderWidth: 2,
    borderRadius: INNER / 2,
  },
  centerBubble: {
    position: "absolute",
    top: SIZE / 2 - 24,
    left: SIZE / 2 - 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#5CAD5D1A",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a", // slate-900
    textAlign: "center",
  },
  desc: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: "#64748b", // slate-500
    textAlign: "center",
  },
  dots: {
    flexDirection: "row",
    marginTop: 12,
    columnGap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: PRIMARY,
  },
});
