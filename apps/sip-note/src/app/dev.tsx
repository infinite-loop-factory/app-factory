import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import { seedFixtures } from "@/features/dev/seed-fixtures";

/**
 * dev 전용 딥링크 엔드포인트 — E2E(Maestro) 결정화용. `__DEV__` 에서만 동작하며,
 * 프로덕션에서는 즉시 홈으로 돌려보내 표면을 남기지 않는다.
 *
 * - `sip-note:///dev?seed=default` → 고정 fixture 시딩 후 홈 복귀 (place seed)
 * - `sip-note:///dev?theme=light` / `?theme=dark` → 강제 다크(_layout)를 덮어쓰는
 *   테마 오버라이드. nativewind `setColorScheme` 은 앱 전역·영속이라 이후 어느
 *   화면으로 이동해도 유지된다 (9컷 라이트/B3).
 *
 * 지도 시트 present(A7)는 본 라우트가 아니라 `sip-note:///map?present=<id>` 로
 * map.tsx 가 직접 처리한다.
 */
export default function DevScreen() {
  const router = useRouter();
  const { setColorScheme } = useColorScheme();
  const { seed, theme } = useLocalSearchParams<{
    seed?: string;
    theme?: string;
  }>();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    if (!__DEV__) {
      router.replace("/");
      return;
    }

    (async () => {
      if (theme === "light" || theme === "dark") {
        setColorScheme(theme);
      }
      if (seed) {
        await seedFixtures();
      }
      router.replace("/");
    })();
  }, [router, setColorScheme, seed, theme]);

  return <View className="flex-1 bg-bg" />;
}
