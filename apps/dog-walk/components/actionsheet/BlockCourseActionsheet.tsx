import { router } from "expo-router";
import { useAtomValue } from "jotai";
import { AlertTriangle } from "lucide-react-native";
import { View } from "react-native";
import { useInsertBlockCourse } from "@/api/reactQuery/block/useInsertBlockCourse";
import { userAtom } from "@/atoms/userAtom";
import { getGlobalHandleToast } from "../CustomToast";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "../ui/actionsheet";
import { Button, ButtonText } from "../ui/button";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface BlockCourseActionsheetProps {
  showActionsheet: boolean;
  setShowActionsheet: React.Dispatch<React.SetStateAction<boolean>>;
  courseId: number;
}

export default function BlockCourseActionsheet({
  showActionsheet,
  setShowActionsheet,
  courseId,
}: BlockCourseActionsheetProps) {
  const userInfo = useAtomValue(userAtom);

  const { mutateAsync: insertBlockedCourse } = useInsertBlockCourse();

  const handleClose = () => {
    setShowActionsheet(false);
  };

  const handleBlock = async () => {
    try {
      const id = await insertBlockedCourse({
        courseId,
        userId: userInfo.id,
      });

      if (id) {
        setShowActionsheet(false);
        getGlobalHandleToast("차단이 완료되었습니다.");
        router.back();
      }
    } catch {
      getGlobalHandleToast("차단에 실패했습니다.");
    }
  };

  return (
    <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper className="pb-5">
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <VStack className="items-center gap-4">
          <View className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <Icon as={AlertTriangle} className="h-8 w-8 text-red-500" />
          </View>

          <Text className="text-center font-bold text-slate-900" size="xl">
            이 코스를 차단하시겠습니까?
          </Text>

          <VStack className="items-center gap-2 rounded-xl bg-slate-50 p-4">
            <Text className="text-red-600" size="sm">
              차단하면 다시는 볼 수 없습니다.
            </Text>
            <Text className="text-center text-slate-500" size="xs">
              차단된 코스는 검색 결과와 추천 목록에서 제외되며, 이 작업은 되돌릴
              수 없습니다.
            </Text>
          </VStack>

          <HStack className="gap-1">
            <Button
              className="flex-1 rounded-xl"
              onPress={handleClose}
              size="lg"
              variant="outline"
            >
              <ButtonText>취소</ButtonText>
            </Button>
            <Button
              action="negative"
              className="flex-1 rounded-xl"
              onPress={handleBlock}
              size="lg"
            >
              <ButtonText>차단하기</ButtonText>
            </Button>
          </HStack>
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
}
