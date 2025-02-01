import { Button, ButtonText } from "@/components/ui/button";
import { useFormInput } from "@/features/shared/ui/FormInput";
import { useUserStore } from "@/features/user/store/user.store";
import { supabase } from "@/supabase/utils/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("이메일 형식으로 입력해주세요").default(""),
  password: z.string().min(1, "필수 값 입니다.").default(""),
});

type schemaType = z.infer<typeof schema>;
export default function Signin() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<schemaType>({ resolver: zodResolver(schema) });

  const { setUser } = useUserStore();
  const { FormInput } = useFormInput({ control, errors });

  const router = useRouter();

  return (
    <View className={"flex gap-[12px]"}>
      <Text className={"title-3 mx-auto"}>로그인</Text>

      <FormInput label={"이메일을 입력하세요"} name={"email"} />
      <FormInput label={"페스워드 입력하세요"} name={"password"} />

      <Button
        onPress={handleSubmit(async ({ email, password }) => {
          const res = //
            await supabase.auth.signInWithPassword({ email, password });

          const user = res.data.user;
          if (!user) return alert("유저가 존재하지 않습니다");

          const { data } = await supabase.from("user").select("name").single();
          if (!data?.name) return alert("에러발생");

          setUser({ email, id: user.id, name: data.name });

          router.push("/(tabs)/mypage");
        })}
      >
        <ButtonText>로그인</ButtonText>
      </Button>
    </View>
  );
}
