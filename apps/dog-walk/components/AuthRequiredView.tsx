import { Button, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { PawPrint } from "lucide-react-native";
import { View } from "react-native";

interface IAtuthRequiredViewProp {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AuthRequiredView({
  setIsLoggedIn,
}: IAtuthRequiredViewProp) {
  const handleLogin = () => {
    setIsLoggedIn(true);
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
          <Button
            className="mb-4 w-full rounded-xl"
            size={"xl"}
            onPress={handleLogin}
          >
            <ButtonText className="text-white" size="md">
              로그인
            </ButtonText>
          </Button>
          <Button variant="outline" className="w-full rounded-xl" size={"xl"}>
            <ButtonText size="md">회원가입</ButtonText>
          </Button>
        </View>
      </View>
    </View>
  );
}
