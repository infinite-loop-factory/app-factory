import { describe, expect, it } from "@jest/globals";
import { formatDisplayDate } from "@/features/home/utils/date-display";

describe("formatDisplayDate", () => {
  it("formats valid ISO strings", () => {
    expect(formatDisplayDate("2024-07-15")).toBe("2024.07.15");
  });

  it("returns original value when invalid", () => {
    expect(formatDisplayDate("invalid")).toBe("invalid");
  });
});
