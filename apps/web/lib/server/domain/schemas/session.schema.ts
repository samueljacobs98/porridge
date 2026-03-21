import z from "zod";
import { sessionBodyDocSchema } from "@/lib/schemas";
import { SessionMetadataSchema } from "./session-metadata.schema";

export class SessionSchema {
  static dtoSchema = SessionMetadataSchema.dtoSchema.extend({
    transcript: z.string(),
    content: sessionBodyDocSchema.default({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [],
        },
      ],
    }),
  });

  static createDtoSchema = this.dtoSchema.omit({
    id: true,
    updatedAt: true,
    createdAt: true,
  });
}
