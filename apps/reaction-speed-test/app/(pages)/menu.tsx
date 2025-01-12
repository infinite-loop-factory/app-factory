import { supabase } from "@/utils/supabase";
import { Link, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, Text, View } from "react-native";

export default function MenuScreen() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", user.id)
            .single();

          if (profileData) {
            setUsername(profileData.username);
          }
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    })();
  }, []);

  return (
    <View className="flex-1 items-center justify-center">
      <Stack.Screen options={{ title: "메뉴 페이지", headerShown: false }} />
      <SafeAreaView className="h-full">
        <View className="flex-auto items-center justify-center gap-y-10">
          <Text className="text-lg dark:text-gray-50">
            {`${username || "이름"}님 반갑습니다!`}
          </Text>
          <Link href={{ pathname: "./measurement" }}>
            <Text className="dark:text-gray-50">시작하기</Text>
          </Link>
          <Link href={{ pathname: "./results" }}>
            <Text className="dark:text-gray-50">기록보기</Text>
          </Link>
          <Link href={{ pathname: "./settings" }}>
            <Text className="dark:text-gray-50">설정</Text>
          </Link>
        </View>
      </SafeAreaView>
    </View>
  );
}
