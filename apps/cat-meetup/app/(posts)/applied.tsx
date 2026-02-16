import { ScrollView, Text, View } from "react-native";
import { mockAppliedPosts } from "@/src/domain/mock";

export default function AppliedPostsSkeletonScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>
        신청한 게시물 목록
      </Text>
      {mockAppliedPosts.map((item) => (
        <View
          key={item.postId}
          style={{
            backgroundColor: "white",
            borderColor: "#e2e8f0",
            borderWidth: 1,
            borderRadius: 12,
            padding: 14,
            gap: 6,
          }}
        >
          <Text style={{ fontWeight: "600" }}>{item.postTitle}</Text>
          <Text>나의 상태: {item.myStatus}</Text>
          <Text>매칭 박스 표기: {item.matchingLabel}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
