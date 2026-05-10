import { ScrollView, Text, View } from "react-native";

const cardFields = [
  "고양이 이름",
  "고양이 성별",
  "고양이 나이",
  "중성화 여부",
  "고양이 성격(개냥이/수줍음/사나움)",
  "고양이 사진",
  "고양이 설명",
];

export default function CatCardSkeletonScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>
        동물 카드 작성(복수 생성)
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
        {cardFields.map((field, index) => (
          <Text key={field}>
            {index + 1}. {field}
          </Text>
        ))}
      </View>
      <Text style={{ color: "#64748b" }}>
        TODO: 이미지 업로드, 카드 다건 생성/수정/삭제, 대표 고양이 지정
      </Text>
    </ScrollView>
  );
}
