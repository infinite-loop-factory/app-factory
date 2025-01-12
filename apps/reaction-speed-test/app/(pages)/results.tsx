import { Button, ButtonText } from "@/components/ui/button";
import { supabase } from "@/utils/supabase";
import { Stack, useRouter } from "expo-router";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { Alert, AppState, Text, View } from "react-native";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const Results: FC = () => {
  const router = useRouter();
  // ⚠️ FIXME: test와 getTestTable 함수 수정
  const [test, setTest] = useState<string>("");

  useEffect(() => {
    getTestTable();
  }, []);

  async function getTestTable() {
    try {
      const { data, error, status } = await supabase.from("test").select("*");
      // console.log("data", data, error, status);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setTest(data[1].test);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    }
  }

  return (
    <View className="flex-1 items-center justify-center">
      <Stack.Screen options={{ title: "기록 페이지", headerShown: false }} />
      <Text className="mb-5 text-2xl dark:text-gray-50">기록 페이지</Text>
      <Button className="bg-slate-500" onPress={() => router.back()}>
        <ButtonText>뒤로 가기</ButtonText>
        <ButtonText>{test}</ButtonText>
      </Button>
    </View>
  );
};

export default Results;
