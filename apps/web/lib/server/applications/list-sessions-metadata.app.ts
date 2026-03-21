import type { Result } from "@repo/result";
import type { SessionMetadata } from "../domain/session-metadata";
import type { SessionError, SessionsPort } from "../ports/sessions.port";
import { ListSessionsMetadataUseCase } from "../use-cases/list-sessions-metadata.use-case";

export class ListSessionsMetadataApp {
  private readonly listSessionsMetadataUseCase: ListSessionsMetadataUseCase;

  constructor(sessionsPort: SessionsPort) {
    this.listSessionsMetadataUseCase = new ListSessionsMetadataUseCase(
      sessionsPort
    );
  }

  async execute(): Promise<
    Result<SessionMetadata[], SessionError.INTERNAL_SERVER_ERROR>
  > {
    return this.listSessionsMetadataUseCase.execute();
  }
}
