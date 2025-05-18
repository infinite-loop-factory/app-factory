import { supabase } from "@/api/supabaseClient";
import { userAtom } from "@/atoms/userAtom";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { useSetAtom } from "jotai/react";
import { PawPrint } from "lucide-react-native";
import { View } from "react-native";

export default function AuthRequiredView() {
  const setUserInfo = useSetAtom(userAtom);

  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_WEB_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_IOS_ID,
  });

  const onPressGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (userInfo.data?.idToken) {
        const { data } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: userInfo.data.idToken,
        });

        const { session } = data;

        const { access_token, refresh_token, user } = session || {};

        setUserInfo(() => ({
          accessToken: access_token ?? "",
          refreshToken: refresh_token ?? "",
          email: user?.email ?? "",
          name: user?.user_metadata?.full_name ?? "",
          imageUrl: user?.user_metadata?.picture ?? "",
          id: user?.id ?? "",
        }));
      } else {
        throw new Error("no ID token present!");
      }
    } catch (error) {
      throw new Error(`Error: ${(error as Error).message}`);
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
