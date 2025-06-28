import { Text, View } from "react-native";

interface RecordStatisticsProps {
  bestTime: number;
  averageTime: number;
}

export const RecordStatistics = ({
  bestTime,
  averageTime,
}: RecordStatisticsProps) => {
  return (
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
  );
};
