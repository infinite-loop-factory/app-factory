import type { User } from "@supabase/supabase-js";

import { describe, expect, it, jest } from "@jest/globals";
import { ensureValidForm } from "@/features/home/utils/form-validation";

// mock i18n default and date-range before importing
jest.mock("@/lib/i18n", () => ({
  __esModule: true,
  default: { t: (k: string) => k },
}));
jest.mock("@/utils/date-range", () => ({
  buildIsoDateRange: (_s: string, _e: string) => ["2024-01-01"],
}));

describe("ensureValidForm", () => {
  const validUser = {
    id: "user-1",
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    created_at: "2024-01-01T00:00:00.000Z",
  } as unknown as User;

  it("throws when user is null", () => {
    expect(() =>
      ensureValidForm({
        user: null,
        selectedCountry: "FR",
        startDate: "2024-01-01",
        endDate: "2024-01-02",
        isRangeInvalid: false,
      }),
    ).toThrow();
  });

  it("throws when selectedCountry is missing", () => {
    expect(() =>
      ensureValidForm({
        user: validUser,
        selectedCountry: null,
        startDate: "2024-01-01",
        endDate: "2024-01-02",
        isRangeInvalid: false,
      }),
    ).toThrow();
  });

  it("throws when dates are missing", () => {
    expect(() =>
      ensureValidForm({
        user: validUser,
        selectedCountry: "FR",
        startDate: "",
        endDate: "",
        isRangeInvalid: false,
      }),
    ).toThrow();
  });

  it("throws when isRangeInvalid is true", () => {
    expect(() =>
      ensureValidForm({
        user: validUser,
        selectedCountry: "FR",
        startDate: "2024-01-01",
        endDate: "2024-01-02",
        isRangeInvalid: true,
      }),
    ).toThrow();
  });

  it("returns userId, countryCode and rangeDates when valid", () => {
    const res = ensureValidForm({
      user: validUser,
      selectedCountry: "FR",
      startDate: "2024-01-01",
      endDate: "2024-01-02",
      isRangeInvalid: false,
    });
    expect(res).toEqual({
      userId: "user-1",
      countryCode: "FR",
      rangeDates: ["2024-01-01"],
    });
  });
});
