import z, { type ZodError } from "zod";
import { err, ok, type Result } from "@repo/result";
import type { SessionMetadataDTO } from "@/lib/types";

export const sessionMetadataSchema = z.object({
  id: z.string(),
  name: z.string(),
  lecturer: z.string(),
  updatedAt: z.date(),
  createdAt: z.date(),
});

export class SessionMetadata {
  protected constructor(
    protected readonly id: string,
    protected readonly name: string,
    protected readonly lecturer: string,
    protected readonly updatedAt: Date,
    protected readonly createdAt: Date
  ) {}

  toDTO(): SessionMetadataDTO {
    return {
      id: this.id,
      name: this.name,
      lecturer: this.lecturer,
      updatedAt: this.updatedAt.toISOString(),
      createdAt: this.createdAt.toISOString(),
    };
  }

  static parseDTO(dto: unknown): Result<SessionMetadata, ZodError> {
    const parsed = sessionMetadataSchema.safeParse(dto);
    if (!parsed.success) {
      return err(parsed.error);
    }
    return ok(
      new SessionMetadata(
        parsed.data.id,
        parsed.data.name,
        parsed.data.lecturer,
        parsed.data.updatedAt,
        parsed.data.createdAt
      )
    );
  }
}
