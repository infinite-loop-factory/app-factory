import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import useGlobalToast from "@/features/shared/hooks/useGlobalToast";
import { FormInput } from "@/features/shared/ui/FormInput";
import { useUserStore } from "@/features/user/store/user.store";
import { supabase } from "@/supabase/utils/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("이메일 형식으로 입력해주세요").default(""),
  password: z.string().min(6, "6자 이상으로 입력하세요").default(""),
});

type schemaType = z.infer<typeof schema>;
export default function Signin() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<schemaType>({ resolver: zodResolver(schema) });

  const { showToast } = useGlobalToast();
  const router = useRouter();
  const { setUser } = useUserStore();

  const formInputProps = { control, errors };

  return (
    <VStack space={"md"}>
      <Text size={"xl"} className={"mx-auto"}>
        로그인
      </Text>

      <FormInput
        name={"email"}
        label={"이메일을 입력하세요"}
        {...formInputProps}
      />
      <FormInput
        name={"password"}
        label={"페스워드를 입력하세요"}
        {...formInputProps}
      />

      <Button
        disabled={isSubmitting}
        onPress={handleSubmit(async ({ email, password }) => {
          const res = //
            await supabase.auth.signInWithPassword({ email, password });

          const user = res.data.user;

          if (!user)
            return showToast({
              title: "유저가 존재하지 않습니다",
              action: "error",
            });

          const { data } = await supabase.from("user").select("name").single();
          if (!data?.name)
            return showToast({ title: "에러 발생", action: "error" });

          setUser({ email, id: user.id, name: data.name });

          showToast({ title: "로그인 되었습니다" });
          router.push("/(tabs)/mypage");
        })}
      >
        <ButtonText className={"text-white"}>로그인</ButtonText>
        {isSubmitting && <ButtonSpinner />}
      </Button>
    </VStack>
  );
}
