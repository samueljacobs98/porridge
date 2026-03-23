"use client";
import type {
  DatetimeFormat,
  FormatDatetimeOptions,
  FormattableDatetime,
} from "@repo/datetimes";
import { useClientLocalFormattedDatetime } from "@/lib/hooks/use-client-local-formatted-datetime";

export function ClientLocalFormattedDatetime({
  format,
  options,
  children: iso,
}: {
  format: DatetimeFormat;
  options?: FormatDatetimeOptions;
  children: FormattableDatetime;
}) {
  const formatted = useClientLocalFormattedDatetime(iso, format, options);
  return <>{formatted ?? "\u00a0"}</>;
}
