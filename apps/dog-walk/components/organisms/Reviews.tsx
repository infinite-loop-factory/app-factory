import { MessageSquare, Star } from "lucide-react-native";
import { View } from "react-native";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

export default function Reviews() {
  return (
    <VStack className="items-center justify-center gap-4 py-10">
      <View className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-500/10">
        <Icon as={MessageSquare} className="h-8 w-8 text-primary-500" />
      </View>
      <VStack className="items-center">
        <Text className="font-medium text-lg">아직 리뷰가 없어요</Text>
        <Text className="text-center text-slate-500 text-sm">
          첫 번째 리뷰를 작성해보세요.
        </Text>
        <Text className="text-center text-slate-500 text-sm">
          다른 댕댕이들에게 도움이 될 거예요!
        </Text>
      </VStack>
      <HStack className="items-center justify-center">
        {[1, 2, 3, 4, 5].map((item) => (
          <Icon
            key={`star_${item}`}
            as={Star}
            className="h-6 w-6 text-yellow-400"
          />
        ))}
      </HStack>
    </VStack>
  );
}
