import { describe, expect, it, jest } from "@jest/globals";
import {
  animateToBrowserLocation,
  type BrowserGeolocation,
} from "@/features/map/utils/browser-geolocation";

describe("animateToBrowserLocation", () => {
  it("returns false when geolocation is not available", () => {
    const onSuccess =
      jest.fn<(coords: { latitude: number; longitude: number }) => void>();

    const result = animateToBrowserLocation({
      geolocation: null,
      onSuccess,
    });

    expect(result).toBe(false);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("forwards coordinates to success callback", () => {
    const geolocation: BrowserGeolocation = {
      getCurrentPosition: (onSuccess) => {
        onSuccess({
          coords: { latitude: 48.8566, longitude: 2.3522 },
        });
      },
    };
    const onSuccess =
      jest.fn<(coords: { latitude: number; longitude: number }) => void>();

    const result = animateToBrowserLocation({ geolocation, onSuccess });

    expect(result).toBe(true);
    expect(onSuccess).toHaveBeenCalledWith({
      latitude: 48.8566,
      longitude: 2.3522,
    });
  });

  it("forwards errors to error callback", () => {
    const error = new Error("geolocation denied");
    const geolocation: BrowserGeolocation = {
      getCurrentPosition: (_onSuccess, onError) => {
        onError?.(error);
      },
    };
    const onError = jest.fn<(error: unknown) => void>();
    const onSuccess =
      jest.fn<(coords: { latitude: number; longitude: number }) => void>();

    const result = animateToBrowserLocation({
      geolocation,
      onSuccess,
      onError,
    });

    expect(result).toBe(true);
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(error);
  });
});
