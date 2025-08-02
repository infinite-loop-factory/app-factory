import type { FC } from "react";

import { useAsyncEffect } from "@reactuses/core";
import { noop } from "es-toolkit";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RecordList, RecordStatistics } from "@/components/results";
import { Button, ButtonText } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useAuthAwareNavigation } from "@/hooks/useAuthAwareNavigation";
import { useRecordStatistics } from "@/hooks/useRecordStatistics";
import { getRecords } from "@/services";

interface Record {
  id?: string;
  created_at?: string;
  result_value: number;
  unit: string;
  reaction_time?: number;
}

const Results: FC = () => {
  const { user } = useAuth();
  const { navigateBackWithFallback, navigateToMenu } = useAuthAwareNavigation();
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const { bestTime, averageTime } = useRecordStatistics(records);

  useAsyncEffect(
    async () => {
      try {
        if (!user?.id) {
          return;
        }
        const data = await getRecords(user.id);
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
    [user?.id],
  );

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <SafeAreaView className="flex-1">
        <View className="relative items-center justify-center px-4 py-3">
          <Pressable
            className="absolute left-4 p-2"
            onPress={() => navigateBackWithFallback("/menu")}
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
            {loading ? (
              <View className="items-center py-12">
                <Text className="text-slate-600 dark:text-slate-400">
                  로딩 중...
                </Text>
              </View>
            ) : (
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
                onPress={() => navigateBackWithFallback("/measurement")}
              >
                <ButtonText className="text-slate-100 dark:text-slate-900">
                  다시 측정하기
                </ButtonText>
              </Button>
              <Button
                action="secondary"
                className="h-14 w-full border border-slate-500 dark:border-slate-700"
                onPress={navigateToMenu}
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
