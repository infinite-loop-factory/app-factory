import * as Application from "expo-application";
import { LogOut } from "lucide-react-native";
import CustomSafeAreaView from "@/components/CustomSafeAreaView";
import HeaderBar from "@/components/HeaderBar";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useLogout } from "@/hooks/useLogout";

export default function SettingsScreen() {
  const { logout } = useLogout();

  return (
    <CustomSafeAreaView>
      <HeaderBar isShowBackButton={true} title={"설정하기"} />
      <VStack className="mt-3 gap-5 px-4">
        <VStack className="gap-3">
          <Text className="font-semibold text-slate-500" size="sm">
            계정
          </Text>
          <Button action="negative" onPress={logout} variant="outline">
            <ButtonIcon as={LogOut} className="h-5 w-5" />
            <ButtonText className="text-error-500">로그아웃</ButtonText>
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
