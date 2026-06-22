jest.mock("expo-task-manager", () => ({
  defineTask: jest.fn(),
}));

jest.mock("expo-location", () => ({
  LocationGeofencingEventType: { Enter: 1, Exit: 2 },
}));

jest.mock("@/services/notification", () => ({
  presentPlaceNotification: jest.fn(),
}));

// geofence-task → geofence 가 끌어오는 무거운 모듈(place-repo/notification)을 차단.
jest.mock("@/features/place/repo/place-repo", () => ({ list: jest.fn() }));

import { LocationGeofencingEventType } from "expo-location";
import { presentPlaceNotification } from "@/services/notification";
import { encodeRegionId } from "../geofence";
import { handleGeofenceEvent, NOTIFY_COOLDOWN_MS } from "../geofence-task";

const present = presentPlaceNotification as jest.Mock;

function enterBody(identifier: string) {
  return {
    data: {
      eventType: LocationGeofencingEventType.Enter,
      region: { identifier },
    },
    error: null,
  } as never;
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("handleGeofenceEvent", () => {
  it("error body 는 알림 없이 무시한다", async () => {
    await handleGeofenceEvent({
      data: null,
      error: { message: "boom" },
    } as never);
    expect(present).not.toHaveBeenCalled();
  });

  it("Exit 이벤트는 무시한다", async () => {
    await handleGeofenceEvent({
      data: {
        eventType: LocationGeofencingEventType.Exit,
        region: { identifier: encodeRegionId("p1", "바") },
      },
      error: null,
    } as never);
    expect(present).not.toHaveBeenCalled();
  });

  it("Enter 시 identifier 를 디코딩해 알림을 띄운다", async () => {
    await handleGeofenceEvent(enterBody(encodeRegionId("p1", "위스키 바")));
    expect(present).toHaveBeenCalledWith("p1", "위스키 바");
  });

  it("쿨다운 내 재진입은 중복 알림을 보내지 않는다", async () => {
    // 모듈 레벨 쿨다운 Map 이 테스트 간 공유되므로 다른 테스트와 겹치지 않는 placeId 사용.
    const region = encodeRegionId("cooldown-1", "바");
    jest.setSystemTime(1_000);
    await handleGeofenceEvent(enterBody(region));
    expect(present).toHaveBeenCalledTimes(1);

    jest.setSystemTime(1_000 + NOTIFY_COOLDOWN_MS - 1);
    await handleGeofenceEvent(enterBody(region));
    expect(present).toHaveBeenCalledTimes(1);

    jest.setSystemTime(1_000 + NOTIFY_COOLDOWN_MS + 1);
    await handleGeofenceEvent(enterBody(region));
    expect(present).toHaveBeenCalledTimes(2);
  });
});
