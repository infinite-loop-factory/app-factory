import { useFindUserById } from "@/api/reactQuery/users/useFindUserById";
import { userAtom } from "@/atoms/userAtom";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { useAtom } from "jotai/react";
import { PawPrint } from "lucide-react-native";
import { View } from "react-native";

export default function AuthRequiredView() {
  const [userInfo, setUserInfo] = useAtom(userAtom);

  const { handleLogin, handleSignup } = useGoogleAuth();

  const { refetch: refetchFindUserById } = useFindUserById(userInfo.id);

  const onPressGoogleLogin = async () => {
    try {
      const userData = await handleLogin();

      setUserInfo(() => userData);

      const { data: existingUser } = await refetchFindUserById();

      if (!existingUser) {
        handleSignup({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          profileImageUrl: userData.imageUrl,
        });
      }
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-6">
      <View className="w-full max-w-md">
        <View className="flex flex-col items-center px-6 pt-6 pb-8 text-center">
          <View className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary-500/10">
            <Icon className="h-12 w-12 text-primary-500" as={PawPrint} />
          </View>
          <Text className="mb-2 font-bold" size="2xl">
            로그인이 필요합니다
          </Text>
          <Text className="mb-6 text-slate-500">
            프로필을 보고 다양한 기능을 이용하려면 로그인해 주세요. 로그인하면
            나만의 산책 코스를 만들고 관리할 수 있어요!
          </Text>
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={onPressGoogleLogin}
          />
        </View>
      </View>
    </View>
  );
}
