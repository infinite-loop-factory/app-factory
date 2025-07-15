import type { MigrationResult } from "@/services/dataMigration";

import { useAsyncEffect } from "@reactuses/core";
import { noop } from "es-toolkit";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, SafeAreaView, Text, View } from "react-native";
import { DataMigrationModal } from "@/components/migration/DataMigrationModal";
import { Button, ButtonText } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMigrationModal } from "@/hooks/useMigrationModal";
import { fetchUsername } from "@/services";

export default function MenuScreen() {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();
  const { user, signOut, isAuthenticated } = useAuth();
  const { showMigrationModal, closeMigrationModal } = useMigrationModal(
    isAuthenticated,
    user,
  );

  useAsyncEffect(
    async () => {
      try {
        if (user) {
          const username = await fetchUsername(user.id);
          setUsername(username);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    },
    noop,
    [user],
  );

  const handleSignOut = async () => {
    await signOut();
  };

  const handleMigrationComplete = (result: MigrationResult) => {
    if (result.migratedRecords > 0) {
      // 잠시 후 결과 페이지로 이동 권유
      setTimeout(() => {
        Alert.alert(
          "마이그레이션 완료! 🎉",
          `${result.migratedRecords}개의 기록이 클라우드에 저장되었습니다.\n\n이제 결과 페이지에서 모든 기록을 확인하실 수 있습니다.`,
          [
            { text: "나중에 보기", style: "cancel" },
            {
              text: "결과 보기",
              style: "default",
              onPress: () => router.push("/results"),
            },
          ],
        );
      }, 1000);
    }
  };

  const menuItems = [
    {
      id: "measurement",
      title: "측정 시작",
      description: "반응 속도를 측정해보세요",
      icon: "⚡",
      href: "/measurement" as const,
      primary: true,
    },
    {
      id: "results",
      title: "기록 보기",
      description: "지금까지의 측정 기록을 확인하세요",
      icon: "📊",
      href: "/results" as const,
    },
    {
      id: "settings",
      title: "설정",
      description: "앱 설정을 변경하세요",
      icon: "⚙️",
      href: "/settings" as const,
    },
  ];

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
      <View className="w-full max-w-md items-center gap-y-12">
        <View className="items-center gap-y-4">
          <Text className="text-center font-bold text-3xl text-slate-900 dark:text-slate-100">
            안녕하세요, {username || "사용자"}님!
          </Text>
          <Text className="text-center text-lg text-slate-600 dark:text-slate-400">
            오늘도 반응 속도를 측정해보세요
          </Text>
        </View>

        <View className="w-full gap-y-4">
          {menuItems.map((item) => (
            <Pressable
              className={`rounded-lg border ${
                item.primary
                  ? "border-slate-900 bg-slate-900 dark:border-slate-100 dark:bg-slate-100"
                  : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              }`}
              key={item.id}
              onPress={() => router.push(item.href)}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <View className="p-6">
                <View className="flex-row items-center">
                  <Text className="mr-4 text-3xl">{item.icon}</Text>
                  <View className="flex-1">
                    <Text
                      className={`mb-1 font-semibold text-lg ${
                        item.primary
                          ? "text-slate-100 dark:text-slate-900"
                          : "text-slate-900 dark:text-slate-100"
                      }`}
                    >
                      {item.title}
                    </Text>
                    <Text
                      className={`text-sm ${
                        item.primary
                          ? "text-slate-300 dark:text-slate-700"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {item.description}
                    </Text>
                  </View>
                  <Text
                    className={`text-xl ${
                      item.primary
                        ? "text-slate-300 dark:text-slate-700"
                        : "text-slate-400 dark:text-slate-600"
                    }`}
                  >
                    →
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        <View className="w-full">
          <Button
            action="secondary"
            className="h-14 w-full border border-slate-500 dark:border-slate-700"
            onPress={handleSignOut}
          >
            <ButtonText className="text-lg text-slate-700 dark:text-slate-300">
              로그아웃
            </ButtonText>
          </Button>
        </View>
      </View>

      <DataMigrationModal
        isVisible={showMigrationModal}
        onClose={closeMigrationModal}
        onMigrationComplete={handleMigrationComplete}
      />
    </SafeAreaView>
  );
}
