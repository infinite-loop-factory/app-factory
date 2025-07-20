import { Text, View } from "react-native";
import { formatDateTime } from "@/utils/date";

interface RecordData {
  id: string;
  created_at: string;
  result_value: number;
  unit: string;
}

interface RecordListProps<T extends RecordData> {
  records: T[];
  bestTime: number;
}

export const RecordList = <T extends RecordData>({
  records,
  bestTime,
}: RecordListProps<T>) => {
  const getBackgroundStyle = (isLowest: boolean, isNewest: boolean) => {
    if (isLowest) return "bg-red-50 dark:bg-red-950/20";
    if (isNewest) return "bg-green-50 dark:bg-green-950/20";
    return "";
  };

  const getCircleStyle = (isLowest: boolean, isNewest: boolean) => {
    if (isLowest) return "bg-red-100 dark:bg-red-900";
    if (isNewest) return "bg-green-100 dark:bg-green-900";
    return "bg-slate-100 dark:bg-slate-800";
  };

  const getTextStyle = (isLowest: boolean, isNewest: boolean) => {
    if (isLowest) return "text-red-700 dark:text-red-300";
    if (isNewest) return "text-green-700 dark:text-green-300";
    return "text-slate-600 dark:text-slate-400";
  };

  return (
    <View className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* 카드 헤더 */}
      <View className="border-slate-100 border-b p-4 dark:border-slate-800">
        <Text className="font-semibold text-lg text-slate-900 dark:text-slate-100">
          전체 기록 ({records.length}회)
        </Text>
      </View>

      {/* 기록 리스트 */}
      {records.map((record, index) => {
        const isNewest =
          records.length > 0 && record.created_at === records.at(0)?.created_at;
        const isLowest = record.result_value === bestTime;

        return (
          <View
            className={`flex-row items-center justify-between border-slate-100 border-b p-4 last:border-b-0 dark:border-slate-800 ${getBackgroundStyle(isLowest, isNewest)}`}
            key={record.id}
          >
            <View className="flex-row items-center">
              <View
                className={`mr-3 h-8 w-8 items-center justify-center rounded-full ${getCircleStyle(isLowest, isNewest)}`}
              >
                <Text
                  className={`font-medium text-sm ${getTextStyle(isLowest, isNewest)}`}
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
  );
};
