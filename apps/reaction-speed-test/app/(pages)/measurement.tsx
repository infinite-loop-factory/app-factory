import { Button, ButtonText } from "@/components/ui/button";
import { Stack, useRouter } from "expo-router";
import type { FC } from "react";
import { Text, View } from "react-native";

const Measurement: FC = () => {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center">
      <Stack.Screen options={{ title: "측정 페이지", headerShown: false }} />
      <Text className="mb-5 text-2xl">측정 페이지</Text>
      <Button className="bg-slate-500" onPress={() => router.back()}>
        <ButtonText>뒤로 가기</ButtonText>
      </Button>
    </View>
  );
};

export default Measurement;
