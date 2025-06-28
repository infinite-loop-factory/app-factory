import { Text, View } from "react-native";

export const EmptyRecords = () => {
  return (
    <View className="items-center py-12">
      <Text className="mb-4 text-center text-lg text-slate-600 dark:text-slate-400">
        아직 측정 기록이 없습니다
      </Text>
      <Text className="text-center text-slate-500 text-sm dark:text-slate-500">
        첫 번째 반응 속도를 측정해보세요!
      </Text>
    </View>
  );
};
