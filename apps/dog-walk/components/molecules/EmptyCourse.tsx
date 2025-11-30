import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { useRouter } from "expo-router";
import { MapPin } from "lucide-react-native";
import { View } from "react-native";
import { Button, ButtonText } from "../ui/button";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface EmptyCourseProps {
  size?: "md" | "sm";
}

export default function EmptyCourse({ size = "sm" }: EmptyCourseProps) {
  const router = useRouter();

  const IconWrapperStyle = tva({
    variants: {
      variant: {
        sm: "h-10 w-10 items-center justify-center rounded-full bg-primary-300/10",
        md: "h-16 w-16 items-center justify-center rounded-full bg-primary-300/10",
      },
    },
    defaultVariants: {
      variant: "sm",
    },
  });

  const IconStyle = tva({
    variants: {
      variant: {
        sm: "h-6 w-6 text-primary-300",
        md: "h-10 w-10 text-primary-300",
      },
    },
    defaultVariants: {
      variant: "sm",
    },
  });

  return (
    <VStack className="w-full items-center justify-center gap-2">
      <View className={IconWrapperStyle({ variant: size })}>
        <Icon as={MapPin} className={IconStyle({ variant: size })} />
      </View>

      <VStack className="flex-1 items-center gap-1">
        <Text className="text-slate-900" size={size}>
          추천 산책 코스가 없습니다
        </Text>
        <Text className="text-center text-slate-500" size={size}>
          코스를 등록하고 다른 반려견 주인들과 공유해보세요!
        </Text>
      </VStack>

      <Button
        onPress={() => router.push("/(tabs)/add")}
        size={size === "sm" ? "xs" : "sm"}
      >
        <ButtonText>산책 코스 등록하러 가기</ButtonText>
      </Button>
    </VStack>
  );
}
