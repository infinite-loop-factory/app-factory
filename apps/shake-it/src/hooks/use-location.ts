import type { Location } from "@/types";

import * as ExpoLocation from "expo-location";
import { useCallback, useState } from "react";
import { reverseGeocode } from "@/services/naver-api";

export function useLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [address, setAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 권한 요청
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("위치 권한이 거부되었습니다. 설정에서 권한을 허용해주세요.");
        return false;
      }
      setError(null);
      return true;
    } catch {
      setError("위치 권한 요청 중 오류가 발생했습니다.");
      return false;
    }
  }, []);

  // 위치 갱신
  const refreshLocation = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // 권한 확인
      const { status } = await ExpoLocation.getForegroundPermissionsAsync();
      if (status !== "granted") {
        const granted = await requestPermission();
        if (!granted) {
          setIsLoading(false);
          return;
        }
      }

      // 현재 위치 조회
      const position = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.Balanced,
      });

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      setLocation({ latitude: lat, longitude: lng });

      // 지역명 조회
      const addressName = await reverseGeocode(37.496486063, 127.0284);
      setAddress(addressName);
    } catch {
      setError("위치 정보를 가져오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [requestPermission]);

  return {
    location,
    address,
    isLoading,
    error,
    requestPermission,
    refreshLocation,
  };
}
