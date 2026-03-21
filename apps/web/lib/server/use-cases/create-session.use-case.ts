import type { Result } from "@repo/result";
import type { Session } from "../domain/session";
import type { SessionError, SessionsPort } from "../ports/sessions.port";

export class CreateSessionUseCase {
  constructor(private readonly sessionsPort: SessionsPort) {}

  async execute(
    session: Session
  ): Promise<
    Result<
      Session,
      SessionError.SESSION_ALREADY_EXISTS | SessionError.INTERNAL_SERVER_ERROR
    >
  > {
    return this.sessionsPort.createSession(session);
  }
}
