import type { z, ZodError } from "zod";
import { DateTime } from "@repo/datetimes";
import { err, isErr, ok, type Result } from "@repo/result";
import type { SessionDTO } from "@/lib/types";
import { generateUuid } from "@/lib/utils/generate-uuid";
import { SessionSchema } from "../schemas/session.schema";
import { Session } from "../session";

export class SessionMapper {
  static toDTO(session: Session): SessionDTO {
    return {
      id: session.id,
      name: session.name,
      lecturer: session.lecturer,
      updatedAt: session.updatedAt.toISO(),
      createdAt: session.createdAt.toISO(),
      transcript: session.transcript,
      content: {
        type: "doc",
        content: session.body,
      },
    };
  }

  static parseDTO(
    dto: unknown
  ): Result<z.output<typeof SessionSchema.dtoSchema>, ZodError> {
    const parsed = SessionSchema.dtoSchema.safeParse(dto);
    if (!parsed.success) {
      return err(parsed.error);
    }
    return ok(parsed.data);
  }

  static fromParsedDTO(dto: z.output<typeof SessionSchema.dtoSchema>) {
    return new Session(
      dto.id,
      dto.name,
      dto.lecturer,
      dto.updatedAt,
      dto.createdAt,
      dto.transcript,
      dto.content.content
    );
  }

  static fromRawDTO(dto: unknown): Result<Session, ZodError> {
    const parsedResult = this.parseDTO(dto);
    if (isErr(parsedResult)) {
      return err(parsedResult.error);
    }
    return ok(this.fromParsedDTO(parsedResult.value));
  }

  static parseCreateDto(
    dto: unknown
  ): Result<z.output<typeof SessionSchema.createDtoSchema>, ZodError> {
    const parsed = SessionSchema.createDtoSchema.safeParse(dto);
    if (!parsed.success) {
      return err(parsed.error);
    }
    return ok(parsed.data);
  }

  static fromParsedCreateDto(
    dto: z.output<typeof SessionSchema.createDtoSchema>
  ) {
    return new Session(
      generateUuid(),
      dto.name,
      dto.lecturer,
      DateTime.utc(),
      DateTime.utc(),
      dto.transcript,
      dto.content.content
    );
  }
}
