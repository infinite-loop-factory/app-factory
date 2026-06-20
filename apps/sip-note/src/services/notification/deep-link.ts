import type { NotificationResponse } from "expo-notifications";

import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

function extractPlaceId(response: NotificationResponse | null): string | null {
  const data = response?.notification.request.content.data;
  if (!data || data.type !== "geofence") return null;
  const placeId = data.placeId;
  return typeof placeId === "string" && placeId.length > 0 ? placeId : null;
}

/**
 * 지오펜싱 알림 탭 → 장소 상세 딥링크.
 * - warm: addNotificationResponseReceivedListener
 * - cold start(앱 종료 상태에서 알림으로 실행): getLastNotificationResponseAsync
 * router 가 마운트된 컴포넌트(_layout)에서 호출해야 push 가 안전하다.
 */
export function useNotificationDeepLink(): void {
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS === "web") return;

    let cancelled = false;
    const goToPlace = (placeId: string) => {
      router.push(`/place/${placeId}`);
    };

    // cold start 1회 처리.
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (cancelled) return;
      const placeId = extractPlaceId(response);
      if (placeId) goToPlace(placeId);
    });

    // warm: 앱 실행 중 알림 탭.
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const placeId = extractPlaceId(response);
        if (placeId) goToPlace(placeId);
      },
    );

    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, [router]);
}
