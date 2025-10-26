import type { GestureResponderEvent } from "react-native";

import { useAtomValue } from "jotai";
import { Star } from "lucide-react-native";
import { useHasUserReviewed } from "@/api/reactQuery/review/useHasUserReviewed";
import { userAtom } from "@/atoms/userAtom";
import { Button, ButtonText } from "../ui/button";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface ReviewScoreCardProps {
  courseId: number;
  rate: number;
  count: number;
  starIconColor: string;
  onPressReviewWrite: (event: GestureResponderEvent) => void;
}

export default function ReviewScoreCard({
  courseId,
  rate,
  count,
  starIconColor,
  onPressReviewWrite,
}: ReviewScoreCardProps) {
  const userInfo = useAtomValue(userAtom);

  const { data: hasUserReviewedData = true } = useHasUserReviewed(
    courseId,
    userInfo.id,
  );

  return (
    <HStack className="items-center justify-between rounded-xl bg-slate-50 p-4">
      <VStack className="items-center gap-1">
        <Text className="font-bold text-primary-600" size="2xl">
          {rate.toFixed(1)}
        </Text>
        <HStack className="mb-1 items-center justify-center">
          {[...Array(5)].map((_, i) => (
            <Icon
              as={Star}
              className={`h-4 w-4 ${i < Math.floor(rate) ? "text-primary-500" : "text-slate-300"}`}
              fill={i < Math.floor(rate) ? `rgb(${starIconColor})` : ""}
              key={`rate_${i}_${rate}`}
            />
          ))}
        </HStack>
        <Text className="text-slate-500" size="xs">
          {count}개 리뷰
        </Text>
      </VStack>
      {!hasUserReviewedData && (
        <Button onPress={onPressReviewWrite}>
          <ButtonText>리뷰 작성</ButtonText>
        </Button>
      )}
    </HStack>
  );
}
