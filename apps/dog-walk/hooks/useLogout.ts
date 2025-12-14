import { useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import { supabase } from "@/api/supabaseClient";
import { userAtom } from "@/atoms/userAtom";

export function useLogout() {
  const setUserInfo = useSetAtom(userAtom);
  const router = useRouter();

  const logout = async () => {
    try {
      await supabase.auth.signOut();

      // NOTE: 사용자 정보 초기화
      setUserInfo({
        accessToken: "",
        refreshToken: "",
        email: "",
        name: "",
        imageUrl: "",
        id: "",
      });

      router.replace("/(tabs)/profile");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return { logout };
}
