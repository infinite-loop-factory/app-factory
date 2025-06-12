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
import { Pressable, ScrollView, Text, View } from "react-native";

export default function SignUpForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // 에러 클리어
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다";
    }

    if (!formData.username) {
      newErrors.username = "사용자명을 입력해주세요";
    } else if (formData.username.length < 2) {
      newErrors.username = "사용자명은 2자 이상이어야 합니다";
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요";
    } else if (formData.password.length < 6) {
      newErrors.password = "비밀번호는 6자 이상이어야 합니다";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).every(
      (key) => !newErrors[key as keyof typeof newErrors],
    );
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

      // v0 스타일: 성공 시 메뉴로 이동
      router.push("/menu");
    } catch (error) {
      console.error("회원가입 중 문제가 발생했습니다", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <Stack.Screen options={{ title: "회원가입", headerShown: false }} />
      <ScrollView className="flex-1">
        <View className="flex-1 items-center justify-center px-4 py-8">
          <View className="w-full max-w-md">
            {/* 헤더 */}
            <View className="mb-8 items-center">
              <Text className="mb-2 font-bold text-3xl text-slate-900 dark:text-slate-100">
                회원가입
              </Text>
              <Text className="text-slate-600 dark:text-slate-400">
                반응 속도 측정을 시작해보세요
              </Text>
            </View>

            {/* 카드 */}
            <View className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <VStack space="md">
                {/* 사용자명 */}
                <VStack space="xs">
                  <Text className="text-slate-700 dark:text-slate-300">
                    사용자명
                  </Text>
                  <Input
                    className={`${errors.username ? "border-red-500" : "border-slate-300 dark:border-slate-700"}`}
                  >
                    <InputField
                      type="text"
                      value={formData.username}
                      onChangeText={(text) =>
                        handleInputChange("username", text)
                      }
                      placeholder="사용자명을 입력하세요"
                    />
                  </Input>
                  {errors.username && (
                    <Text className="text-red-500 text-sm">
                      {errors.username}
                    </Text>
                  )}
                </VStack>

                {/* 이메일 */}
                <VStack space="xs">
                  <Text className="text-slate-700 dark:text-slate-300">
                    이메일
                  </Text>
                  <Input
                    className={`${errors.email ? "border-red-500" : "border-slate-300 dark:border-slate-700"}`}
                  >
                    <InputField
                      type="text"
                      value={formData.email}
                      onChangeText={(text) => handleInputChange("email", text)}
                      placeholder="이메일을 입력하세요"
                    />
                  </Input>
                  {errors.email && (
                    <Text className="text-red-500 text-sm">{errors.email}</Text>
                  )}
                </VStack>

                {/* 비밀번호 */}
                <VStack space="xs">
                  <Text className="text-slate-700 dark:text-slate-300">
                    비밀번호
                  </Text>
                  <Input
                    className={`${errors.password ? "border-red-500" : "border-slate-300 dark:border-slate-700"}`}
                  >
                    <InputField
                      type="password"
                      value={formData.password}
                      onChangeText={(text) =>
                        handleInputChange("password", text)
                      }
                      placeholder="비밀번호를 입력하세요"
                    />
                  </Input>
                  {errors.password && (
                    <Text className="text-red-500 text-sm">
                      {errors.password}
                    </Text>
                  )}
                </VStack>

                {/* 비밀번호 확인 */}
                <VStack space="xs">
                  <Text className="text-slate-700 dark:text-slate-300">
                    비밀번호 확인
                  </Text>
                  <Input
                    className={`${errors.confirmPassword ? "border-red-500" : "border-slate-300 dark:border-slate-700"}`}
                  >
                    <InputField
                      type="password"
                      value={formData.confirmPassword}
                      onChangeText={(text) =>
                        handleInputChange("confirmPassword", text)
                      }
                      placeholder="비밀번호를 다시 입력하세요"
                    />
                  </Input>
                  {errors.confirmPassword && (
                    <Text className="text-red-500 text-sm">
                      {errors.confirmPassword}
                    </Text>
                  )}
                </VStack>

                {/* 회원가입 버튼 */}
                <Button
                  className="mt-4 h-12 w-full bg-slate-900 dark:bg-slate-100"
                  onPress={handleSignUp}
                  disabled={loading}
                >
                  <ButtonText className="text-slate-100 dark:text-slate-900">
                    {loading ? "가입 중..." : "회원가입"}
                  </ButtonText>
                </Button>
              </VStack>
            </View>

            {/* 하단 로그인 링크 */}
            <View className="mt-6 items-center">
              <Text className="text-slate-600 dark:text-slate-400">
                이미 계정이 있으신가요?{" "}
                <Pressable onPress={() => router.push("/")}>
                  <Text className="font-medium text-slate-900 dark:text-slate-100">
                    로그인하기
                  </Text>
                </Pressable>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* TODO: 추후 추가할 기능 - 기존 GlueStack 폼 컴포넌트 로직 유지 (숨김 처리) */}
      <View className="pointer-events-none absolute h-0 overflow-hidden opacity-0">
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
          </VStack>
        </FormControl>
      </View>
    </View>
  );
}
