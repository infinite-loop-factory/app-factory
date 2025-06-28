import SmileSvg from "@/components/measurement/SmileSvg";
import SvgWrapper from "@/components/measurement/SvgWrapper";
import { Button, ButtonText } from "@/components/ui/button";
import { useReactionTimer } from "@/hooks/useReactionTimer";
import { DelayRender } from "@/utils/DelayRender";
import { noop } from "es-toolkit";
import { useRouter } from "expo-router";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

type MeasurementState = "waiting" | "ready" | "measuring" | "result" | "early";

const Measurement: FC = () => {
  const router = useRouter();
  const { result, start, stop, reset } = useReactionTimer();
  const [shouldRestart, setShouldRestart] = useState(false);
  const [state, setState] = useState<MeasurementState>("waiting");

  const startMeasurement = useCallback(() => {
    setState("ready");
  }, []);

  const handleDelayRender = useCallback(() => {
    setState("measuring");
    start();
  }, [start]);

  const handleTouch = useCallback(() => {
    if (state === "measuring") {
      const timeResult = stop();
      if (timeResult) {
        setState("result");
      }
    } else if (state === "ready") {
      setState("early");
    }
  }, [state, stop]);

  const handleReset = useCallback(() => {
    setState("waiting");
    reset();
    setShouldRestart(true);
    setTimeout(() => {
      setShouldRestart(false);
    }, 100);
  }, [reset]);

  useEffect(() => {
    if (result) {
      setState("result");
    }
  }, [result]);

  const getStateConfig = () => {
    switch (state) {
      case "waiting":
        return {
          text: "화면을 터치하여 시작하세요",
          subText: "스마일 아이콘이 나타나면 즉시 터치하세요",
          showIcon: false,
          action: startMeasurement,
          textColor: "text-slate-900 dark:text-slate-100",
          subTextColor: "text-slate-600 dark:text-slate-400",
        };
      case "ready":
        return {
          text: "잠시만 기다리세요...",
          subText: "스마일 아이콘이 곧 나타납니다",
          showIcon: false,
          action: handleTouch,
          textColor: "text-slate-900 dark:text-slate-100",
          subTextColor: "text-slate-600 dark:text-slate-400",
        };
      case "measuring":
        return {
          text: "지금 터치하세요!",
          subText: "",
          showIcon: true,
          action: handleTouch,
          textColor: "text-slate-900 dark:text-slate-100",
          subTextColor: "text-slate-600 dark:text-slate-400",
        };
      case "result":
        return {
          text: result ? `${result.reactionTime}ms` : "측정 완료",
          subText: "훌륭합니다!",
          showIcon: false,
          action: noop,
          textColor: "text-slate-900 dark:text-slate-100",
          subTextColor: "text-slate-600 dark:text-slate-400",
        };
      case "early":
        return {
          text: "너무 빨리 터치했습니다!",
          subText: "스마일 아이콘이 나타난 후에 터치하세요",
          showIcon: false,
          action: noop,
          textColor: "text-slate-900 dark:text-slate-100",
          subTextColor: "text-slate-600 dark:text-slate-400",
        };
    }
  };

  const config = getStateConfig();

  return (
    <Pressable
      onPress={config.action}
      className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950"
    >
      <View className="flex-1 items-center justify-center px-4">
        {state === "ready" && (
          <DelayRender
            minDelay={1000}
            maxDelay={3000}
            onRender={handleDelayRender}
            shouldRestart={shouldRestart}
          >
            <View className="mb-8">
              <SvgWrapper>
                <SmileSvg />
              </SvgWrapper>
            </View>
          </DelayRender>
        )}

        {config.showIcon && state === "measuring" && (
          <View className="mb-8">
            <SvgWrapper>
              <SmileSvg />
            </SvgWrapper>
          </View>
        )}

        <Text
          className={`mb-4 text-center font-bold text-4xl ${config.textColor}`}
        >
          {config.text}
        </Text>

        {config.subText && (
          <Text className={`text-center text-lg ${config.subTextColor}`}>
            {config.subText}
          </Text>
        )}
      </View>

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
            className="h-14 w-full border border-slate-500 dark:border-slate-700"
            onPress={() => router.push("/menu")}
          >
            <ButtonText className="text-slate-700 dark:text-slate-300">
              메뉴로 돌아가기
            </ButtonText>
          </Button>
        </View>
      )}
    </Pressable>
  );
};

export default Measurement;
