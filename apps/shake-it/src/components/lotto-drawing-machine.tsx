import { MaterialIcons } from "@expo/vector-icons";
import { memo, useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";
import { LOTTO_PICK_COUNT } from "@/utils/lotto";

const C = {
  primary: "#3d6bf5",
  surface: "#F7F8FA",
  border: "#E5E8EB",
  textMain: "#191F28",
  textSub: "#6B7684",
  white: "#FFFFFF",
};

const DECORATIVE_BALLS = Array.from({ length: 9 }, (_, index) => index);
const NUMBER_SLOTS = Array.from({ length: LOTTO_PICK_COUNT }, (_, index) => ({
  id: `slot-${index + 1}`,
  label: index + 1,
}));

function getBallColor(number: number) {
  if (number <= 10) {
    return "#F5B82E";
  }
  if (number <= 20) {
    return "#3D6BF5";
  }
  if (number <= 30) {
    return "#EF4444";
  }
  if (number <= 40) {
    return "#6B7684";
  }
  return "#22C55E";
}

function LottoNumberBall({ number }: { number: number }) {
  return (
    <View
      accessibilityLabel={`로또 번호 ${number}`}
      className="h-12 w-12 items-center justify-center rounded-full"
      style={{
        backgroundColor: getBallColor(number),
        borderCurve: "continuous",
        boxShadow: "0 8px 18px rgba(25, 31, 40, 0.18)",
      }}
    >
      <Text
        className="font-extrabold text-lg text-white"
        selectable
        style={{ fontVariant: ["tabular-nums"] }}
      >
        {number}
      </Text>
    </View>
  );
}

export const LottoDrawingMachine = memo(function LottoDrawingMachine({
  isDrawing,
  numbers,
}: {
  isDrawing: boolean;
  numbers: number[];
}) {
  const rotation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isDrawing) {
      rotation.stopAnimation();
      scale.stopAnimation();
      rotation.setValue(0);
      scale.setValue(1);
      return;
    }

    const animation = Animated.loop(
      Animated.parallel([
        Animated.timing(rotation, {
          toValue: 1,
          duration: 850,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.04,
            duration: 320,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 320,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    animation.start();
    return () => {
      animation.stop();
    };
  }, [isDrawing, rotation, scale]);

  const spinStyle = {
    transform: [
      {
        rotate: rotation.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "360deg"],
        }),
      },
      { scale },
    ],
  };

  return (
    <View className="items-center gap-8">
      <View
        className="h-72 w-72 items-center justify-center rounded-full border"
        style={{
          backgroundColor: C.surface,
          borderColor: C.border,
          borderCurve: "continuous",
          boxShadow: "inset 0 0 26px rgba(61, 107, 245, 0.12)",
        }}
      >
        <Animated.View
          className="h-52 w-52 items-center justify-center rounded-full"
          style={[
            {
              backgroundColor: C.white,
              borderWidth: 1,
              borderColor: C.border,
              borderCurve: "continuous",
            },
            spinStyle,
          ]}
        >
          {DECORATIVE_BALLS.map((item) => (
            <View
              className="absolute h-10 w-10 items-center justify-center rounded-full"
              key={item}
              style={{
                backgroundColor: item % 2 === 0 ? "#EBF1FF" : "#FFF5DB",
                left: `${36 + Math.cos((item / 9) * Math.PI * 2) * 34}%`,
                top: `${36 + Math.sin((item / 9) * Math.PI * 2) * 34}%`,
              }}
            >
              <MaterialIcons
                color={item % 2 === 0 ? C.primary : "#F5B82E"}
                name="circle"
                size={12}
              />
            </View>
          ))}
          <View
            className="h-24 w-24 items-center justify-center rounded-full"
            style={{ backgroundColor: "#EEF3FF", borderCurve: "continuous" }}
          >
            <MaterialIcons color={C.primary} name="casino" size={44} />
          </View>
        </Animated.View>
      </View>

      <View className="w-full flex-row flex-wrap justify-center gap-3">
        {NUMBER_SLOTS.map((slot, index) => {
          const number = numbers[index];

          return number ? (
            <LottoNumberBall key={slot.id} number={number} />
          ) : (
            <View
              accessibilityLabel={`${slot.label}번째 번호 대기 중`}
              className="h-12 w-12 items-center justify-center rounded-full border"
              key={slot.id}
              style={{
                backgroundColor: C.white,
                borderColor: C.border,
                borderCurve: "continuous",
              }}
            >
              <Text
                className="font-bold text-sm"
                style={{
                  color: C.textSub,
                  fontVariant: ["tabular-nums"],
                }}
              >
                {slot.label}
              </Text>
            </View>
          );
        })}
      </View>

      <View className="min-h-5 justify-center">
        {numbers.length > 0 ? (
          <Text
            accessibilityLabel={`추첨된 번호 ${numbers.join(", ")}`}
            className="text-center font-semibold text-sm"
            selectable
            style={{ color: C.textMain }}
          >
            추첨순: {numbers.join("  ")}
          </Text>
        ) : null}
      </View>
    </View>
  );
});
