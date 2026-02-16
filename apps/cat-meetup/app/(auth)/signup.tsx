import { ScrollView, Text, View } from "react-native";

const requiredFields = [
  "이름",
  "핸드폰번호(아이디)",
  "카카오톡 아이디",
  "비밀번호",
  "이메일",
  "성별",
  "생년월일",
  "사는 지역(구 단위)",
  "본인 설명/자기소개",
];

export default function SignupSkeletonScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>사람 회원가입</Text>
      <Text style={{ color: "#475569" }}>
        인증/검증/중복체크 API를 붙일 수 있도록 필수 입력 항목 골격만 먼저
        구성했습니다.
      </Text>

      <View
        style={{
          backgroundColor: "white",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#e2e8f0",
          padding: 14,
          gap: 8,
        }}
      >
        {requiredFields.map((field, index) => (
          <Text key={field}>
            {index + 1}. {field}
          </Text>
        ))}
      </View>

      <Text style={{ color: "#64748b" }}>
        TODO: 휴대폰 인증, 비밀번호 정책, 지역 선택 컴포넌트, 약관 동의
      </Text>
    </ScrollView>
  );
}
