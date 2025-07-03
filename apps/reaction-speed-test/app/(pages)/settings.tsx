import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import type { FC } from "react";
import { Text, View } from "react-native";

const Settings: FC = () => {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="mb-5 text-2xl text-typography-900 dark:text-typography-50">
        설정 페이지
      </Text>
      <Button action="secondary" onPress={() => router.back()}>
        <ButtonText>뒤로 가기</ButtonText>
      </Button>
    </View>
  );
};

export default Settings;
