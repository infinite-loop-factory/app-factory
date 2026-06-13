jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  getLastKnownPositionAsync: jest.fn(),
  Accuracy: { Balanced: 3 },
}));

import * as Location from "expo-location";
import {
  getCurrentPosition,
  getLastKnownPosition,
  getLocationPermissionStatus,
  requestLocationPermission,
} from "../index";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("requestLocationPermission", () => {
  it("granted true 면 true", async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue(
      {
        granted: true,
      },
    );
    expect(await requestLocationPermission()).toBe(true);
  });

  it("granted false 면 false", async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue(
      {
        granted: false,
      },
    );
    expect(await requestLocationPermission()).toBe(false);
  });
});

describe("getLocationPermissionStatus", () => {
  it("기존 권한 상태 반환 (request 호출하지 않음)", async () => {
    (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: true,
    });
    expect(await getLocationPermissionStatus()).toBe(true);
    expect(Location.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
  });
});

describe("getCurrentPosition", () => {
  it("권한 거부 시 null 반환 (getCurrentPositionAsync 호출 생략)", async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue(
      {
        granted: false,
      },
    );

    expect(await getCurrentPosition()).toBeNull();
    expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled();
  });

  it("권한 OK 면 latitude/longitude 만 추출하여 반환", async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue(
      {
        granted: true,
      },
    );
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: {
        latitude: 37.5,
        longitude: 127.0,
        altitude: 50,
        accuracy: 5,
      },
    });

    const result = await getCurrentPosition();

    expect(result).toEqual({ latitude: 37.5, longitude: 127.0 });
    expect(Location.getCurrentPositionAsync).toHaveBeenCalledWith({
      accuracy: Location.Accuracy.Balanced,
    });
  });
});

describe("getLastKnownPosition", () => {
  it("권한 NG 면 null", async () => {
    (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: false,
    });
    expect(await getLastKnownPosition()).toBeNull();
    expect(Location.getLastKnownPositionAsync).not.toHaveBeenCalled();
  });

  it("권한 OK 인데 cache 가 null 이면 null", async () => {
    (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: true,
    });
    (Location.getLastKnownPositionAsync as jest.Mock).mockResolvedValue(null);

    expect(await getLastKnownPosition()).toBeNull();
  });

  it("권한 OK + cache 존재면 좌표 반환", async () => {
    (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: true,
    });
    (Location.getLastKnownPositionAsync as jest.Mock).mockResolvedValue({
      coords: { latitude: 37.5, longitude: 127.0 },
    });

    expect(await getLastKnownPosition()).toEqual({
      latitude: 37.5,
      longitude: 127.0,
    });
  });
});
