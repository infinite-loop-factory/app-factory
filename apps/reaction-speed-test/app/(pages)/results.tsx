import { Button, ButtonText } from "@/components/ui/button";
import { getRecords } from "@/services";
import { formatDateTime } from "@/utils/date";
import { supabase } from "@/utils/supabase";
import { useAsyncEffect } from "@reactuses/core";
import { noop } from "es-toolkit";
import { useRouter } from "expo-router";
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

  // records 데이터를 기반으로 한 통계 계산
  const bestTime =
    records.length > 0 ? Math.min(...records.map((r) => r.result_value)) : 0;
  const averageTime =
    records.length > 0
      ? Math.round(
          records.reduce((sum, r) => sum + r.result_value, 0) / records.length,
        )
      : 0;

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <SafeAreaView className="flex-1">
        <View className="relative items-center justify-center px-4 py-3">
          <Pressable
            onPress={() => router.back()}
            className="absolute left-4 p-2"
          >
            <Text className="text-slate-600 dark:text-slate-400">← 뒤로</Text>
          </Pressable>
          <Text className="font-bold text-slate-900 text-xl dark:text-slate-100">
            측정 기록
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mx-auto max-w-md px-4 py-6">
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
                      전체 기록 ({records.length}회)
                    </Text>
                  </View>

                  {/* 기록 리스트 */}
                  {records.map((record, index) => {
                    // 최신 기록과 최고 기록 판별
                    const isNewest =
                      records.length > 0 &&
                      record.created_at === records.at(0)?.created_at;
                    const isLowest = record.result_value === bestTime;

                    // 스타일 계산을 함수로 분리하여 복잡도 감소
                    const getBackgroundStyle = () => {
                      if (isLowest) return "bg-red-50 dark:bg-red-950/20";
                      if (isNewest) return "bg-green-50 dark:bg-green-950/20";
                      return "";
                    };

                    const getCircleStyle = () => {
                      if (isLowest) return "bg-red-100 dark:bg-red-900";
                      if (isNewest) return "bg-green-100 dark:bg-green-900";
                      return "bg-slate-100 dark:bg-slate-800";
                    };

                    const getTextStyle = () => {
                      if (isLowest) return "text-red-700 dark:text-red-300";
                      if (isNewest) return "text-green-700 dark:text-green-300";
                      return "text-slate-600 dark:text-slate-400";
                    };

                    return (
                      <View
                        key={record.id}
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
                              {record.result_value}
                              {record.unit}
                            </Text>
                            <Text className="text-slate-500 text-sm dark:text-slate-500">
                              {formatDateTime(record.created_at, "Asia/Seoul")}
                            </Text>
                          </View>
                        </View>
                        <View>
                          {isLowest && (
                            <View className="rounded-full bg-red-100 px-2 py-1 dark:bg-red-900">
                              <Text className="text-red-700 text-xs dark:text-red-300">
                                최고기록
                              </Text>
                            </View>
                          )}
                          {isNewest && (
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
