import SmileSvg from "@/components/measurement/SmileSvg";
import SvgWrapper from "@/components/measurement/SvgWrapper";
import { Button, ButtonText } from "@/components/ui/button";
import { useReactionTimer } from "@/hooks/useReactionTimer";
import { DelayRender } from "@/utils/DelayRender";
import { Stack, useRouter } from "expo-router";
import type { FC } from "react";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const Measurement: FC = () => {
  const router = useRouter();
  const { result, start, stop, reset, earlyPress } = useReactionTimer();
  const [shouldRestart, setShouldRestart] = useState(false);

  const handlePress = () => {
    if (result) return;

    const timeResult = stop();
    if (!timeResult) {
      // early press인 경우
      setShouldRestart(true); // 재시작 트리거
      setTimeout(() => {
        setShouldRestart(false);
      }, 100); // 짧은 지연으로 재시작 트리거 초기화
    }
  };

  const handleReset = () => {
    reset();
    setShouldRestart(true);
    setTimeout(() => {
      setShouldRestart(false);
    }, 100);
  };

  return (
    <Pressable onPress={handlePress} className="flex-1">
      <View className="flex-1 items-center justify-center gap-y-5 bg-gray-50 dark:bg-gray-900">
        <Stack.Screen options={{ title: "측정 페이지", headerShown: false }} />

        <View className="flex items-center">
          <Text className="font-medium text-2xl text-gray-900 dark:text-gray-50">
            이미지가 나타나면
          </Text>
          <Text className="font-medium text-2xl text-gray-900 dark:text-gray-50">
            화면을 터치해주세요
          </Text>
        </View>

        <View className="h-32 w-32 items-center justify-center">
          <DelayRender
            minDelay={1000}
            maxDelay={3000}
            onRender={start}
            shouldRestart={shouldRestart}
          >
            <SvgWrapper>
              <SmileSvg />
            </SvgWrapper>
          </DelayRender>
        </View>

        <View className="h-8 items-center justify-center">
          {result && (
            <Text className="font-semibold text-gray-800 text-lg dark:text-gray-200">
              반응 시간: {result.reactionTime}ms
            </Text>
          )}
          {earlyPress && !result && (
            <Text className="font-medium text-red-500">
              너무 빨리 터치했습니다!
            </Text>
          )}
        </View>

        <View className="h-24 justify-end gap-y-2">
          {result && (
            <>
              <Button action="primary" className="w-40" onPress={handleReset}>
                <ButtonText>다시하기</ButtonText>
              </Button>
              <Button
                action="secondary"
                className="w-40"
                onPress={() => router.push("/menu")}
              >
                <ButtonText>홈으로 가기</ButtonText>
              </Button>
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default Measurement;
