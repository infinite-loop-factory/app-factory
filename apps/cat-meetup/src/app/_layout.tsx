import "../global.css";

import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: "#f8fafc" },
        }}
      >
        <Stack.Screen name="index" options={{ title: "냥냥모임" }} />
        <Stack.Screen
          name="(auth)/login"
          options={{ headerShown: false, title: "로그인" }}
        />
        <Stack.Screen
          name="(auth)/signup"
          options={{ title: "사람 회원가입" }}
        />
        <Stack.Screen
          name="(cat)/register"
          options={{ title: "동물 카드 작성" }}
        />
        <Stack.Screen
          name="(posts)/list"
          options={{ title: "매칭 게시물 목록" }}
        />
        <Stack.Screen name="(posts)/[id]" options={{ title: "게시물 상세" }} />
        <Stack.Screen
          name="(posts)/applied"
          options={{ title: "신청한 게시물" }}
        />
        <Stack.Screen name="(host)/create" options={{ title: "새 글 작성" }} />
        <Stack.Screen
          name="(host)/manage/[id]"
          options={{ title: "신청자 관리" }}
        />
        <Stack.Screen
          name="(applicant)/matches"
          options={{ title: "매칭중/수락" }}
        />
        <Stack.Screen name="+not-found" options={{ title: "페이지 없음" }} />
      </Stack>
    </ThemeProvider>
  );
}
