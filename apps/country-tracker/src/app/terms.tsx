import { Stack } from "expo-router";
import { Linking } from "react-native";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { PUBLIC_LINKS } from "@/constants/links";
import { PublicPage } from "@/features/legal/components/public-page";
import i18n from "@/lib/i18n";

export default function TermsPage() {
  const isKorean = i18n.locale === "ko";

  return (
    <>
      <Stack.Screen options={{ title: i18n.t("login.terms") }} />
      <PublicPage
        eyebrow={isKorean ? "약관" : "Terms"}
        footer={
          <Box className="gap-3">
            <Text className="text-sm text-typography-500 leading-6">
              {isKorean
                ? "스토어 제출용 공개 URL"
                : "Public URL for store listings"}
            </Text>
            <Button
              action="primary"
              className="rounded-2xl"
              onPress={() => void Linking.openURL(PUBLIC_LINKS.terms)}
            >
              <ButtonText>{PUBLIC_LINKS.terms}</ButtonText>
            </Button>
          </Box>
        }
        sections={
          isKorean
            ? [
                {
                  title: "서비스 이용",
                  paragraphs: [
                    "Country Tracker는 개인 여행 기록을 관리하기 위한 서비스입니다.",
                    "정확한 기록을 위해 위치 권한과 계정 로그인이 필요할 수 있습니다.",
                  ],
                },
                {
                  title: "사용자 책임",
                  paragraphs: [
                    "사용자는 본인 계정 정보와 저장된 여행 데이터를 관리할 책임이 있습니다.",
                    "위치 추적을 원하지 않으면 기기 설정에서 권한을 비활성화할 수 있습니다.",
                  ],
                },
                {
                  title: "서비스 변경",
                  paragraphs: [
                    "기능, 디자인, 지원 범위는 사전 고지 없이 변경될 수 있습니다.",
                    "계속 사용하면 최신 약관에 동의한 것으로 간주합니다.",
                  ],
                },
              ]
            : [
                {
                  title: "Using the service",
                  paragraphs: [
                    "Country Tracker is provided for personal travel logging and trip history management.",
                    "Some features require account sign-in and location permissions to work as intended.",
                  ],
                },
                {
                  title: "Your responsibilities",
                  paragraphs: [
                    "You are responsible for managing your account access and reviewing the travel data stored in your account.",
                    "If you do not want automatic tracking, you can disable location permissions in device settings at any time.",
                  ],
                },
                {
                  title: "Changes to the app",
                  paragraphs: [
                    "Features, design, and support scope may change over time as the app evolves.",
                    "Continuing to use the app after updates means you accept the latest version of these terms.",
                  ],
                },
              ]
        }
        summary={
          isKorean
            ? "Country Tracker를 사용하면 개인 여행 기록을 저장하고 관리하기 위한 약관에 동의하게 됩니다."
            : "By using Country Tracker, you agree to the terms for storing and managing your personal travel history."
        }
        title={i18n.t("login.terms")}
      />
    </>
  );
}
