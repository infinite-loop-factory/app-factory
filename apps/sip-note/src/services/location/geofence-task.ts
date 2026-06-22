import type { LocationRegion } from "expo-location";
import type { TaskManagerTaskBody } from "expo-task-manager";

import { LocationGeofencingEventType } from "expo-location";
import * as TaskManager from "expo-task-manager";
import { Platform } from "react-native";
import { presentPlaceNotification } from "@/services/notification";
import { decodeRegionId, GEOFENCE_TASK } from "./geofence";

export { GEOFENCE_TASK };

/** 동일 장소 반복 진입 알림 쿨다운(ms). 경계 지터로 인한 연속 알림을 억제한다. */
export const NOTIFY_COOLDOWN_MS = 30 * 60 * 1000;

// 모듈 레벨 best-effort dedupe. 백그라운드 wakeup 이 새 JS 컨텍스트면 초기화되지만,
// iOS 는 경계 진입 시 Enter 를 1회만 발화하므로 네이티브 dedup 이 1차 방어선이다.
const lastNotifiedAt = new Map<string, number>();

type GeofenceEventData = {
  eventType: LocationGeofencingEventType;
  region: LocationRegion;
};

/** 쿨다운 내 재진입이면 false. 알림을 보내기로 결정하면 timestamp 를 갱신한다. */
function shouldNotify(placeId: string, now: number): boolean {
  const last = lastNotifiedAt.get(placeId);
  if (last !== undefined && now - last < NOTIFY_COOLDOWN_MS) return false;
  lastNotifiedAt.set(placeId, now);
  return true;
}

/**
 * 지오펜싱 이벤트 핸들러(defineTask 와 분리해 테스트 가능하게 export).
 * Enter 이벤트만 처리하고, region.identifier 를 디코딩해 DB 조회 없이 알림을 띄운다.
 */
export async function handleGeofenceEvent(
  body: TaskManagerTaskBody<GeofenceEventData>,
): Promise<void> {
  // 백그라운드 task 오류는 알림 없이 무시한다(다음 이벤트에서 자연 복구).
  if (body.error) return;
  const { eventType, region } = body.data ?? {};
  if (eventType !== LocationGeofencingEventType.Enter) return;
  if (!region?.identifier) return;

  const { placeId, name } = decodeRegionId(region.identifier);
  if (!placeId) return;
  if (!shouldNotify(placeId, Date.now())) return;

  await presentPlaceNotification(placeId, name);
}

// task 는 모듈 top-level(React 라이프사이클 밖)에서 등록해야 백그라운드 wakeup 시에도
// 번들 로드 시점에 핸들러가 연결된다. web 은 task-manager 미지원이라 건너뛴다.
if (Platform.OS !== "web") {
  TaskManager.defineTask(GEOFENCE_TASK, handleGeofenceEvent);
}
