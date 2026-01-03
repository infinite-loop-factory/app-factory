import { Inbox } from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface EmptyDataProps {
  title?: string;
  description?: string;
}

export default function EmptyData({ title, description }: EmptyDataProps) {
  return (
    <VStack className="items-center justify-center gap-6">
      <View className="relative">
        <View className="h-24 w-24 items-center justify-center rounded-full bg-slate-100">
          <Icon as={Inbox} className="h-12 w-12 text-slate-300" />
        </View>
        <View className="absolute -right-1 -bottom-1 h-8 w-8 items-center justify-center rounded-full border-2 border-slate-100 bg-white">
          <Text>😢</Text>
        </View>
      </View>

      <VStack className="gap-2">
        <Text className="text-center font-bold text-slate-900" size="xl">
          {title ?? "산책 코스가 없습니다"}
        </Text>
        <Text className="text-center text-slate-500">
          {description ?? "아직 산책 코스가 없습니다."}
        </Text>
      </VStack>
    </VStack>
  );
}
