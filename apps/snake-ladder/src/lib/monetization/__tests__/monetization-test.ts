import { afterEach, describe, expect, it, jest } from "@jest/globals";
import {
  afterInterstitialShown,
  afterNewGameStarted,
  shouldShowInterstitial,
} from "@/lib/monetization/ads-policy";
import {
  AD_COOLDOWN_MS,
  AD_GAMES_INTERVAL,
} from "@/lib/monetization/constants";
import { rollGoldDie } from "@/lib/monetization/gold-dice";
import {
  DEFAULT_MONETIZATION,
  parseMonetization,
} from "@/lib/monetization/state";

describe("rollGoldDie", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns desired face when random is below 50%", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.2);
    expect(rollGoldDie(4)).toBe(4);
  });

  it("returns a non-desired face when random is above 50%", () => {
    jest.spyOn(Math, "random").mockReturnValueOnce(0.9).mockReturnValueOnce(0);
    expect(rollGoldDie(4)).toBe(1);
  });

  it("falls back to fair roll for invalid desired face", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.5);
    expect(rollGoldDie(0)).toBeGreaterThanOrEqual(1);
    expect(rollGoldDie(0)).toBeLessThanOrEqual(6);
  });
});

describe("shouldShowInterstitial", () => {
  it("skips when ad removal is purchased", () => {
    expect(
      shouldShowInterstitial({
        ...DEFAULT_MONETIZATION,
        adRemovalPurchased: true,
      }),
    ).toBe(false);
  });

  it("skips before enough games have started", () => {
    expect(
      shouldShowInterstitial({
        ...DEFAULT_MONETIZATION,
        gamesSinceLastAd: AD_GAMES_INTERVAL - 1,
      }),
    ).toBe(false);
  });

  it("skips during cooldown window", () => {
    expect(
      shouldShowInterstitial({
        ...DEFAULT_MONETIZATION,
        gamesSinceLastAd: AD_GAMES_INTERVAL,
        lastAdShownAt: Date.now() - AD_COOLDOWN_MS + 1000,
      }),
    ).toBe(false);
  });

  it("allows after interval and cooldown on native platforms", () => {
    expect(
      shouldShowInterstitial({
        ...DEFAULT_MONETIZATION,
        gamesSinceLastAd: AD_GAMES_INTERVAL,
        lastAdShownAt: Date.now() - AD_COOLDOWN_MS - 1,
      }),
    ).toBe(true);
  });
});

describe("parseMonetization", () => {
  it("returns defaults for null or malformed JSON", () => {
    expect(parseMonetization(null)).toEqual(DEFAULT_MONETIZATION);
    expect(parseMonetization("{not json")).toEqual(DEFAULT_MONETIZATION);
  });

  it("reads back a valid persisted state", () => {
    const state = {
      goldDiceCount: 12,
      adRemovalPurchased: true,
      gamesSinceLastAd: 2,
      lastAdShownAt: 1700,
    };
    expect(parseMonetization(JSON.stringify(state))).toEqual(state);
  });

  it("rejects tampered negative or non-numeric gold counts", () => {
    expect(parseMonetization('{"goldDiceCount":-5}').goldDiceCount).toBe(0);
    expect(parseMonetization('{"goldDiceCount":"999"}').goldDiceCount).toBe(
      999,
    );
    expect(parseMonetization('{"goldDiceCount":null}').goldDiceCount).toBe(0);
    expect(parseMonetization('{"goldDiceCount":1.9}').goldDiceCount).toBe(1);
  });

  it("coerces non-boolean ad removal to false", () => {
    expect(
      parseMonetization('{"adRemovalPurchased":1}').adRemovalPurchased,
    ).toBe(false);
    expect(
      parseMonetization('{"adRemovalPurchased":"true"}').adRemovalPurchased,
    ).toBe(false);
  });
});

describe("monetization counters", () => {
  it("increments games since last ad on new game", () => {
    expect(afterNewGameStarted(DEFAULT_MONETIZATION).gamesSinceLastAd).toBe(1);
  });

  it("resets ad counter and records timestamp after show", () => {
    const before = Date.now();
    const next = afterInterstitialShown({
      ...DEFAULT_MONETIZATION,
      gamesSinceLastAd: AD_GAMES_INTERVAL,
    });
    expect(next.gamesSinceLastAd).toBe(0);
    expect(next.lastAdShownAt).toBeGreaterThanOrEqual(before);
  });
});
