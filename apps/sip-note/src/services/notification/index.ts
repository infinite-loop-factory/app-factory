import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import i18n from "@/i18n";

/** 지오펜싱 알림이 묶이는 Android 채널 id. */
export const GEOFENCE_CHANNEL_ID = "geofence";

/** 알림 탭 시 딥링크에 사용할 data 페이로드 형태. */
export type GeofenceNotificationData = {
  type: "geofence";
  placeId: string;
};

/**
 * 포그라운드 상태에서도 배너/목록으로 알림을 표시하도록 핸들러를 설정한다.
 * SDK 54 NotificationBehavior 는 shouldShowBanner / shouldShowList 가 필수이며
 * shouldShowAlert 는 deprecated 다. 앱 진입 시 1회 호출(권한 프롬프트 없음).
 */
export function initNotifications(): void {
  if (Platform.OS === "web") return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

/**
 * Android 알림 채널을 보장한다(중복 생성은 멱등). iOS/web 은 no-op.
 * 채널이 없어도 default 로 동작하지만, 커스텀 importance 를 위해 선생성한다.
 */
export async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(GEOFENCE_CHANNEL_ID, {
    name: i18n.t("notification.geofence.title"),
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

/**
 * 알림 권한을 요청한다. iOS provisional(조용한 알림)도 허용으로 취급한다.
 * 거부 시 false 반환(호출 측에서 graceful no-op).
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  const result = await Notifications.requestPermissionsAsync();
  return isNotificationGranted(result);
}

export async function getNotificationPermissionStatus(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  const result = await Notifications.getPermissionsAsync();
  return isNotificationGranted(result);
}

function isNotificationGranted(
  status: Notifications.NotificationPermissionsStatus,
): boolean {
  if (status.granted) return true;
  // iOS provisional authorization 도 알림이 표시되므로 허용으로 간주.
  return (
    status.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

/**
 * 위시리스트 장소 근처 진입 알림을 즉시 표시한다.
 * data 에 placeId 를 실어 탭 시 장소 상세로 딥링크한다.
 * 백그라운드 task 컨텍스트에서도 호출되므로 i18n(ko 고정, 동기 init)만 의존한다.
 */
export async function presentPlaceNotification(
  placeId: string,
  placeName: string,
): Promise<void> {
  if (Platform.OS === "web") return;
  const data: GeofenceNotificationData = { type: "geofence", placeId };
  await Notifications.scheduleNotificationAsync({
    content: {
      title: i18n.t("notification.geofence.title"),
      body: i18n.t("notification.geofence.body", { name: placeName }),
      data,
    },
    trigger: null,
  });
}
