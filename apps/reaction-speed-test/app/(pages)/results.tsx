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
import {
  Alert,
  AppState,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

// TODO: 추후 추가할 기능 - 실제 데이터를 위한 임시 목업 데이터
const mockResults = [
  { id: 1, time: 245, date: "2024-01-15 14:30:25", isBest: true },
  { id: 2, time: 312, date: "2024-01-15 14:28:15", isLatest: false },
  { id: 3, time: 289, date: "2024-01-15 14:25:10", isLatest: false },
  { id: 4, time: 356, date: "2024-01-15 14:22:05", isLatest: false },
  { id: 5, time: 278, date: "2024-01-15 14:20:30", isLatest: false },
].map((item, index) => ({
  ...item,
  isLatest: index === 0,
}));

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

  // v0 스타일의 통계 계산
  const bestTime =
    mockResults.length > 0 ? Math.min(...mockResults.map((r) => r.time)) : 0;
  const averageTime =
    mockResults.length > 0
      ? Math.round(
          mockResults.reduce((sum, r) => sum + r.time, 0) / mockResults.length,
        )
      : 0;

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
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1">
          <View className="mx-auto max-w-md px-4 py-8">
            {/* 헤더 */}
            <View className="mb-6 flex-row items-center justify-between">
              <Pressable onPress={() => router.back()} className="p-2">
                <Text className="text-slate-600 dark:text-slate-400">
                  ← 뒤로
                </Text>
              </Pressable>
              <Text className="font-bold text-slate-900 text-xl dark:text-slate-100">
                측정 기록
              </Text>
              <View className="w-10" />
            </View>

            <Stack.Screen options={{ title: "기록", headerShown: false }} />

            {loading ? (
              <View className="items-center py-12">
                <Text className="text-slate-600 dark:text-slate-400">
                  로딩 중...
                </Text>
              </View>
            ) : (
              <>
                {/* 통계 카드 */}
                <View className="mb-6 flex-row gap-x-4">
                  <View className="flex-1 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <Text className="text-center font-bold text-2xl text-green-600 dark:text-green-400">
                      {bestTime}ms
                    </Text>
                    <Text className="text-center text-slate-600 text-sm dark:text-slate-400">
                      최고 기록
                    </Text>
                  </View>
                  <View className="flex-1 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <Text className="text-center font-bold text-2xl text-slate-900 dark:text-slate-100">
                      {averageTime}ms
                    </Text>
                    <Text className="text-center text-slate-600 text-sm dark:text-slate-400">
                      평균 기록
                    </Text>
                  </View>
                </View>

                {/* 기록 목록 */}
                <View className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                  {/* 카드 헤더 */}
                  <View className="border-slate-100 border-b p-4 dark:border-slate-800">
                    <Text className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                      전체 기록 ({mockResults.length}회)
                    </Text>
                  </View>

                  {/* 기록 리스트 */}
                  {mockResults.map((result, index) => {
                    // 스타일 계산을 함수로 분리하여 복잡도 감소
                    const getBackgroundStyle = () => {
                      if (result.isBest) return "bg-red-50 dark:bg-red-950/20";
                      if (result.isLatest)
                        return "bg-green-50 dark:bg-green-950/20";
                      return "";
                    };

                    const getCircleStyle = () => {
                      if (result.isBest) return "bg-red-100 dark:bg-red-900";
                      if (result.isLatest)
                        return "bg-green-100 dark:bg-green-900";
                      return "bg-slate-100 dark:bg-slate-800";
                    };

                    const getTextStyle = () => {
                      if (result.isBest)
                        return "text-red-700 dark:text-red-300";
                      if (result.isLatest)
                        return "text-green-700 dark:text-green-300";
                      return "text-slate-600 dark:text-slate-400";
                    };

                    return (
                      <View
                        key={result.id}
                        className={`flex-row items-center justify-between border-slate-100 border-b p-4 last:border-b-0 dark:border-slate-800 ${getBackgroundStyle()}`}
                      >
                        <View className="flex-row items-center">
                          <View
                            className={`mr-3 h-8 w-8 items-center justify-center rounded-full ${getCircleStyle()}`}
                          >
                            <Text
                              className={`font-medium text-sm ${getTextStyle()}`}
                            >
                              {index + 1}
                            </Text>
                          </View>
                          <View>
                            <Text className="font-mono font-semibold text-lg text-slate-900 dark:text-slate-100">
                              {result.time}ms
                            </Text>
                            <Text className="text-slate-500 text-sm dark:text-slate-500">
                              {result.date}
                            </Text>
                          </View>
                        </View>
                        <View>
                          {result.isBest && (
                            <View className="rounded-full bg-red-100 px-2 py-1 dark:bg-red-900">
                              <Text className="text-red-700 text-xs dark:text-red-300">
                                최고기록
                              </Text>
                            </View>
                          )}
                          {result.isLatest && (
                            <View className="rounded-full bg-green-100 px-2 py-1 dark:bg-green-900">
                              <Text className="text-green-700 text-xs dark:text-green-300">
                                최신기록
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>

                {/* 기존 데이터 표시 (숨김 처리) */}
                <View className="h-0 overflow-hidden opacity-0">
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
                            "bg-accent-start text-typography-900 dark:bg-accent-start dark:text-typography-900",
                          isLowest &&
                            "bg-accent-stop text-typography-900 dark:bg-accent-stop dark:text-typography-900",
                          isDefault &&
                            "bg-secondary-300 text-typography-900 dark:bg-secondary-700 dark:text-typography-100",
                        )}
                      >
                        <Text className="font-mono text-sm tracking-tighter">
                          {formatDateTime(record.created_at, "Asia/Seoul")}
                        </Text>
                        <Text className="font-mono font-semibold text-lg tracking-tighter">
                          {getResultText(record, { isNewest, isLowest })}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </>
            )}

            {/* 하단 버튼 */}
            <View className="mt-6 gap-y-3">
              <Button
                action="primary"
                className="h-12 w-full bg-slate-900 dark:bg-slate-100"
                onPress={() => router.push("/measurement")}
              >
                <ButtonText className="text-slate-100 dark:text-slate-900">
                  다시 측정하기
                </ButtonText>
              </Button>
              <Button
                action="secondary"
                className="w-full border-slate-300 dark:border-slate-700"
                onPress={() => router.push("/menu")}
              >
                <ButtonText className="text-slate-700 dark:text-slate-300">
                  메뉴로 돌아가기
                </ButtonText>
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Results;
