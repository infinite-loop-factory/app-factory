import { Stack } from "expo-router";
import { Linking } from "react-native";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { PUBLIC_LINKS } from "@/constants/links";
import { PublicPage } from "@/features/legal/components/public-page";
import i18n from "@/lib/i18n";

export default function PrivacyPage() {
  const isKorean = i18n.locale === "ko";

  return (
    <>
      <Stack.Screen options={{ title: i18n.t("login.privacy") }} />
      <PublicPage
        eyebrow={isKorean ? "개인정보" : "Privacy"}
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
              onPress={() => void Linking.openURL(PUBLIC_LINKS.privacyPolicy)}
            >
              <ButtonText>{PUBLIC_LINKS.privacyPolicy}</ButtonText>
            </Button>
          </Box>
        }
        sections={
          isKorean
            ? [
                {
                  title: "수집하는 데이터",
                  paragraphs: [
                    "계정 식별을 위해 로그인 제공자가 전달한 사용자 ID와 이메일 주소를 저장합니다.",
                    "자동 방문 기록 기능을 위해 위치 권한이 허용된 경우 정밀 또는 대략적인 위치 데이터를 기록합니다.",
                    "사진에서 방문 기록을 추가할 때는 선택한 사진의 EXIF 메타데이터를 읽어 날짜와 위치를 추출할 수 있습니다.",
                  ],
                },
                {
                  title: "사용 목적",
                  paragraphs: [
                    "위치 데이터는 국경 이동을 감지해 방문 국가를 자동으로 저장하고 지도 및 통계를 표시하는 데만 사용합니다.",
                    "광고, 타사 추적, 프로파일링 목적으로 위치 데이터를 사용하거나 판매하지 않습니다.",
                  ],
                },
                {
                  title: "보관과 삭제",
                  paragraphs: [
                    "데이터는 Supabase에 사용자별로 분리 저장되며, 각 사용자는 본인 데이터만 볼 수 있습니다.",
                    "설정의 계정 삭제 기능으로 저장된 여행 데이터를 언제든 영구 삭제할 수 있습니다.",
                  ],
                },
              ]
            : [
                {
                  title: "Data we collect",
                  paragraphs: [
                    "We store the user ID and email address provided by your sign-in provider so you can access your account.",
                    "When you allow location access, we store precise or coarse location data to detect border crossings and record country visits.",
                    "If you add a trip from a photo, we may read EXIF metadata from the selected image to extract the date and location.",
                  ],
                },
                {
                  title: "How we use it",
                  paragraphs: [
                    "Location data is used only for app functionality: automatic visit detection, maps, timelines, and travel statistics.",
                    "We do not use or share your location data for advertising, tracking, or profiling.",
                  ],
                },
                {
                  title: "Retention and deletion",
                  paragraphs: [
                    "Your data is stored in Supabase with per-user access controls so each user can only access their own records.",
                    "You can permanently delete your travel history at any time from Settings by deleting your account.",
                  ],
                },
              ]
        }
        summary={
          isKorean
            ? "Country Tracker는 자동 방문 기록과 지도 표시를 위해 꼭 필요한 데이터만 수집합니다."
            : "Country Tracker only collects the data needed to power automatic trip tracking and travel history features."
        }
        title={i18n.t("login.privacy")}
      />
    </>
  );
}
