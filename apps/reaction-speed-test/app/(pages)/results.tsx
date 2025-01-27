import { Button, ButtonText } from "@/components/ui/button";
import { getRecords } from "@/services";
import { formatDateTime } from "@/utils/date";
import { supabase } from "@/utils/supabase";
import { cn } from "@infinite-loop-factory/common";
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

interface RecordStatus {
  isNewest: boolean;
  isLowest: boolean;
}

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

  const getResultText = (
    record: Record,
    { isNewest, isLowest }: RecordStatus,
  ): string => {
    const baseText = `결과값: ${record.result_value}${record.unit}`;

    if (isNewest) return `${baseText} | 최근 기록`;
    if (isLowest) return `${baseText} | 최단 기록`;
    return baseText;
  };

  return (
    <ScrollView>
      <View className="my-8 flex-1 items-center justify-center">
        <Stack.Screen options={{ title: "기록 페이지", headerShown: false }} />
        <Text className="mb-5 text-2xl dark:text-gray-50">기록 페이지</Text>
        {loading ? (
          <Text className="dark:text-gray-50">로딩 중...</Text>
        ) : (
          <View className="w-full max-w-[20rem] px-4">
            {records.map((record) => {
              const isNewest =
                records.length > 0 &&
                record.created_at === records.at(0)?.created_at;
              const lowestValue = Math.min(
                ...records.map((r) => r.result_value),
              );
              const isLowest = record.result_value === lowestValue;
              const isDefault = !(isNewest || isLowest);

              return (
                <View
                  key={record.id}
                  className={cn(
                    "mb-3 rounded p-3",
                    isNewest &&
                      "bg-yellow-300 dark:bg-yellow-300 dark:text-gray-950",
                    isLowest && "bg-red-300 dark:bg-red-300 dark:text-gray-950",
                    isDefault &&
                      "bg-blue-300 dark:bg-blue-300 dark:text-gray-950",
                  )}
                >
                  <Text className="text-sm dark:text-gray-950">
                    {formatDateTime(record.created_at, "Asia/Seoul")}
                  </Text>
                  <Text className="font-semibold text-lg dark:text-gray-950">
                    {getResultText(record, { isNewest, isLowest })}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
        <Button className="mt-8 bg-slate-500" onPress={() => router.back()}>
          <ButtonText>뒤로 가기</ButtonText>
        </Button>
      </View>
    </ScrollView>
  );
};

export default Results;
