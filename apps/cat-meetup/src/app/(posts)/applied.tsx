import { ScrollView, Text } from "react-native";
import { mockAppliedPosts } from "@/domain/mock";
import { PostCard } from "@/features/posts/components/PostCard";

export default function AppliedPostsSkeletonScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>
        신청한 게시물 목록
      </Text>
      {mockAppliedPosts.map((item) => (
        <PostCard
          key={item.postId}
          matchingLabel={item.matchingLabel}
          myStatus={item.myStatus}
          title={item.postTitle}
          variant="applied"
        />
      ))}
    </ScrollView>
  );
}
