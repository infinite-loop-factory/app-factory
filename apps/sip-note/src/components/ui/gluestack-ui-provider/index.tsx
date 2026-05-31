import { OverlayProvider } from "@gluestack-ui/core/overlay/creator";
import { useColorScheme } from "nativewind";
import React, { useEffect } from "react";
import { View, type ViewProps } from "react-native";
import { config } from "./config";

export type ModeType = "light" | "dark" | "system";

export function GluestackUIProvider({
  mode = "light",
  ...props
}: {
  mode?: ModeType;
  children?: React.ReactNode;
  style?: ViewProps["style"];
}) {
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    // mode 가 colorScheme 파생값으로 주입되는 구성(_layout: mode={themeMode})에서,
    // 이미 동기 상태인데도 무조건 setColorScheme(mode) 를 호출하면 테마 전환 중
    // 재렌더 루프가 생겨 expo-router 네비게이터가 초기 라우트(홈)로 리셋된다
    // (9컷 cut 7 라이트 place 딥링크가 홈으로 삼켜지던 원인). 값이 다를 때만 동기화한다.
    if (colorScheme !== mode) {
      setColorScheme(mode);
    }
    // setColorScheme 은 nativewind 에서 매 렌더 identity 가 바뀌므로 deps 제외 유지.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, colorScheme]);

  return (
    <View
      style={[
        config[colorScheme!],
        { flex: 1, height: "100%", width: "100%" },
        props.style,
      ]}
    >
      <OverlayProvider>{props.children}</OverlayProvider>
    </View>
  );
}
