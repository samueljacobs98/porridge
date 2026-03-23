import z from "zod";
import { datetimeSchema } from "@repo/datetimes";

export class SessionMetadataSchema {
  static dtoSchema = z.object({
    id: z.string(),
    name: z.string(),
    lecturer: z.string(),
    updatedAt: datetimeSchema,
    createdAt: datetimeSchema,
  });
}
