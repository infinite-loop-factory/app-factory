import { ScrollView, Text, View } from "react-native";

const fields = ["제목", "카테고리", "만날 날짜/시간(24시간)", "본문"];

export default function CreatePostSkeletonScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>게시물 작성</Text>
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
        {fields.map((field, index) => (
          <Text key={field}>
            {index + 1}. {field}
          </Text>
        ))}
      </View>
      <Text style={{ color: "#64748b" }}>
        TODO: 저장 API, 유효성 검사, 작성 완료 후 상세/목록 리다이렉트
      </Text>
    </ScrollView>
  );
}
