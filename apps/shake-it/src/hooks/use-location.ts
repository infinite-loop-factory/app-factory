import type { Location } from "@/types";

import * as ExpoLocation from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";
import { reverseGeocode } from "@/services/kakao-api";

export function useLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [address, setAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

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

  const ensurePermission = useCallback(async (): Promise<boolean> => {
    const { status } = await ExpoLocation.getForegroundPermissionsAsync();
    if (status === "granted") {
      return true;
    }

    return requestPermission();
  }, [requestPermission]);

  const getCurrentCoordinates = useCallback(async (): Promise<Location> => {
    const position = await ExpoLocation.getCurrentPositionAsync({
      accuracy: ExpoLocation.Accuracy.Balanced,
    });

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  }, []);

  const syncAddress = useCallback(async ({ latitude, longitude }: Location) => {
    if (!isMountedRef.current) {
      return;
    }
    setLocation({ latitude, longitude });

    const addressName = await reverseGeocode(latitude, longitude);
    if (!isMountedRef.current) {
      return;
    }
    setAddress(addressName);
  }, []);

  // 위치 갱신
  const refreshLocation = useCallback(async (): Promise<Location | null> => {
    if (isRefreshingRef.current) {
      return null;
    }
    isRefreshingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const hasPermission = await ensurePermission();
      if (!hasPermission) {
        return null;
      }

      const nextLocation = await getCurrentCoordinates();
      await syncAddress(nextLocation);
      return nextLocation;
    } catch {
      if (isMountedRef.current) {
        setError("위치 정보를 가져오는데 실패했습니다.");
      }
      return null;
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      isRefreshingRef.current = false;
    }
  }, [ensurePermission, getCurrentCoordinates, syncAddress]);

  return {
    location,
    address,
    isLoading,
    error,
    requestPermission,
    refreshLocation,
  };
}
