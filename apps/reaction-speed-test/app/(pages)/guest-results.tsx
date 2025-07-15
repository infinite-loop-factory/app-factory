import type { FC } from "react";

import { useAsyncEffect } from "@reactuses/core";
import { noop } from "es-toolkit";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  EmptyRecords,
  RecordList,
  RecordStatistics,
} from "@/components/results";
import { Button, ButtonText } from "@/components/ui/button";
import { useRecordStatistics } from "@/hooks/useRecordStatistics";
import { getLocalRecords, type LocalRecord } from "@/services/localRecords";

const GuestResults: FC = () => {
  const router = useRouter();
  const [records, setRecords] = useState<LocalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { bestTime, averageTime } = useRecordStatistics(records);

  useAsyncEffect(
    async () => {
      try {
        const data = await getLocalRecords();
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
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <Stack.Screen options={{ title: "게스트 기록", headerShown: false }} />
      <SafeAreaView className="flex-1">
        <View className="relative items-center justify-center px-4 py-3">
          <Pressable
            className="absolute left-4 p-2"
            onPress={() => router.back()}
          >
            <Text className="text-slate-600 dark:text-slate-400">← 뒤로</Text>
          </Pressable>
          <Text className="font-bold text-slate-900 text-xl dark:text-slate-100">
            측정 기록
          </Text>
        </View>

        <ScrollView
          bounces={false}
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
        >
          <View className="mx-auto max-w-md px-4 py-6">
            {/* 로그인 권유 메시지 */}
            <View className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
              <Text className="text-center text-blue-700 text-sm dark:text-blue-300">
                💡 로그인하시면 기록이 클라우드에 저장되어{"\n"}다른 기기에서도
                확인할 수 있습니다
              </Text>
            </View>

            {loading && (
              <View className="items-center py-12">
                <Text className="text-slate-600 dark:text-slate-400">
                  로딩 중...
                </Text>
              </View>
            )}

            {!loading && records.length === 0 && <EmptyRecords />}

            {!loading && records.length > 0 && (
              <>
                <RecordStatistics
                  averageTime={averageTime}
                  bestTime={bestTime}
                />
                <RecordList bestTime={bestTime} records={records} />
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
                className="h-14 w-full border border-slate-500 dark:border-slate-700"
                onPress={() => router.push("/guest-menu")}
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

export default GuestResults;
