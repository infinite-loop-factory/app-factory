import { describe, expect, it, jest } from "@jest/globals";
import {
  type ForegroundLocationApi,
  getCurrentCoordinates,
} from "@/features/map/utils/native-location";

function createLocationApi(
  overrides: Partial<ForegroundLocationApi> = {},
): ForegroundLocationApi {
  return {
    getForegroundPermissionsAsync: async () => ({ status: "granted" }),
    requestForegroundPermissionsAsync: async () => ({ status: "granted" }),
    getCurrentPositionAsync: async () => ({
      coords: { latitude: 37.5, longitude: 127.0 },
    }),
    ...overrides,
  };
}

describe("getCurrentCoordinates", () => {
  it("returns coordinates when permission is already granted", async () => {
    const api = createLocationApi();

    await expect(getCurrentCoordinates(api)).resolves.toEqual({
      latitude: 37.5,
      longitude: 127,
    });
  });

  it("requests permission when current permission is not granted", async () => {
    const requestForegroundPermissionsAsync = jest
      .fn<ForegroundLocationApi["requestForegroundPermissionsAsync"]>()
      .mockResolvedValue({ status: "granted" });

    const api = createLocationApi({
      getForegroundPermissionsAsync: async () => ({ status: "undetermined" }),
      requestForegroundPermissionsAsync,
    });

    await expect(getCurrentCoordinates(api)).resolves.toEqual({
      latitude: 37.5,
      longitude: 127,
    });
    expect(requestForegroundPermissionsAsync).toHaveBeenCalledTimes(1);
  });

  it("returns null when permission remains denied", async () => {
    const api = createLocationApi({
      getForegroundPermissionsAsync: async () => ({ status: "denied" }),
      requestForegroundPermissionsAsync: async () => ({ status: "denied" }),
    });

    await expect(getCurrentCoordinates(api)).resolves.toBeNull();
  });

  it("returns null when location access throws", async () => {
    const api = createLocationApi({
      getCurrentPositionAsync: () =>
        Promise.reject(new Error("location error")),
    });

    await expect(getCurrentCoordinates(api)).resolves.toBeNull();
  });
});
