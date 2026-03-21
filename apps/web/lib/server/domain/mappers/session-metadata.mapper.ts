import type { z, ZodError } from "zod";
import { err, isErr, ok, type Result } from "@repo/result";
import type { SessionMetadataDTO } from "@/lib/types";
import { SessionMetadataSchema } from "../schemas/session-metadata.schema";
import { SessionMetadata } from "../session-metadata";

export class SessionMetadataMapper {
  static toDTO(metadata: SessionMetadata): SessionMetadataDTO {
    return {
      id: metadata.id,
      name: metadata.name,
      lecturer: metadata.lecturer,
      updatedAt: metadata.updatedAt.toISOString(),
      createdAt: metadata.createdAt.toISOString(),
    };
  }

  static parseDTO(
    dto: unknown
  ): Result<z.output<typeof SessionMetadataSchema.dtoSchema>, ZodError> {
    const parsed = SessionMetadataSchema.dtoSchema.safeParse(dto);
    if (!parsed.success) {
      return err(parsed.error);
    }
    return ok(parsed.data);
  }

  static fromParsedDTO(dto: z.output<typeof SessionMetadataSchema.dtoSchema>) {
    return new SessionMetadata(
      dto.id,
      dto.name,
      dto.lecturer,
      dto.updatedAt,
      dto.createdAt
    );
  }

  static fromRawDTO(dto: unknown): Result<SessionMetadata, ZodError> {
    const parsedResult = this.parseDTO(dto);
    if (isErr(parsedResult)) {
      return err(parsedResult.error);
    }
    return ok(this.fromParsedDTO(parsedResult.value));
  }
}
