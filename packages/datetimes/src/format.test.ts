import { DateTime } from "luxon";
import { DatetimeFormat, formatDatetime } from "./format";

describe("formatDatetime", () => {
  const validIso = "2021-01-12T00:00:00Z";
  const validIsoWithTime = "2021-03-10T14:30:00Z";

  it("formats Date as dd LLL yyyy", () => {
    expect(formatDatetime(validIso, DatetimeFormat.Date)).toBe("12 Jan 2021");
  });

  it("formats DateWeekday as ccc, d LLL", () => {
    expect(formatDatetime(validIsoWithTime, DatetimeFormat.DateWeekday)).toBe(
      "Wed, 10 Mar"
    );
  });

  it("formats DateShort as MM/dd/yyyy", () => {
    expect(formatDatetime(validIso, DatetimeFormat.DateShort)).toBe(
      "01/12/2021"
    );
  });

  it("formats Time with 12h am/pm", () => {
    expect(formatDatetime(validIsoWithTime, DatetimeFormat.Time)).toBe(
      "2:30 PM"
    );
  });

  it("formats Time24 with 24h", () => {
    expect(formatDatetime(validIsoWithTime, DatetimeFormat.Time24)).toBe(
      "14:30"
    );
  });

  it("formats DateTime", () => {
    expect(formatDatetime(validIso, DatetimeFormat.DateTime)).toBe(
      "12 Jan 2021, 12:00 AM"
    );
  });

  it("formats DateTimeShort", () => {
    expect(formatDatetime(validIso, DatetimeFormat.DateTimeShort)).toBe(
      "1/12/21 12:00 AM"
    );
  });

  it("formats a Luxon DateTime directly", () => {
    const dt = DateTime.fromISO(validIsoWithTime);

    expect(formatDatetime(dt, DatetimeFormat.DateTime)).toBe(
      "10 Mar 2021, 2:30 PM"
    );
    expect(formatDatetime(dt, DatetimeFormat.DateWeekday)).toBe("Wed, 10 Mar");
  });

  it("formats Iso as full ISO string", () => {
    const result = formatDatetime(validIso, DatetimeFormat.Iso);
    expect(result).toContain("2021-01-12");
    expect(result).toContain("00:00:00");
  });

  it("formats Relative for past dates", () => {
    const past = "2020-01-01T00:00:00Z";
    const result = formatDatetime(past, DatetimeFormat.Relative);
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("returns null for invalid datetime", () => {
    expect(formatDatetime("not-a-date", DatetimeFormat.Date)).toBeNull();
    expect(formatDatetime("", DatetimeFormat.Date)).toBeNull();
    expect(formatDatetime("2021-13-45", DatetimeFormat.Date)).toBeNull();
    expect(
      formatDatetime(DateTime.fromISO("not-a-date"), DatetimeFormat.Date)
    ).toBeNull();
  });

  it("respects locale option", () => {
    const result = formatDatetime(validIso, DatetimeFormat.Date, {
      locale: "fr",
    });
    expect(result).toBe("12 janv. 2021");
  });
});
