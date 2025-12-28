import { useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { userAtom } from "@/atoms/userAtom";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUserInfo = useSetAtom(userAtom);
  const router = useRouter();

  // NOTE: 로그인 세션 상태 변화 감지
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // NOTE: 세션 만료, 로그아웃, 토큰 갱신 실패 시
        if (
          event === "SIGNED_OUT" ||
          (event === "TOKEN_REFRESHED" && !session)
        ) {
          // NOTE: 사용자 정보 전역 변수 초기화
          setUserInfo({
            accessToken: "",
            refreshToken: "",
            email: "",
            name: "",
            imageUrl: "",
            id: "",
          });

          router.replace("/(tabs)/profile");
        }

        // NOTE: 토큰 갱신 실패 감지하여 로그아웃 처리
        if (event === "TOKEN_REFRESHED" && !session) {
          await supabase.auth.signOut();
        }
      },
    );

    // NOTE: 초기 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // 세션이 없으면 userAtom 초기화
        setUserInfo({
          accessToken: "",
          refreshToken: "",
          email: "",
          name: "",
          imageUrl: "",
          id: "",
        });
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setUserInfo, router]);

  return <>{children}</>;
}
