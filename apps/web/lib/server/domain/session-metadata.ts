import type { ValidDateTime } from "@repo/datetimes";

export class SessionMetadata {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly lecturer: string,
    readonly updatedAt: ValidDateTime,
    readonly createdAt: ValidDateTime
  ) {}
}
