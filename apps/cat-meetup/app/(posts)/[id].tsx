import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { mockPosts } from "@/src/domain/mock";

export default function PostDetailSkeletonScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const post = mockPosts.find((item) => item.id === params.id);

  if (!post) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>게시물을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20, gap: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>{post.title}</Text>
      <Text>카테고리: {post.category}</Text>
      <Text>일시: {post.meetAt}</Text>
      <Text>지역: {post.region}</Text>
      <Text>상태: {post.status}</Text>
      <Text style={{ lineHeight: 22 }}>{post.content}</Text>

      <View
        style={{
          backgroundColor: "#f1f5f9",
          padding: 12,
          borderRadius: 12,
          gap: 6,
        }}
      >
        <Text>참여 신청 버튼 자리</Text>
        <Text>신청 완료 시 버튼 비활성 + 상태를 대기중으로 변경</Text>
      </View>
    </View>
  );
}
