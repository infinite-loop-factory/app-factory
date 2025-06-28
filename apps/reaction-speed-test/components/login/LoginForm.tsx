import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlHelper,
  FormControlHelperText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { signInUser } from "@/services";
import { useState } from "react";
import { Text } from "react-native";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {
      email: "",
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

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { error } = await signInUser({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.message.includes("Invalid login")) {
          setErrors({
            email: "이메일 또는 비밀번호가 올바르지 않습니다",
            password: "이메일 또는 비밀번호가 올바르지 않습니다",
          });
        } else {
          console.error(error.message);
        }
        return;
      }
    } catch (error) {
      console.error("로그인 중 문제가 발생했습니다", error);
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <FormControl>
      <VStack space="xl">
        <VStack space="xs">
          <Text className="font-medium text-slate-700 text-sm dark:text-slate-300">
            이메일
          </Text>
          <Input className="border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800">
            <InputField
              type="text"
              value={formData.email}
              onChangeText={(text) => {
                setFormData((prev) => ({ ...prev, email: text }));
                clearError("email");
              }}
              placeholder="이메일을 입력하세요"
              className="text-slate-900 dark:text-slate-100"
            />
          </Input>
          {errors.email && (
            <FormControlHelper>
              <FormControlHelperText className="text-red-500">
                {errors.email}
              </FormControlHelperText>
            </FormControlHelper>
          )}
        </VStack>

        <VStack space="xs">
          <Text className="font-medium text-slate-700 text-sm dark:text-slate-300">
            비밀번호
          </Text>
          <Input className="border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800">
            <InputField
              type="password"
              value={formData.password}
              onChangeText={(text) => {
                setFormData((prev) => ({ ...prev, password: text }));
                clearError("password");
              }}
              placeholder="비밀번호를 입력하세요"
              className="text-slate-900 dark:text-slate-100"
            />
          </Input>
          {errors.password && (
            <FormControlHelper>
              <FormControlHelperText className="text-red-500">
                {errors.password}
              </FormControlHelperText>
            </FormControlHelper>
          )}
        </VStack>

        <Button
          action="primary"
          className="h-12 w-full bg-slate-900 dark:bg-slate-100"
          onPress={handleLogin}
          disabled={loading}
        >
          <ButtonText className="text-slate-100 dark:text-slate-900">
            {loading ? "처리중..." : "로그인"}
          </ButtonText>
        </Button>
      </VStack>
    </FormControl>
  );
}
