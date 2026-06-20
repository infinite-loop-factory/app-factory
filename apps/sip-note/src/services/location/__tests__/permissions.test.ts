jest.mock("expo-location", () => ({
  requestBackgroundPermissionsAsync: jest.fn(),
  getBackgroundPermissionsAsync: jest.fn(),
}));

import * as Location from "expo-location";
import {
  getBackgroundLocationPermissionStatus,
  requestBackgroundLocationPermission,
} from "../permissions";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("requestBackgroundLocationPermission", () => {
  it("granted true 면 true", async () => {
    (Location.requestBackgroundPermissionsAsync as jest.Mock).mockResolvedValue(
      {
        granted: true,
      },
    );
    expect(await requestBackgroundLocationPermission()).toBe(true);
  });

  it("granted false 면 false", async () => {
    (Location.requestBackgroundPermissionsAsync as jest.Mock).mockResolvedValue(
      {
        granted: false,
      },
    );
    expect(await requestBackgroundLocationPermission()).toBe(false);
  });
});

describe("getBackgroundLocationPermissionStatus", () => {
  it("request 호출 없이 상태만 조회한다", async () => {
    (Location.getBackgroundPermissionsAsync as jest.Mock).mockResolvedValue({
      granted: true,
    });
    expect(await getBackgroundLocationPermissionStatus()).toBe(true);
    expect(Location.requestBackgroundPermissionsAsync).not.toHaveBeenCalled();
  });
});
