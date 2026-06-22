import type { LocationRegion } from "expo-location";
import type { Place } from "@/features/place/repo/types";
import type { LocationCoords } from "./index";

import * as Location from "expo-location";
import { Platform } from "react-native";
import * as placeRepo from "@/features/place/repo/place-repo";
import { requestNotificationPermission } from "@/services/notification";
import { getLastKnownPosition } from "./index";
import {
  getBackgroundLocationPermissionStatus,
  requestBackgroundLocationPermission,
  requestLocationPermission,
} from "./permissions";

/** 백그라운드 지오펜싱 task 이름. geofence-task 의 defineTask 와 동일 문자열을 공유한다. */
export const GEOFENCE_TASK = "sip-note-geofence";

/** 지오펜싱 진입 반경(m). per-place radius 는 Phase 4 설정화면 몫. */
export const DEFAULT_RADIUS_M = 500;

/**
 * 동시 모니터링 region 상한.
 * iOS 는 20개 하드리밋(CLRegion). Android(100)보다 보수적이지만 위시리스트 규모상 충분하며
 * 플랫폼 분기를 없애 단순화한다.
 */
export const MAX_REGIONS = 20;

const REGION_ID_SEPARATOR = "|";

/** region.identifier 에 placeId 와 이름을 함께 인코딩(백그라운드 DB 무조회용). */
export function encodeRegionId(placeId: string, name: string): string {
  return `${placeId}${REGION_ID_SEPARATOR}${encodeURIComponent(name)}`;
}

/** encodeRegionId 의 역연산. 구분자 미포함(legacy/단순 id)이면 name 은 빈 문자열. */
export function decodeRegionId(identifier: string): {
  placeId: string;
  name: string;
} {
  const idx = identifier.indexOf(REGION_ID_SEPARATOR);
  if (idx === -1) return { placeId: identifier, name: "" };
  return {
    placeId: identifier.slice(0, idx),
    name: decodeURIComponent(identifier.slice(idx + 1)),
  };
}

function distanceSq(a: LocationCoords, b: LocationCoords): number {
  // 근접 정렬용 상대 비교만 필요하므로 평면 근사(제곱거리)로 충분하다.
  const dLat = a.latitude - b.latitude;
  const dLng = a.longitude - b.longitude;
  return dLat * dLat + dLng * dLng;
}

/**
 * 위시리스트 Place 배열을 지오펜싱 region 배열로 변환한다(순수 함수).
 * - 좌표 없는 장소 제외
 * - origin 이 있으면 가까운 순으로 정렬, 없으면 입력 순서 유지
 * - MAX_REGIONS 초과분은 (근접순 정렬 후) 조용히 잘라낸다. iOS 20-region 하드리밋 대응.
 */
export function placesToRegions(
  places: Place[],
  origin?: LocationCoords | null,
): LocationRegion[] {
  const located = places.filter(
    (p): p is Place & { latitude: number; longitude: number } =>
      p.latitude !== null && p.longitude !== null,
  );

  const ordered = origin
    ? [...located].sort(
        (a, b) =>
          distanceSq(origin, { latitude: a.latitude, longitude: a.longitude }) -
          distanceSq(origin, { latitude: b.latitude, longitude: b.longitude }),
      )
    : located;

  return ordered.slice(0, MAX_REGIONS).map((p) => ({
    identifier: encodeRegionId(p.id, p.name),
    latitude: p.latitude,
    longitude: p.longitude,
    radius: DEFAULT_RADIUS_M,
    notifyOnEnter: true,
    notifyOnExit: false,
  }));
}

/**
 * 위시리스트 장소 기준으로 지오펜싱을 최신 상태로 동기화한다.
 * - web / 백그라운드 권한 미보유: no-op (이미 시작돼 있으면 정리)
 * - 위시리스트 0개: 모니터링 중지
 * - 그 외: nearest N region 으로 (재)시작
 * 권한 프롬프트는 하지 않는다(호출 측에서 사전 요청). 멱등.
 */
export async function syncGeofences(): Promise<void> {
  if (Platform.OS === "web") return;

  const started = await Location.hasStartedGeofencingAsync(GEOFENCE_TASK).catch(
    () => false,
  );

  const granted = await getBackgroundLocationPermissionStatus();
  if (!granted) {
    if (started) await Location.stopGeofencingAsync(GEOFENCE_TASK);
    return;
  }

  const wishlist = await placeRepo.list({ isWishlist: true });
  const origin = await getLastKnownPosition();
  const regions = placesToRegions(wishlist, origin);

  if (regions.length === 0) {
    if (started) await Location.stopGeofencingAsync(GEOFENCE_TASK);
    return;
  }

  // startGeofencingAsync 는 같은 task 로 다시 호출하면 region 집합을 교체한다.
  await Location.startGeofencingAsync(GEOFENCE_TASK, regions);
}

/**
 * 위시리스트 추가 시점의 권한 온보딩 + 동기화.
 * foreground → background(위치) → notification 순으로 요청하고 syncGeofences 로 마무리한다.
 * 어느 단계가 거부돼도 throw 하지 않으며, 권한 부족 시 syncGeofences 가 graceful no-op 한다.
 */
export async function enableWishlistGeofencing(): Promise<void> {
  if (Platform.OS === "web") return;

  const foreground = await requestLocationPermission();
  if (foreground) {
    await requestBackgroundLocationPermission();
    await requestNotificationPermission();
  }

  await syncGeofences();
}
