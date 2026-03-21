import type { Result } from "@repo/result";
import type { Session } from "../domain/session";
import type { SessionError, SessionsPort } from "../ports/sessions.port";

export class GetSessionByIdUseCase {
  constructor(private readonly sessionsPort: SessionsPort) {}

  async execute(
    sessionId: string
  ): Promise<
    Result<
      Session,
      SessionError.SESSION_NOT_FOUND | SessionError.INTERNAL_SERVER_ERROR
    >
  > {
    return this.sessionsPort.getSessionById(sessionId);
  }
}
