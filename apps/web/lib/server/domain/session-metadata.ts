export class SessionMetadata {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly lecturer: string,
    readonly updatedAt: Date,
    readonly createdAt: Date
  ) {}
}
