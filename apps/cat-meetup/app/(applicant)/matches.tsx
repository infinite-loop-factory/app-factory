import { ScrollView, Text, View } from "react-native";
import { mockMatchOffers } from "@/src/domain/mock";

export default function ApplicantMatchesSkeletonScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>
        매칭중 & 수락 대기 목록
      </Text>
      {mockMatchOffers.map((item) => (
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
          <Text>상대 번호 노출: {item.hostPhoneVisible ? "가능" : "불가"}</Text>
          <Text>수락 필요 여부: {item.needAccept ? "예" : "아니오"}</Text>
        </View>
      ))}
      <Text style={{ color: "#64748b" }}>
        TODO: 수락 API, 수락 후 상태를 매칭완료로 변경, 통화/연락 로그 처리
      </Text>
    </ScrollView>
  );
}
