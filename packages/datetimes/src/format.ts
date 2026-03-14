import { DateTime } from "luxon";

export const DatetimeFormat = {
  Date: "Date", // "14 Mar 2026"
  DateWeekday: "DateWeekday", // "Sat, 14 Mar"
  DateShort: "DateShort", // "03/14/2026"
  Time: "Time", // "12:00 AM"
  Time24: "Time24", // "00:00"
  DateTime: "DateTime", // "14 Mar 2026, 12:00 AM"
  DateTimeShort: "DateTimeShort", // "3/14/26 12:00 AM"
  Iso: "Iso", // "2026-03-14T00:00:00.000+00:00"
  Relative: "Relative", // "in 2 days"
} as const;

export type DatetimeFormat =
  (typeof DatetimeFormat)[keyof typeof DatetimeFormat];

const FORMAT_TOKENS: Record<
  Exclude<DatetimeFormat, "Iso" | "Relative">,
  string
> = {
  [DatetimeFormat.Date]: "dd LLL yyyy",
  [DatetimeFormat.DateWeekday]: "ccc, d LLL",
  [DatetimeFormat.DateShort]: "MM/dd/yyyy",
  [DatetimeFormat.Time]: "h:mm a",
  [DatetimeFormat.Time24]: "HH:mm",
  [DatetimeFormat.DateTime]: "dd LLL yyyy, h:mm a",
  [DatetimeFormat.DateTimeShort]: "M/d/yy h:mm a",
};

export interface FormatDatetimeOptions {
  locale?: string;
}

export type FormattableDatetime = string | DateTime;

/**
 * Format an ISO 8601 datetime string or Luxon DateTime using a predefined
 * format preset.
 *
 * @param datetime - ISO 8601 datetime string or Luxon DateTime
 * @param format - The format preset to use
 * @param options - Optional locale for locale-aware formatting
 * @returns The formatted string, or null if the input is invalid
 */
export function formatDatetime(
  datetime: FormattableDatetime,
  format: DatetimeFormat,
  options?: FormatDatetimeOptions
): string | null {
  let dt = typeof datetime === "string" ? DateTime.fromISO(datetime) : datetime;

  if (!dt.isValid) {
    return null;
  }

  if (options?.locale) {
    dt = dt.setLocale(options.locale);
  }

  switch (format) {
    case DatetimeFormat.Iso:
      return dt.toISO();
    case DatetimeFormat.Relative:
      return dt.toRelative();
    default:
      return dt.toFormat(FORMAT_TOKENS[format]);
  }
}
