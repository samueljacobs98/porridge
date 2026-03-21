import type { Result } from "@repo/result";
import type { SessionMetadata } from "../domain/session-metadata";
import type { SessionError, SessionsPort } from "../ports/sessions.port";

export class ListSessionsMetadataUseCase {
  constructor(private readonly sessionsPort: SessionsPort) {}

  async execute(): Promise<
    Result<SessionMetadata[], SessionError.INTERNAL_SERVER_ERROR>
  > {
    return this.sessionsPort.listSessionsMetadata();
  }
}
