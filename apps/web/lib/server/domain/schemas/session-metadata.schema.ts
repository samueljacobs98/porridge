import z from "zod";

export class SessionMetadataSchema {
  static dtoSchema = z.object({
    id: z.string(),
    name: z.string(),
    lecturer: z.string(),
    updatedAt: z.coerce.date(),
    createdAt: z.coerce.date(),
  });
}
