import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import useGlobalToast from "@/features/shared/hooks/useGlobalToast";
import { FormInput } from "@/features/shared/ui/FormInput";
import { supabase } from "@/supabase/utils/supabase";

const schema = z.object({
  email: z.string().email("이메일 형식으로 입력해주세요").default(""),
  password: z.string().min(6, "6자 이상으로 입력하세요").default(""),
  name: z.string().min(1, "필수 값 입니다.").default(""),
});

type schemaType = z.infer<typeof schema>;
export default function Signup() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<schemaType>({ resolver: zodResolver(schema) });

  const { showToast } = useGlobalToast();
  const router = useRouter();

  const formInputProps = { control, errors };

  return (
    <VStack space={"md"}>
      <Text className={"mx-auto"} size={"xl"}>
        화원가입
      </Text>

      <FormInput
        label={"이메일을 입력하세요"}
        name={"email"}
        {...formInputProps}
      />
      <FormInput
        label={"페스워드 입력하세요"}
        name={"password"}
        {...formInputProps}
      />
      <FormInput
        label={"이름을 입력하세요"}
        name={"name"}
        {...formInputProps}
      />

      <Button
        disabled={isSubmitting}
        onPress={handleSubmit(async ({ email, name, password }) => {
          const res = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } },
          });
          if (res.error)
            return showToast({ title: "에러발생", action: "error" });

          showToast({ title: "회원가입 되었습니다" });

          router.push("/(stack)/auth/login");
        })}
      >
        <ButtonText className={"text-white"}>가입하기</ButtonText>
        {isSubmitting && <ButtonSpinner />}
      </Button>
    </VStack>
  );
}
