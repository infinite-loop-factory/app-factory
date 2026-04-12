import { Link } from "expo-router";
import { ScrollView, Text, View } from "react-native";

const entryMenus = [
  { href: "/(auth)/login", label: "🔑 로그인" },
  { href: "/(auth)/signup", label: "1) 사람 회원가입" },
  { href: "/(cat)/register", label: "2) 동물 카드 등록" },
  { href: "/(posts)/list", label: "3) 매칭 게시물 목록" },
  { href: "/(posts)/applied", label: "4) 신청한 게시물 목록" },
  { href: "/(host)/create", label: "5) 작성자: 새 글 작성" },
  { href: "/(applicant)/matches", label: "6) 신청자: 매칭 수락" },
] as const;

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 24, fontWeight: "700" }}>
          냥냥모임 기본 골격
        </Text>
        <Text style={{ color: "#475569" }}>
          신규 가입자, 게시물 작성자, 신청자 시나리오를 바로 연결한 라우트
          시작점입니다.
        </Text>
      </View>

      {entryMenus.map((menu) => (
        <Link
          href={menu.href as never}
          key={menu.href}
          style={{
            backgroundColor: "white",
            borderColor: "#e2e8f0",
            borderWidth: 1,
            borderRadius: 12,
            padding: 14,
          }}
        >
          {menu.label}
        </Link>
      ))}
    </ScrollView>
  );
}
