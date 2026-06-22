jest.mock("expo-location", () => ({
  hasStartedGeofencingAsync: jest.fn(),
  startGeofencingAsync: jest.fn(),
  stopGeofencingAsync: jest.fn(),
  getLastKnownPositionAsync: jest.fn(),
  getForegroundPermissionsAsync: jest.fn(),
  getBackgroundPermissionsAsync: jest.fn(),
  requestForegroundPermissionsAsync: jest.fn(),
  requestBackgroundPermissionsAsync: jest.fn(),
}));

jest.mock("@/features/place/repo/place-repo", () => ({
  list: jest.fn(),
}));

jest.mock("@/services/notification", () => ({
  requestNotificationPermission: jest.fn(),
}));

import type { Place } from "@/features/place/repo/types";

import * as Location from "expo-location";
import { Platform } from "react-native";
import * as placeRepo from "@/features/place/repo/place-repo";
import {
  DEFAULT_RADIUS_M,
  decodeRegionId,
  encodeRegionId,
  GEOFENCE_TASK,
  MAX_REGIONS,
  placesToRegions,
  syncGeofences,
} from "../geofence";

function makePlace(over: Partial<Place> = {}): Place {
  return {
    id: "p1",
    name: "장소",
    category: null,
    latitude: 37.5,
    longitude: 127.0,
    address: null,
    city: null,
    region: null,
    isWishlist: true,
    visitCount: 0,
    createdAt: 0,
    updatedAt: 0,
    ...over,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("encodeRegionId / decodeRegionId", () => {
  it("placeId 와 name 을 왕복 인코딩한다", () => {
    const id = encodeRegionId("uuid-1", "위스키 바");
    expect(decodeRegionId(id)).toEqual({
      placeId: "uuid-1",
      name: "위스키 바",
    });
  });

  it("구분자가 포함된 이름도 안전하게 복원한다", () => {
    const id = encodeRegionId("uuid-2", "A|B::C");
    expect(decodeRegionId(id)).toEqual({ placeId: "uuid-2", name: "A|B::C" });
  });

  it("구분자가 없는 식별자는 name 을 빈 문자열로 둔다", () => {
    expect(decodeRegionId("plain-id")).toEqual({
      placeId: "plain-id",
      name: "",
    });
  });
});

function placeIdAt(regions: { identifier?: string }[], index: number): string {
  return decodeRegionId(regions[index]?.identifier ?? "").placeId;
}

describe("placesToRegions", () => {
  it("좌표가 없는 장소는 제외한다", () => {
    const regions = placesToRegions([
      makePlace({ id: "a" }),
      makePlace({ id: "b", latitude: null }),
      makePlace({ id: "c", longitude: null }),
    ]);
    expect(regions).toHaveLength(1);
    expect(placeIdAt(regions, 0)).toBe("a");
  });

  it("기본 반경과 enter-only 플래그를 설정한다", () => {
    const region = placesToRegions([makePlace({ id: "a" })])[0];
    expect(region?.radius).toBe(DEFAULT_RADIUS_M);
    expect(region?.notifyOnEnter).toBe(true);
    expect(region?.notifyOnExit).toBe(false);
  });

  it("MAX_REGIONS 개로 cap 한다", () => {
    const places = Array.from({ length: MAX_REGIONS + 5 }, (_, i) =>
      makePlace({ id: `p${i}` }),
    );
    expect(placesToRegions(places)).toHaveLength(MAX_REGIONS);
  });

  it("origin 이 있으면 가까운 순으로 정렬한다", () => {
    const near = makePlace({ id: "near", latitude: 37.5, longitude: 127.0 });
    const far = makePlace({ id: "far", latitude: 40.0, longitude: 130.0 });
    const regions = placesToRegions([far, near], {
      latitude: 37.51,
      longitude: 127.01,
    });
    expect(placeIdAt(regions, 0)).toBe("near");
    expect(placeIdAt(regions, 1)).toBe("far");
  });
});

describe("syncGeofences", () => {
  const originalOS = Platform.OS;
  afterEach(() => {
    Platform.OS = originalOS;
  });

  it("web 에서는 no-op", async () => {
    Platform.OS = "web";
    await syncGeofences();
    expect(Location.startGeofencingAsync).not.toHaveBeenCalled();
    expect(Location.getBackgroundPermissionsAsync).not.toHaveBeenCalled();
  });

  it("백그라운드 권한이 없으면 시작하지 않는다", async () => {
    (Location.hasStartedGeofencingAsync as jest.Mock).mockResolvedValue(false);
    (Location.getBackgroundPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: false,
    });
    await syncGeofences();
    expect(Location.startGeofencingAsync).not.toHaveBeenCalled();
    expect(placeRepo.list).not.toHaveBeenCalled();
  });

  it("권한은 있으나 이미 시작된 상태에서 권한이 사라지면 중지한다", async () => {
    (Location.hasStartedGeofencingAsync as jest.Mock).mockResolvedValue(true);
    (Location.getBackgroundPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: false,
    });
    await syncGeofences();
    expect(Location.stopGeofencingAsync).toHaveBeenCalledWith(GEOFENCE_TASK);
  });

  it("위시리스트가 비면 모니터링을 중지한다", async () => {
    (Location.hasStartedGeofencingAsync as jest.Mock).mockResolvedValue(true);
    (Location.getBackgroundPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: true,
    });
    (placeRepo.list as jest.Mock).mockResolvedValue([]);
    (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: false,
    });
    await syncGeofences();
    expect(Location.stopGeofencingAsync).toHaveBeenCalledWith(GEOFENCE_TASK);
    expect(Location.startGeofencingAsync).not.toHaveBeenCalled();
  });

  it("위시리스트가 있으면 region 으로 지오펜싱을 시작한다", async () => {
    (Location.hasStartedGeofencingAsync as jest.Mock).mockResolvedValue(false);
    (Location.getBackgroundPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: true,
    });
    (placeRepo.list as jest.Mock).mockResolvedValue([makePlace({ id: "a" })]);
    (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: false,
    });
    await syncGeofences();
    expect(Location.startGeofencingAsync).toHaveBeenCalledTimes(1);
    const [task, regions] = (Location.startGeofencingAsync as jest.Mock).mock
      .calls[0];
    expect(task).toBe(GEOFENCE_TASK);
    expect(regions).toHaveLength(1);
  });
});
