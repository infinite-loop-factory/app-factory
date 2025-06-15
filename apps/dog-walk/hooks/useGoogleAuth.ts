import { useInsertUser } from "@/api/reactQuery/users/useInsertUser";
import { supabase } from "@/api/supabaseClient";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const useGoogleAuth = () => {
  const { mutateAsync: insertUser } = useInsertUser();

  const handleLogin = async () => {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    const idToken = userInfo.data?.idToken;
    if (!idToken) throw new Error("Google ID Token이 없습니다.");

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: idToken,
    });

    if (error || !data.session) {
      throw new Error(error?.message || "세션이 없습니다.");
    }

    const { access_token, refresh_token, user } = data.session;

    return {
      accessToken: access_token ?? "",
      refreshToken: refresh_token ?? "",
      email: user.email ?? "",
      name: user.user_metadata?.full_name ?? "",
      imageUrl: user.user_metadata?.picture ?? "",
      id: user.id ?? "",
    };
  };

  const handleSignup = async ({
    id,
    email,
    name,
    profileImageUrl,
  }: {
    id: string;
    email: string;
    name: string;
    profileImageUrl: string;
  }) => {
    await insertUser({
      id,
      email,
      name,
      profileImageUrl,
    });
  };

  return {
    handleLogin,
    handleSignup,
  };
};
