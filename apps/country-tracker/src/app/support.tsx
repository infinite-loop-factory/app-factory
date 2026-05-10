import { Stack, useRouter } from "expo-router";
import { Linking } from "react-native";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { PUBLIC_LINKS } from "@/constants/links";
import { PublicPage } from "@/features/legal/components/public-page";
import i18n from "@/lib/i18n";

export default function SupportPage() {
  const isKorean = i18n.locale === "ko";
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{ title: i18n.t("settings.support.help-center") }}
      />
      <PublicPage
        eyebrow={isKorean ? "지원" : "Support"}
        footer={
          <Box className="gap-3">
            <Button
              action="default"
              className="h-12 w-full justify-center rounded-2xl border border-outline-200 bg-background-0"
              onPress={() => router.push("/privacy" as never)}
              variant="outline"
            >
              <ButtonText>{i18n.t("login.privacy")}</ButtonText>
            </Button>
            <Button
              action="default"
              className="h-12 w-full justify-center rounded-2xl border border-outline-200 bg-background-0"
              onPress={() => router.push("/terms" as never)}
              variant="outline"
            >
              <ButtonText>{i18n.t("login.terms")}</ButtonText>
            </Button>
            <Button
              action="primary"
              className="rounded-2xl"
              onPress={() => void Linking.openURL(PUBLIC_LINKS.support)}
            >
              <ButtonText>{PUBLIC_LINKS.support}</ButtonText>
            </Button>
          </Box>
        }
        sections={
          isKorean
            ? [
                {
                  title: "자동 방문 기록이 동작하지 않을 때",
                  paragraphs: [
                    "기기 설정에서 위치 권한이 '항상 허용'인지 확인하세요.",
                    "배터리 절약 모드나 백그라운드 실행 제한이 있으면 자동 추적이 지연될 수 있습니다.",
                  ],
                },
                {
                  title: "데이터 관리",
                  paragraphs: [
                    "설정에서 국가 제외 목록을 관리하고, 비자 알림을 설정할 수 있습니다.",
                    "계정 삭제를 실행하면 저장된 여행 데이터가 영구 삭제됩니다.",
                  ],
                },
                {
                  title: "추가 안내",
                  paragraphs: [
                    "개인정보처리방침과 이용약관은 아래 버튼 또는 로그인 화면에서 언제든 확인할 수 있습니다.",
                  ],
                },
              ]
            : [
                {
                  title: "If automatic trip tracking is not working",
                  paragraphs: [
                    "Check that location access is set to Always Allow in your device settings.",
                    "Battery saver or background execution limits can delay automatic visit detection.",
                  ],
                },
                {
                  title: "Managing your data",
                  paragraphs: [
                    "You can manage country exclusions and visa alerts from Settings.",
                    "Deleting your account permanently removes your stored travel history.",
                  ],
                },
                {
                  title: "More information",
                  paragraphs: [
                    "You can review the privacy policy and terms of service at any time using the buttons below or from the login screen.",
                  ],
                },
              ]
        }
        summary={
          isKorean
            ? "Country Tracker의 핵심 기능과 자주 묻는 질문을 한 곳에서 확인할 수 있습니다."
            : "Find the core support information and most common troubleshooting steps for Country Tracker in one place."
        }
        title={i18n.t("settings.support.help-center")}
      />
    </>
  );
}
