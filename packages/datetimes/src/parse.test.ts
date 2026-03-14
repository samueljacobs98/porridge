import { parseDatetime } from "./parse";

describe("parseDatetime", () => {
  it("parses valid ISO string to DateTime", () => {
    const dt = parseDatetime("2021-01-12T00:00:00Z");
    expect(dt).not.toBeNull();
    expect(dt!.year).toBe(2021);
    expect(dt!.month).toBe(1);
    expect(dt!.day).toBe(12);
  });

  it("returns null for invalid string", () => {
    expect(parseDatetime("not-a-date")).toBeNull();
    expect(parseDatetime("")).toBeNull();
  });
});
