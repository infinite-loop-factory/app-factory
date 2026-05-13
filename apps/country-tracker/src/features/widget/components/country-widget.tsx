import type { WidgetSnapshot } from "@/features/widget/types/widget-snapshot";

import { FlexWidget, TextWidget } from "react-native-android-widget";

type CountryWidgetProps = {
  snapshot: WidgetSnapshot;
};

export function CountryWidget({ snapshot }: CountryWidgetProps) {
  const isEmpty = snapshot.recent.length === 0;

  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        flex: 1,
        padding: 12,
        backgroundColor: "#1a2332",
        borderRadius: 16,
        flexDirection: "column",
      }}
    >
      <TextWidget
        style={{ fontSize: 11, color: "#9ca3af" }}
        text={isEmpty ? "Country Tracker" : "최근 방문"}
      />

      {isEmpty ? (
        <FlexWidget
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextWidget
            style={{ fontSize: 13, color: "#d1d5db" }}
            text="여행을 기록해보세요"
          />
        </FlexWidget>
      ) : (
        snapshot.recent.slice(0, 3).map((c) => (
          <FlexWidget
            key={c.code}
            style={{
              flexDirection: "row",
              marginTop: 6,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TextWidget
              style={{ fontSize: 14, color: "#ffffff" }}
              text={`${c.flag} ${c.name}`}
            />
            <TextWidget
              style={{ fontSize: 13, color: "#d1d5db" }}
              text={`${c.days}일`}
            />
          </FlexWidget>
        ))
      )}

      <TextWidget
        style={{ fontSize: 11, color: "#9ca3af", marginTop: 8 }}
        text={`총 ${snapshot.totalCountries}개국 · ${snapshot.totalDays}일`}
      />
    </FlexWidget>
  );
}

export default CountryWidget;
