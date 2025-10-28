import { MessageSquare } from "lucide-react-native";
import { type GestureResponderEvent, View } from "react-native";
import { Button, ButtonText } from "../ui/button";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface ReviewEmptyStateProps {
  onPressReviewWrite: (event: GestureResponderEvent) => void;
}

export default function ReviewEmptyState({
  onPressReviewWrite,
}: ReviewEmptyStateProps) {
  return (
    <VStack className="items-center justify-center gap-4 py-6">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-500/10">
        <Icon as={MessageSquare} className="h-8 w-8 text-primary-500" />
      </View>
      <VStack className="items-center">
        <Text className="font-medium text-lg">아직 리뷰가 없어요</Text>
        <Text className="text-center text-slate-500 text-sm">
          {"첫 번째 리뷰를 작성해보세요.\n다른 댕댕이들에게 도움이 될 거예요!"}
        </Text>
      </VStack>
      <Button onPress={onPressReviewWrite}>
        <ButtonText>리뷰하러 가기</ButtonText>
      </Button>
    </VStack>
  );
}
