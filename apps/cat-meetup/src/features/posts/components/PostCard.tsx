import { Pressable, Text, View } from "react-native";

type PostCardVariant = "list" | "applied" | "match";

type PostCardProps = {
  variant: PostCardVariant;
  title: string;
  category?: string;
  status?: string;
  region?: string;
  meetAt?: string;
  myStatus?: string;
  matchingLabel?: string;
  hostPhoneVisible?: boolean;
  needAccept?: boolean;
  onPress?: () => void;
};

function getVariantMeta(props: PostCardProps) {
  if (props.variant === "applied") {
    return {
      line1: `나의 상태: ${props.myStatus ?? "-"}`,
      line2: `매칭 박스: ${props.matchingLabel ?? "-"}`,
    };
  }

  if (props.variant === "match") {
    return {
      line1: `상대 번호 노출: ${props.hostPhoneVisible ? "가능" : "불가"}`,
      line2: `수락 필요: ${props.needAccept ? "예" : "아니오"}`,
    };
  }

  return {
    line1: [props.category, props.region].filter(Boolean).join(" · "),
    line2: [props.status, props.meetAt].filter(Boolean).join(" · "),
  };
}

export function PostCard(props: PostCardProps) {
  const { line1, line2 } = getVariantMeta(props);

  return (
    <Pressable
      onPress={props.onPress}
      style={{
        backgroundColor: "white",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        gap: 6,
      }}
    >
      <Text style={{ fontWeight: "700" }}>{props.title}</Text>
      {line1 ? <Text style={{ color: "#334155" }}>{line1}</Text> : null}
      {line2 ? <Text style={{ color: "#475569" }}>{line2}</Text> : null}
      <View>
        <Text style={{ color: "#94a3b8", fontSize: 12 }}>
          variant: {props.variant}
        </Text>
      </View>
    </Pressable>
  );
}
