import { Redirect, Slot } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuthUser } from "@/hooks/use-auth-user";

export default function AppLayout() {
  const { user, loading } = useAuthUser();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /** 로그인 연동 후 리디렉션 활성화 */
  if (!user) {
    return <Redirect href="/login" />;
  }

  return <Slot />;
}
