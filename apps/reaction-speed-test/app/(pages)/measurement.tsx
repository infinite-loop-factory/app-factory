import SmileSvg from "@/components/measurement/SmileSvg";
import SvgWrapper from "@/components/measurement/SvgWrapper";
import { Button, ButtonText } from "@/components/ui/button";
import { useReactionTimer } from "@/hooks/useReactionTimer";
import { DelayRender } from "@/utils/DelayRender";
import { Stack, useRouter } from "expo-router";
import { type FC, useState } from "react";
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
      <View className="flex-1 items-center justify-center gap-y-5">
        <Stack.Screen options={{ title: "측정 페이지", headerShown: false }} />

        <View className="flex items-center">
          <Text className="text-2xl">이미지가 나타나면</Text>
          <Text className="text-2xl">화면을 터치해주세요</Text>
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
            <Text className="text-lg">반응 시간: {result.reactionTime}ms</Text>
          )}
          {earlyPress && !result && (
            <Text className="text-red-500">너무 빨리 터치했습니다!</Text>
          )}
        </View>

        <View className="h-24 justify-end gap-y-2">
          {result && (
            <>
              <Button className="w-40 bg-blue-500" onPress={handleReset}>
                <ButtonText>다시하기</ButtonText>
              </Button>
              <Button
                className="w-40 bg-slate-500"
                onPress={() => router.push("/")}
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
