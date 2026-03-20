import type { ZodError } from "zod";
import { err, ok, type Result } from "@repo/result";
import { sessionContentSchema } from "@/lib/schemas/editor-content-schema";
import type { SessionContentDTO, SessionDTO } from "@/lib/types";
import { SessionMetadata, sessionMetadataSchema } from "./session-metadata";

export const sessionSchema = sessionMetadataSchema.extend({
  content: sessionContentSchema,
  enhancedContent: sessionContentSchema,
});

export class Session extends SessionMetadata {
  private constructor(
    id: string,
    name: string,
    lecturer: string,
    updatedAt: Date,
    createdAt: Date,
    private readonly content: SessionContentDTO,
    private readonly enhancedContent: SessionContentDTO
  ) {
    super(id, name, lecturer, updatedAt, createdAt);
  }

  toDTO(): SessionDTO {
    return {
      id: this.id,
      name: this.name,
      lecturer: this.lecturer,
      updatedAt: this.updatedAt.toISOString(),
      createdAt: this.createdAt.toISOString(),
      content: this.content,
      enhancedContent: this.enhancedContent,
    };
  }

  static parseDTO(dto: unknown): Result<Session, ZodError> {
    const result = sessionSchema
      .transform(
        (data) =>
          new Session(
            data.id,
            data.name,
            data.lecturer,
            data.updatedAt,
            data.createdAt,
            data.content,
            data.enhancedContent
          )
      )
      .safeParse(dto);

    return result.success ? ok(result.data) : err(result.error);
  }
}
