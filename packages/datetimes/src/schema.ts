import { DateTime } from "luxon";
import { z } from "zod";

export const datetimeSchema = z.string().transform((value, ctx) => {
  const dt = DateTime.fromISO(value);

  if (!dt.isValid) {
    ctx.addIssue({
      code: "custom",
      message: "Invalid datetime",
    });
    return z.NEVER;
  }

  return dt.toUTC();
});
