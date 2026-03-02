import { Link } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { mockPosts } from "@/src/domain/mock";
import { PostCard } from "@/src/features/posts/components/PostCard";

export default function PostListSkeletonScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>매칭 게시물 목록</Text>
      <Text style={{ color: "#475569" }}>
        지역/카테고리/상태 필터 골격 + 상세 진입
      </Text>

      <View
        style={{
          backgroundColor: "#eef2ff",
          padding: 12,
          borderRadius: 12,
          gap: 4,
        }}
      >
        <Text>지역 필터: 구로구, 관악구, 노원구</Text>
        <Text>카테고리 필터: 돌봄, 친구찾기, 물품나눔</Text>
        <Text>상태 필터: 모집, 매칭중, 매칭완료</Text>
      </View>

      {mockPosts.map((post) => (
        <Link
          asChild
          href={{ pathname: "/(posts)/[id]", params: { id: post.id } }}
          key={post.id}
        >
          <PostCard
            category={post.category}
            meetAt={post.meetAt}
            region={post.region}
            status={post.status}
            title={post.title}
            variant="list"
          />
        </Link>
      ))}
    </ScrollView>
  );
}
