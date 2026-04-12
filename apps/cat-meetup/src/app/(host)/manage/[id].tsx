import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function HostManageSkeletonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={{ padding: 20, gap: 10 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>신청자 관리</Text>
      <Text>대상 게시물 ID: {id}</Text>
      <Text>신청자 목록 + 프로필/고양이 정보/리뷰 팝업 자리</Text>

      <View
        style={{
          backgroundColor: "#f1f5f9",
          borderRadius: 12,
          padding: 12,
          gap: 6,
        }}
      >
        <Text>- 1명 선택 시: 선택된 신청자 상태 = 매칭중</Text>
        <Text>- 나머지 신청자 상태 = 실패</Text>
        <Text>- 하루 1번만 매칭 선택 변경 가능</Text>
        <Text>- 매칭 완료 상태에서는 변경 불가</Text>
      </View>

      <Text style={{ color: "#64748b" }}>
        TODO: 매칭 선택 변경 이력, 1일 1회 제한 정책, 상태 전이 검증
      </Text>
    </View>
  );
}
