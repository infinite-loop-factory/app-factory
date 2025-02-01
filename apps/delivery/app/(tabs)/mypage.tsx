import { Button, ButtonText } from "@/components/ui/button";
import { useColorToken } from "@/features/shared/hooks/useThemeColor";
import { useUserStore } from "@/features/user/store/user.store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text } from "react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyPage() {
  const { user, logout } = useUserStore();
  const { typography } = useColorToken({
    typography: true,
    primary: true,
  });

  const router = useRouter();

  return (
    <SafeAreaView className={"flex-1 "}>
      {/*header*/}
      <View className={"flex flex-row items-center justify-between p-[16px]"}>
        <View>
          <Text className={"title-3 !font-extrabold"}>마이배민</Text>
        </View>

        <View className="flex flex-row items-center gap-5">
          <Ionicons name={"notifications"} size={24} color={typography} />
          <Ionicons name={"settings"} size={24} color={typography} />
        </View>
      </View>

      {/*  body */}
      <View className={"flex px-[16px]"}>
        <View className={"flex flex-row gap-[16px]"}>
          {/*image */}
          <View
            className={"min-h-[53px] min-w-[53px] rounded-full bg-primary"}
          />

          {/* 상태 */}
          <View className={"flex gap-[4px]"}>
            <View>
              {user ? (
                <View className={"flex flex-row gap-[8px]"}>
                  <Text className={"body-2"}>{user?.name}</Text>
                  <Button onPress={logout} size={"2xs"}>
                    <ButtonText>로그아웃</ButtonText>
                  </Button>
                </View>
              ) : (
                <View className={"flex flex-row gap-[4px]"}>
                  <Button
                    onPress={() => router.push("/auth/login")}
                    size={"2xs"}
                  >
                    <ButtonText>로그인</ButtonText>
                  </Button>
                  <Button
                    onPress={() => router.push("/auth/signup")}
                    size={"2xs"}
                  >
                    <ButtonText>회원가입</ButtonText>
                  </Button>
                </View>
              )}
            </View>
            <View className={"flex flex-row gap-[8px]"}>
              <Text className={"label-6"}>리뷰관리</Text>
              <Text className={"label-6"}>|</Text>
              <Text className={"label-6"}>주소관리</Text>
            </View>
          </View>
        </View>

        <View className={"min-h-[16px]"} />

        {/*  AD 영역*/}
        <View className={"rounded-xl border border-outline-300 p-[12px]"}>
          <Text className={"body-5 !font-extrabold"}>
            샤르르 소리까지 나는{" "}
            <Text className={"text-yellow-500"}>달달한</Text> 나의 배민 취향
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
