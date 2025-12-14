import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { supabase } from "@/supabase/supabase";

export default function AuthCallback() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("처리 중...");

  useEffect(() => {
    // Handle OAuth / Magic Link code exchange if present
    const code = (params.code as string) || undefined;
    if (!code) {
      setMessage("코드가 없습니다. 이 탭을 닫아주세요.");
      return;
    }

    // Check if supabase is configured
    if (!supabase) {
      setMessage("Supabase가 설정되지 않았습니다. 환경 변수를 확인해주세요.");
      return;
    }

    (async () => {
      try {
        const { data, error } =
          await supabase.auth.exchangeCodeForSession(code);
        if (error) throw error;
        if (data.session) {
          setMessage("로그인 완료! 잠시 후 이전 화면으로 이동합니다.");
          setTimeout(() => router.replace("/(tabs)/mypage"), 500);
        } else {
          setMessage("세션이 생성되지 않았습니다. 다시 시도해 주세요.");
        }
      } catch (_e) {
        setMessage("로그인 처리 중 오류가 발생했습니다.");
      }
    })();
  }, [params, router]);

  return (
    <ThemedView className="flex-1 items-center justify-center p-6">
      <ActivityIndicator />
      <View style={{ height: 12 }} />
      <ThemedText>{message}</ThemedText>
    </ThemedView>
  );
}
