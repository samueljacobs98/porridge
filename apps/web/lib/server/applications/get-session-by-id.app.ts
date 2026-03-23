import type { Result } from "@repo/result";
import type { Session } from "../domain/session";
import type { SessionError, SessionsPort } from "../ports/sessions.port";
import { GetSessionByIdUseCase } from "../use-cases/get-session-by-id.use-case";

export class GetSessionByIdApp {
  private readonly getSessionByIdUseCase: GetSessionByIdUseCase;

  constructor(sessionsPort: SessionsPort) {
    this.getSessionByIdUseCase = new GetSessionByIdUseCase(sessionsPort);
  }

  async execute(
    sessionId: string
  ): Promise<
    Result<
      Session,
      SessionError.SESSION_NOT_FOUND | SessionError.INTERNAL_SERVER_ERROR
    >
  > {
    return this.getSessionByIdUseCase.execute(sessionId);
  }
}
