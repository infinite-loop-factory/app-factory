import { Button, ButtonText } from "@/components/ui/button";
import { getRecords } from "@/services";
import { supabase } from "@/utils/supabase";
import { useAsyncEffect } from "@reactuses/core";
import { noop } from "es-toolkit";
import { Stack, useRouter } from "expo-router";
import type { FC } from "react";
import { useState } from "react";
import { Alert, AppState, ScrollView, Text, View } from "react-native";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

interface Record {
  id: string;
  created_at: string;
  result_value: number;
  unit: string;
}

const formatDateTime = (dateTimeString: string) => {
  const [date, time] = dateTimeString.split("T");
  const formattedDate = date?.replace(/-/g, ". ");
  const formattedTime = time?.substring(0, 8);

  return `${formattedDate} ${formattedTime}`;
};

const Results: FC = () => {
  const router = useRouter();
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  useAsyncEffect(
    async () => {
      try {
        const data = await getRecords();
        setRecords(data);
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert(error.message);
        } else {
          Alert.alert("데이터를 불러오는데 실패했습니다");
        }
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    noop,
    [],
  );

  return (
    <ScrollView>
      <View className="flex-1 items-center justify-center">
        <Stack.Screen options={{ title: "기록 페이지", headerShown: false }} />
        <Text className="mb-5 text-2xl dark:text-gray-50">기록 페이지</Text>
        {loading ? (
          <Text className="dark:text-gray-50">로딩 중...</Text>
        ) : (
          <View className="w-full px-4">
            {records.map((record) => (
              <View
                key={record.id}
                className="mb-3 rounded bg-gray-100 p-3 dark:bg-gray-800"
              >
                <Text className="text-sm dark:text-gray-300">
                  {formatDateTime(record.created_at)}
                </Text>
                <Text className="font-semibold text-lg dark:text-gray-50">
                  {`결과값: ${record.result_value}${record.unit}`}
                </Text>
              </View>
            ))}
          </View>
        )}
        <Button className="bg-slate-500" onPress={() => router.back()}>
          <ButtonText>뒤로 가기</ButtonText>
        </Button>
      </View>
    </ScrollView>
  );
};

export default Results;
