import { useSyncExternalStore } from "react";
import {
  type DatetimeFormat,
  formatDatetime,
  type FormatDatetimeOptions,
  type FormattableDatetime,
} from "@repo/datetimes";

const emptySubscribe = () => () => {};

/**
 * Formats a UTC ISO string or DateTime for the client's local timezone on the
 * client only, avoiding SSR/hydration mismatches when the server and browser zones differ.
 */
export function useClientLocalFormattedDatetime(
  value: FormattableDatetime,
  format: DatetimeFormat,
  options?: FormatDatetimeOptions
): string | null {
  const locale = options?.locale;
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isClient) {
    return null;
  }

  return formatDatetime(value, format, locale ? { locale } : undefined) ?? null;
}
