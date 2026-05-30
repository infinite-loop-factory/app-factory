import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Accelerometer } from "expo-sensors";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { LottoDrawingMachine } from "@/components/lotto-drawing-machine";
import { APP_CONFIG } from "@/constants/config";
import { generateLottoNumbers, LOTTO_PICK_COUNT } from "@/utils/lotto";

const C = {
  primary: "#3d6bf5",
  surface: "#F7F8FA",
  border: "#E5E8EB",
  textMain: "#191F28",
  textSub: "#6B7684",
  white: "#FFFFFF",
};

const DRAW_START_DELAY_MS = 520;
const DRAW_STEP_MS = 430;

type DrawState = "idle" | "drawing" | "result";

function isNativeRuntime() {
  return process.env.EXPO_OS !== "web";
}

export default function LottoScreen() {
  const [drawState, setDrawState] = useState<DrawState>("idle");
  const [numbers, setNumbers] = useState<number[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isDrawingRef = useRef(false);

  const clearDrawingTimers = useCallback(() => {
    timersRef.current.forEach((timer) => {
      clearTimeout(timer);
    });
    timersRef.current = [];
  }, []);

  const playHaptic = useCallback((isComplete: boolean) => {
    if (!isNativeRuntime()) {
      return;
    }

    const feedback = isComplete
      ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      : Haptics.selectionAsync();

    void feedback.catch(() => {
      // Haptics are a bonus signal; drawing must continue if unavailable.
    });
  }, []);

  const startDraw = useCallback(() => {
    if (isDrawingRef.current) {
      return;
    }

    const nextNumbers = generateLottoNumbers();
    isDrawingRef.current = true;
    clearDrawingTimers();
    setNumbers([]);
    setDrawState("drawing");

    nextNumbers.forEach((number, index) => {
      const timer = setTimeout(
        () => {
          setNumbers((currentNumbers) => [...currentNumbers, number]);
          playHaptic(index === LOTTO_PICK_COUNT - 1);

          if (index === LOTTO_PICK_COUNT - 1) {
            isDrawingRef.current = false;
            setDrawState("result");
          }
        },
        DRAW_START_DELAY_MS + DRAW_STEP_MS * index,
      );

      timersRef.current.push(timer);
    });
  }, [clearDrawingTimers, playHaptic]);

  useEffect(() => {
    return () => {
      isDrawingRef.current = false;
      clearDrawingTimers();
    };
  }, [clearDrawingTimers]);

  useEffect(() => {
    if (!isNativeRuntime()) {
      return;
    }

    let lastShakeTime = 0;
    Accelerometer.setUpdateInterval(APP_CONFIG.SHAKE_DETECTION_INTERVAL);

    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const acceleration = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();

      if (
        acceleration > APP_CONFIG.DEFAULT_SHAKE_THRESHOLD &&
        now - lastShakeTime > APP_CONFIG.SHAKE_COOLDOWN
      ) {
        lastShakeTime = now;
        startDraw();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [startDraw]);

  const isDrawing = drawState === "drawing";
  let buttonLabel = "번호 뽑기";
  if (drawState === "drawing") {
    buttonLabel = "추첨 중...";
  }
  if (drawState === "result") {
    buttonLabel = "다시 뽑기";
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{
        gap: 28,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 40,
      }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="gap-2">
        <Text
          className="font-extrabold text-2xl"
          style={{ color: C.textMain, lineHeight: 34 }}
        >
          행운의 번호 6개를 뽑아보세요
        </Text>
        <Text className="font-medium text-base" style={{ color: C.textSub }}>
          로또볼이 섞인 뒤 추첨순으로 하나씩 공개됩니다.
        </Text>
      </View>

      <LottoDrawingMachine isDrawing={isDrawing} numbers={numbers} />

      <View className="gap-3">
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: isDrawing }}
          className="h-14 flex-row items-center justify-center gap-2 rounded-lg"
          disabled={isDrawing}
          onPress={startDraw}
          style={{
            backgroundColor: isDrawing ? C.border : C.primary,
            borderCurve: "continuous",
            opacity: isDrawing ? 0.75 : 1,
          }}
        >
          <MaterialIcons
            color={C.white}
            name={isDrawing ? "hourglass-top" : "casino"}
            size={22}
          />
          <Text className="font-extrabold text-base text-white">
            {buttonLabel}
          </Text>
        </Pressable>

        <View
          className="rounded-lg border p-4"
          style={{ backgroundColor: C.surface, borderColor: C.border }}
        >
          <Text
            className="text-center font-semibold text-sm"
            style={{ color: C.textSub, lineHeight: 21 }}
          >
            {isNativeRuntime()
              ? "기기를 흔들어도 추첨이 시작돼요."
              : "웹에서는 버튼으로 추첨을 시작할 수 있어요."}
          </Text>
        </View>

        {drawState === "result" ? (
          <Text
            className="text-center font-semibold text-sm"
            selectable
            style={{ color: C.textSub, lineHeight: 21 }}
          >
            무작위 추천이며 당첨을 보장하지 않아요.
          </Text>
        ) : null}
      </View>
    </ScrollView>
  );
}
