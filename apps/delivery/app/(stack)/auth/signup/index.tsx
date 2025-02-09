import { Button, ButtonText } from "@/components/ui/button";
import { useFormInput } from "@/features/shared/ui/FormInput";
import { supabase } from "@/supabase/utils/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("이메일 형식으로 입력해주세요").default(""),
  password: z.string().min(1, "필수 값 입니다.").default(""),
  name: z.string().min(1, "필수 값 입니다.").default(""),
});

type schemaType = z.infer<typeof schema>;
export default function Signup() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<schemaType>({ resolver: zodResolver(schema) });

  const { FormInput } = useFormInput({ control, errors });
  const router = useRouter();

  return (
    <View className={"flex gap-[12px]"}>
      <Text className={"title-3 mx-auto"}>화원가입</Text>

      <FormInput label={"이메일을 입력하세요"} name={"email"} />

      <FormInput label={"페스워드 입력하세요"} name={"password"} />

      <FormInput label={"이름을 입력하세요"} name={"name"} />

      <Button
        onPress={handleSubmit(async ({ email, name, password }) => {
          const res = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } },
          });
          if (res.error) return alert("에러발생");

          router.push("/(stack)/auth/login");
        })}
      >
        <ButtonText>가입하기</ButtonText>
      </Button>
    </View>
  );
}
