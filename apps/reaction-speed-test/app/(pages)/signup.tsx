import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlHelper,
  FormControlHelperText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { signUpUser } from "@/services";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

export default function SignUpForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {
      email: "",
      username: "",
      password: "",
    };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다";
      isValid = false;
    }

    if (!formData.username) {
      newErrors.username = "닉네임을 입력해주세요";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "비밀번호는 6자 이상이어야 합니다";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { error } = await signUpUser({
        email: formData.email,
        password: formData.password,
        username: formData.username,
      });

      if (error) {
        console.error(error.message);
        return;
      }

      alert("회원가입이 완료되었습니다. 로그인 해주세요");
      router.push("/");
    } catch (error) {
      console.error("회원가입 중 문제가 발생했습니다", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-4">
      <Stack.Screen
        options={{ title: "회원가입 페이지", headerShown: false }}
      />
      <FormControl className="rounded-lg border border-outline-300 p-4">
        <VStack space="xl">
          <VStack space="xs">
            <Text className="text-typography-500">이메일</Text>
            <Input className="min-w-[250px]">
              <InputField
                type="text"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, email: text }))
                }
              />
            </Input>
            {errors.email && (
              <FormControlHelper>
                <FormControlHelperText>{errors.email}</FormControlHelperText>
              </FormControlHelper>
            )}
          </VStack>

          <VStack space="xs">
            <Text className="text-typography-500">이름</Text>
            <Input className="min-w-[250px]">
              <InputField
                type="text"
                value={formData.username}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, username: text }))
                }
              />
            </Input>
            {errors.username && (
              <FormControlHelper>
                <FormControlHelperText>{errors.username}</FormControlHelperText>
              </FormControlHelper>
            )}
          </VStack>

          <VStack space="xs">
            <Text className="text-typography-500">비밀번호</Text>
            <Input className="text-center">
              <InputField
                type="password"
                value={formData.password}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, password: text }))
                }
              />
            </Input>
            {errors.password && (
              <FormControlHelper>
                <FormControlHelperText>{errors.password}</FormControlHelperText>
              </FormControlHelper>
            )}
          </VStack>

          <Button className="ml-auto" onPress={handleSignUp} disabled={loading}>
            <ButtonText className="text-typography-0">
              {loading ? "처리중..." : "회원가입"}
            </ButtonText>
          </Button>
        </VStack>
      </FormControl>
    </View>
  );
}
