import { ScrollView, Text } from "react-native";
import { mockMatchOffers } from "@/domain/mock";
import { PostCard } from "@/features/posts/components/PostCard";

export default function ApplicantMatchesSkeletonScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>
        매칭중 & 수락 대기 목록
      </Text>
      {mockMatchOffers.map((item) => (
        <PostCard
          hostPhoneVisible={item.hostPhoneVisible}
          key={item.postId}
          needAccept={item.needAccept}
          title={item.postTitle}
          variant="match"
        />
      ))}
      <Text style={{ color: "#64748b" }}>
        TODO: 수락 API, 수락 후 상태를 매칭완료로 변경, 통화/연락 로그 처리
      </Text>
    </ScrollView>
  );
}
