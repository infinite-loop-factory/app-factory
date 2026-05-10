import { useEffect } from "react";
import { useSunStore } from "@/hooks/sun-drive/use-sun-drive";
import { useThemeStore } from "@/hooks/use-theme";

/**
 * SunDriverBoot - 태양 드라이버 초기화 컴포넌트
 *
 * 앱 시작 시 태양 애니메이션 시스템을 초기화하고
 * 다크모드/라이트모드 전환에 따라 태양 상태를 제어합니다
 */
export function SunDriverBoot() {
  const { isDark } = useThemeStore();

  const start = useSunStore((s) => s.start);
  const setDark = useSunStore((s) => s.setDark);

  // 컴포넌트 마운트 시 태양 드라이버 시작
  useEffect(() => {
    start();
  }, [start]);

  // 다크모드 상태 변경 시 태양 드라이버 업데이트
  useEffect(() => {
    setDark(isDark);
  }, [isDark, setDark]);

  return null;
}
