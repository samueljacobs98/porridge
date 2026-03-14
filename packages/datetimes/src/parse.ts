import { DateTime } from "luxon";

/**
 * Parse an ISO 8601 datetime string into a Luxon DateTime.
 *
 * @param datetime - ISO 8601 datetime string (e.g. "2021-01-12T00:00:00Z")
 * @returns A valid DateTime, or null if the input is invalid
 */
export function parseDatetime(datetime: string): DateTime | null {
  const dt = DateTime.fromISO(datetime);
  return dt.isValid ? dt : null;
}
