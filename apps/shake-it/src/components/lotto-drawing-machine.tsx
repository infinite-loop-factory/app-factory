import { memo, useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";
import { LOTTO_MAX_NUMBER, LOTTO_PICK_COUNT } from "@/utils/lotto";

const C = {
  primary: "#3d6bf5",
  surface: "#F7F8FA",
  border: "#E5E8EB",
  textMain: "#191F28",
  textSub: "#6B7684",
  white: "#FFFFFF",
};

const SPHERE_SIZE = 288;
const SPHERE_RADIUS = SPHERE_SIZE / 2;
const MACHINE_BALL_SIZE = 23;
const MACHINE_BALL_RADIUS = MACHINE_BALL_SIZE / 2;
const MACHINE_BALL_CENTER = SPHERE_RADIUS - MACHINE_BALL_RADIUS;
const BALL_SAFE_RADIUS = SPHERE_RADIUS - MACHINE_BALL_RADIUS - 6;
const MIX_INPUT_RANGE = [0, 0.16, 0.32, 0.48, 0.64, 0.8, 1];
const MACHINE_BALLS = Array.from({ length: LOTTO_MAX_NUMBER }, (_, index) => {
  const number = index + 1;

  return {
    number,
    track: createBallTrack(number),
    duration: 1350 + Math.floor(seededRandom(number, 41) * 520),
    delay: Math.floor(seededRandom(number, 43) * 260),
    zIndex: Math.floor(seededRandom(number, 47) * 100),
  };
});
const NUMBER_SLOTS = Array.from({ length: LOTTO_PICK_COUNT }, (_, index) => ({
  id: `slot-${index + 1}`,
  label: index + 1,
}));

type SpherePoint = {
  x: number;
  y: number;
};

type BallTrack = {
  opacity: number[];
  rotate: string[];
  rotateX: string[];
  rotateY: string[];
  scale: number[];
  x: number[];
  y: number[];
};

function seededRandom(seed: number, salt: number) {
  const value = Math.sin(seed * 97.13 + salt * 31.71) * 10_000;
  return value - Math.floor(value);
}

function randomBetween(seed: number, salt: number, min: number, max: number) {
  return min + seededRandom(seed, salt) * (max - min);
}

function getBallAnimation(ballAnimations: Animated.Value[], index: number) {
  const animation = ballAnimations[index];

  if (!animation) {
    throw new Error(`Missing lotto ball animation at index ${index}`);
  }

  return animation;
}

function createSpherePoint(
  number: number,
  salt: number,
  minRadius: number,
  maxRadius: number,
): SpherePoint {
  const angle = randomBetween(number, salt, 0, Math.PI * 2);
  const radius = randomBetween(number, salt + 1, minRadius, maxRadius);

  return {
    x: Math.cos(angle) * BALL_SAFE_RADIUS * radius,
    y: Math.sin(angle) * BALL_SAFE_RADIUS * radius,
  };
}

function createBallTrack(number: number): BallTrack {
  const points = [
    createSpherePoint(number, 3, 0.1, 0.98),
    createSpherePoint(number, 7, 0.62, 1),
    createSpherePoint(number, 11, 0.04, 0.72),
    createSpherePoint(number, 17, 0.56, 1),
    createSpherePoint(number, 23, 0.08, 0.8),
    createSpherePoint(number, 29, 0.6, 1),
    createSpherePoint(number, 3, 0.1, 0.98),
  ];

  return {
    x: points.map((point) => point.x),
    y: points.map((point) => point.y),
    rotate: [
      `${randomBetween(number, 5, -24, 24)}deg`,
      `${randomBetween(number, 9, 45, 120)}deg`,
      `${randomBetween(number, 13, 135, 210)}deg`,
      `${randomBetween(number, 19, 225, 300)}deg`,
      `${randomBetween(number, 25, 305, 390)}deg`,
      `${randomBetween(number, 31, 405, 520)}deg`,
      `${randomBetween(number, 5, -24, 24)}deg`,
    ],
    rotateX: [
      `${randomBetween(number, 37, -14, 14)}deg`,
      `${randomBetween(number, 39, 18, 48)}deg`,
      `${randomBetween(number, 41, -54, -20)}deg`,
      `${randomBetween(number, 43, 24, 58)}deg`,
      `${randomBetween(number, 45, -44, -16)}deg`,
      `${randomBetween(number, 47, 14, 46)}deg`,
      `${randomBetween(number, 37, -14, 14)}deg`,
    ],
    rotateY: [
      `${randomBetween(number, 49, -18, 18)}deg`,
      `${randomBetween(number, 51, -58, -24)}deg`,
      `${randomBetween(number, 53, 26, 62)}deg`,
      `${randomBetween(number, 55, -50, -18)}deg`,
      `${randomBetween(number, 57, 18, 52)}deg`,
      `${randomBetween(number, 59, -56, -22)}deg`,
      `${randomBetween(number, 49, -18, 18)}deg`,
    ],
    scale: [
      randomBetween(number, 61, 0.78, 0.9),
      randomBetween(number, 63, 0.9, 1),
      randomBetween(number, 65, 0.74, 0.88),
      randomBetween(number, 67, 0.88, 1),
      randomBetween(number, 69, 0.76, 0.9),
      randomBetween(number, 71, 0.9, 1),
      randomBetween(number, 61, 0.78, 0.9),
    ],
    opacity: [
      randomBetween(number, 73, 0.64, 0.8),
      randomBetween(number, 75, 0.88, 1),
      randomBetween(number, 77, 0.58, 0.76),
      randomBetween(number, 79, 0.84, 1),
      randomBetween(number, 81, 0.62, 0.78),
      randomBetween(number, 83, 0.86, 1),
      randomBetween(number, 73, 0.64, 0.8),
    ],
  };
}

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

function MachineNumberBall({ number }: { number: number }) {
  return (
    <View
      accessibilityLabel={`추첨기 안의 로또공 ${number}`}
      className="items-center justify-center rounded-full border"
      style={{
        width: MACHINE_BALL_SIZE,
        height: MACHINE_BALL_SIZE,
        backgroundColor: getBallColor(number),
        borderColor: "rgba(255, 255, 255, 0.72)",
        borderCurve: "continuous",
        overflow: "hidden",
      }}
    >
      <View
        className="absolute rounded-full"
        style={{
          top: 3,
          left: 4,
          width: 7,
          height: 5,
          backgroundColor: "rgba(255, 255, 255, 0.58)",
        }}
      />
      <Text
        className="font-extrabold text-white"
        style={{
          fontSize: number >= 10 ? 9 : 10,
          lineHeight: 12,
          fontVariant: ["tabular-nums"],
        }}
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
  const ballAnimations = useRef(
    MACHINE_BALLS.map(() => new Animated.Value(0)),
  ).current;
  const runningAnimations = useRef<ReturnType<typeof Animated.loop>[]>([]);

  useEffect(() => {
    runningAnimations.current.forEach((animation) => {
      animation.stop();
    });
    runningAnimations.current = [];

    if (!isDrawing) {
      ballAnimations.forEach((animation) => {
        animation.stopAnimation();
        animation.setValue(0);
      });
      return;
    }

    runningAnimations.current = MACHINE_BALLS.map((ball, index) => {
      const ballAnimation = getBallAnimation(ballAnimations, index);
      const animation = Animated.loop(
        Animated.sequence([
          Animated.delay(ball.delay),
          Animated.timing(ballAnimation, {
            toValue: 1,
            duration: ball.duration,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(ballAnimation, {
            toValue: 0,
            duration: Math.floor(ball.duration * 0.82),
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      );

      animation.start();
      return animation;
    });

    return () => {
      runningAnimations.current.forEach((animation) => {
        animation.stop();
      });
      runningAnimations.current = [];
    };
  }, [ballAnimations, isDrawing]);

  return (
    <View className="items-center gap-8">
      <View
        className="h-72 w-72 items-center justify-center rounded-full border"
        style={{
          width: SPHERE_SIZE,
          height: SPHERE_SIZE,
          backgroundColor: "rgba(247, 248, 250, 0.34)",
          borderColor: "rgba(61, 107, 245, 0.38)",
          borderCurve: "continuous",
          borderRadius: SPHERE_RADIUS,
          boxShadow:
            "inset 0 0 36px rgba(61, 107, 245, 0.2), 0 18px 32px rgba(25, 31, 40, 0.1)",
          overflow: "hidden",
        }}
      >
        <View
          className="absolute"
          style={{
            top: 0,
            left: 0,
            width: SPHERE_SIZE,
            height: SPHERE_SIZE,
            borderRadius: SPHERE_RADIUS,
            overflow: "hidden",
          }}
        >
          {MACHINE_BALLS.map((ball, index) => {
            const progress = getBallAnimation(ballAnimations, index);

            return (
              <Animated.View
                className="absolute"
                key={ball.number}
                style={{
                  left: MACHINE_BALL_CENTER,
                  top: MACHINE_BALL_CENTER,
                  opacity: progress.interpolate({
                    inputRange: MIX_INPUT_RANGE,
                    outputRange: ball.track.opacity,
                  }),
                  transform: [
                    { perspective: 850 },
                    {
                      rotateX: progress.interpolate({
                        inputRange: MIX_INPUT_RANGE,
                        outputRange: ball.track.rotateX,
                      }),
                    },
                    {
                      rotateY: progress.interpolate({
                        inputRange: MIX_INPUT_RANGE,
                        outputRange: ball.track.rotateY,
                      }),
                    },
                    {
                      scale: progress.interpolate({
                        inputRange: MIX_INPUT_RANGE,
                        outputRange: ball.track.scale,
                      }),
                    },
                    {
                      translateX: progress.interpolate({
                        inputRange: MIX_INPUT_RANGE,
                        outputRange: ball.track.x,
                      }),
                    },
                    {
                      translateY: progress.interpolate({
                        inputRange: MIX_INPUT_RANGE,
                        outputRange: ball.track.y,
                      }),
                    },
                    {
                      rotate: progress.interpolate({
                        inputRange: MIX_INPUT_RANGE,
                        outputRange: ball.track.rotate,
                      }),
                    },
                  ],
                  zIndex: ball.zIndex,
                }}
              >
                <MachineNumberBall number={ball.number} />
              </Animated.View>
            );
          })}
        </View>

        <View
          className="absolute rounded-full"
          pointerEvents="none"
          style={{
            top: 26,
            left: 42,
            width: 112,
            height: 60,
            backgroundColor: "rgba(255, 255, 255, 0.42)",
            borderRadius: 56,
            transform: [{ rotate: "-24deg" }],
          }}
        />
        <View
          className="absolute rounded-full border"
          pointerEvents="none"
          style={{
            top: 22,
            left: 22,
            width: SPHERE_SIZE - 44,
            height: SPHERE_SIZE - 44,
            borderColor: "rgba(255, 255, 255, 0.34)",
            borderRadius: (SPHERE_SIZE - 44) / 2,
          }}
        />
        <View
          className="absolute rounded-full"
          pointerEvents="none"
          style={{
            right: 48,
            bottom: 34,
            width: 74,
            height: 36,
            backgroundColor: "rgba(255, 255, 255, 0.24)",
            borderRadius: 37,
            transform: [{ rotate: "-18deg" }],
          }}
        />
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
