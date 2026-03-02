import * as Application from "expo-application";
import { useAtomValue } from "jotai";
import { LogOut, UserX } from "lucide-react-native";
import { Alert } from "react-native";
import { useDeleteUser } from "@/api/reactQuery/users/useDeleteUser";
import { userAtom } from "@/atoms/userAtom";
import CustomSafeAreaView from "@/components/CustomSafeAreaView";
import HeaderBar from "@/components/HeaderBar";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useLogout } from "@/hooks/useLogout";

export default function SettingsScreen() {
  const { logout } = useLogout();
  const userInfo = useAtomValue(userAtom);
  const { mutateAsync: deleteUser } = useDeleteUser();

  const handleDeleteAccount = () => {
    Alert.alert(
      "회원 탈퇴",
      "정말 탈퇴하시겠어요?\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "탈퇴하기",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUser(userInfo.id);
              await logout();
            } catch {
              Alert.alert(
                "오류",
                "탈퇴 처리 중 문제가 발생했습니다. 다시 시도해주세요.",
              );
            }
          },
        },
      ],
    );
  };

  return (
    <CustomSafeAreaView>
      <HeaderBar isShowBackButton={true} title={"설정하기"} />
      <VStack className="mt-3 gap-5 px-4">
        <VStack className="gap-3">
          <Text className="font-semibold text-slate-500" size="sm">
            계정
          </Text>
          <Button onPress={logout} variant="outline">
            <ButtonIcon as={LogOut} className="h-5 w-5" />
            <ButtonText>로그아웃</ButtonText>
          </Button>
          <Button
            action="negative"
            onPress={handleDeleteAccount}
            variant="outline"
          >
            <ButtonIcon as={UserX} className="h-5 w-5" />
            <ButtonText className="text-error-500">회원 탈퇴</ButtonText>
          </Button>
        </VStack>
        <VStack className="gap-3">
          <Text className="font-semibold text-slate-500" size="sm">
            앱 정보
          </Text>
          <Text>버전 {Application.nativeApplicationVersion}</Text>
        </VStack>
      </VStack>
    </CustomSafeAreaView>
  );
}
