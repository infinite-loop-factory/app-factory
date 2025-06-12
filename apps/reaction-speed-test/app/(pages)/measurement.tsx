import SmileSvg from "@/components/measurement/SmileSvg";
import SvgWrapper from "@/components/measurement/SvgWrapper";
import { Button, ButtonText } from "@/components/ui/button";
import { useReactionTimer } from "@/hooks/useReactionTimer";
import { DelayRender } from "@/utils/DelayRender";
import { Stack, useRouter } from "expo-router";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

type MeasurementState = "waiting" | "ready" | "measuring" | "result" | "early";

const Measurement: FC = () => {
  const router = useRouter();
  const { result, start, stop, reset, earlyPress } = useReactionTimer();
  const [shouldRestart, setShouldRestart] = useState(false);
  const [state, setState] = useState<MeasurementState>("waiting");
  const [_startTime, setStartTime] = useState<number>(0);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // v0 스타일의 측정 로직
  const startMeasurement = useCallback(() => {
    setState("ready");
    const delay = Math.random() * 2000 + 1000; // 1-3초 랜덤 지연

    const id = setTimeout(() => {
      setStartTime(Date.now());
      setState("measuring");
      start(); // 기존 로직 유지
    }, delay);

    setTimeoutId(id);
  }, [start]);

  const handleTouch = useCallback(() => {
    if (state === "ready") {
      // 너무 빨리 터치함
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
      setState("early");
    } else if (state === "measuring") {
      // 정상적인 측정
      const timeResult = stop();
      if (timeResult) {
        setState("result");
      }
    }
  }, [state, timeoutId, stop]);

  const handleReset = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setState("waiting");
    setStartTime(0);
    reset();
    setShouldRestart(true);
    setTimeout(() => {
      setShouldRestart(false);
    }, 100);
  }, [timeoutId, reset]);

  useEffect(() => {
    if (result) {
      setState("result");
    }
    if (earlyPress && !result) {
      setState("early");
    }
  }, [result, earlyPress]);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const getStateConfig = () => {
    switch (state) {
      case "waiting":
        return {
          bg: "bg-slate-100 dark:bg-slate-900",
          text: "화면을 터치하여 시작하세요",
          subText: "스마일 아이콘이 나타나면 즉시 터치하세요",
          showIcon: false,
          action: startMeasurement,
          textColor: "text-slate-900 dark:text-slate-100",
          subTextColor: "text-slate-600 dark:text-slate-400",
        };
      case "ready":
        return {
          bg: "bg-red-500 dark:bg-red-600",
          text: "잠시만 기다리세요...",
          subText: "스마일 아이콘이 곧 나타납니다",
          showIcon: false,
          action: handleTouch,
          textColor: "text-white",
          subTextColor: "text-white/80",
        };
      case "measuring":
        return {
          bg: "bg-green-500 dark:bg-green-600",
          text: "지금 터치하세요!",
          subText: "",
          showIcon: true,
          action: handleTouch,
          textColor: "text-white",
          subTextColor: "text-white/80",
        };
      case "result":
        return {
          bg: "bg-slate-100 dark:bg-slate-900",
          text: result ? `${result.reactionTime}ms` : "측정 완료",
          subText: "훌륭합니다!",
          showIcon: false,
          action: () => {
            // 결과 상태에서는 아무 동작 없음
          },
          textColor: "text-slate-900 dark:text-slate-100",
          subTextColor: "text-slate-600 dark:text-slate-400",
        };
      case "early":
        return {
          bg: "bg-slate-100 dark:bg-slate-900",
          text: "너무 빨리 터치했습니다!",
          subText: "스마일 아이콘이 나타난 후에 터치하세요",
          showIcon: false,
          action: () => {
            // 조기 터치 상태에서는 아무 동작 없음
          },
          textColor: "text-slate-900 dark:text-slate-100",
          subTextColor: "text-slate-600 dark:text-slate-400",
        };
    }
  };

  const config = getStateConfig();

  return (
    <Pressable
      onPress={config.action}
      className={`flex-1 items-center justify-center transition-colors duration-300 ${config.bg}`}
    >
      <Stack.Screen options={{ title: "측정", headerShown: false }} />

      <View className="flex-1 items-center justify-center px-4">
        {/* 스마일 아이콘 표시 영역 */}
        {config.showIcon && (
          <View className="mb-8">
            {/* TODO: 추후 추가할 기능 - v0의 체크마크 대신 기존 스마일 아이콘 유지 */}
            <SvgWrapper>
              <SmileSvg />
            </SvgWrapper>
          </View>
        )}

        {/* 메인 텍스트 */}
        <Text
          className={`mb-4 text-center font-bold text-4xl ${config.textColor}`}
        >
          {config.text}
        </Text>

        {/* 서브 텍스트 */}
        {config.subText && (
          <Text className={`text-center text-lg ${config.subTextColor}`}>
            {config.subText}
          </Text>
        )}
      </View>

      {/* 하단 버튼들 */}
      {(state === "result" || state === "early") && (
        <View className="w-full max-w-md gap-y-4 p-6">
          <Button
            action="primary"
            className="h-14 w-full bg-slate-900 dark:bg-slate-100"
            onPress={handleReset}
          >
            <ButtonText className="text-lg text-slate-100 dark:text-slate-900">
              다시 측정하기
            </ButtonText>
          </Button>
          <Button
            action="secondary"
            className="h-12 w-full border-slate-300 dark:border-slate-700"
            onPress={() => router.push("/menu")}
          >
            <ButtonText className="text-slate-700 dark:text-slate-300">
              메뉴로 돌아가기
            </ButtonText>
          </Button>
        </View>
      )}

      {/* TODO: 추후 추가할 기능 - 기존 DelayRender 로직은 숨김 처리 */}
      <View className="pointer-events-none absolute opacity-0">
        <DelayRender
          minDelay={1000}
          maxDelay={3000}
          onRender={start}
          shouldRestart={shouldRestart}
        >
          <View />
        </DelayRender>
      </View>
    </Pressable>
  );
};

export default Measurement;
