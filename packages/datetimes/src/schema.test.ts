import { DateTime } from "luxon";
import { datetimeSchema } from "./schema";

describe("datetimeSchema", () => {
  it("parses valid ISO string to DateTime", () => {
    const result = datetimeSchema.safeParse("2021-01-12T00:00:00.000Z");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBeInstanceOf(DateTime);
      expect(result.data.isValid).toBe(true);
      expect(result.data.zoneName).toBe("UTC");
      expect(result.data.year).toBe(2021);
      expect(result.data.month).toBe(1);
      expect(result.data.day).toBe(12);
    }
  });

  it("rejects invalid datetime string", () => {
    const result = datetimeSchema.safeParse("not-a-date");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: "Invalid datetime",
          }),
        ])
      );
    }
  });

  it("rejects empty string", () => {
    const result = datetimeSchema.safeParse("");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: "Invalid datetime",
          }),
        ])
      );
    }
  });
});
