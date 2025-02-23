import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useColorToken } from "@/features/shared/hooks/useThemeColor";
import { useUserStore } from "@/features/user/store/user.store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
      <Box className={"flex flex-row items-center justify-between p-[16px]"}>
        <Box>
          <Text size={"xl"}>마이배민</Text>
        </Box>

        <Box className="flex flex-row items-center gap-5">
          <Ionicons name={"notifications"} size={24} color={typography} />
          <Ionicons name={"settings"} size={24} color={typography} />
        </Box>
      </Box>

      {/*  body */}
      <Box className={"flex px-[16px]"}>
        <Box className={"flex flex-row gap-[16px]"}>
          {/*image */}
          <Box
            className={"min-h-[53px] min-w-[53px] rounded-full bg-primary"}
          />

          {/* 상태 */}
          <Box className={"flex gap-[4px]"}>
            <Box>
              {user ? (
                <HStack className={"items-center"} space={"md"}>
                  <Text className={"body-2"}>{user?.name}</Text>
                  <Button
                    className={"text-white"}
                    onPress={logout}
                    size={"2xs"}
                  >
                    <ButtonText>로그아웃</ButtonText>
                  </Button>
                </HStack>
              ) : (
                <Box className={"flex flex-row gap-[4px]"}>
                  <Button
                    onPress={() => router.push("/auth/login")}
                    size={"2xs"}
                  >
                    <ButtonText className={"text-white"}>로그인</ButtonText>
                  </Button>
                  <Button
                    onPress={() => router.push("/auth/signup")}
                    size={"2xs"}
                  >
                    <ButtonText className={"text-white"}>회원가입</ButtonText>
                  </Button>
                </Box>
              )}
            </Box>
            <Box className={"flex flex-row gap-[8px]"}>
              <Text className={"label-6"}>리뷰관리</Text>
              <Text className={"label-6"}>|</Text>
              <Text className={"label-6"}>주소관리</Text>
              <Button onPress={() => router.push("/map")} size={"2xs"}>
                <ButtonText className={"text-white"}>맵보기</ButtonText>
              </Button>
            </Box>
          </Box>
        </Box>

        <Box className={"min-h-[16px]"} />

        {/*  AD 영역*/}
        <Box className={"rounded-xl border border-outline-300 p-[12px]"}>
          <Text className={"body-5 !font-extrabold"}>
            샤르르 소리까지 나는{" "}
            <Text className={"text-yellow-500"}>달달한</Text>{" "}
            <Text>나의 배민 취향</Text>
          </Text>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
