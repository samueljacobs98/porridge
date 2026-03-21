import type { Result } from "@repo/result";
import type { Session } from "../domain/session";
import type { SessionError, SessionsPort } from "../ports/sessions.port";
import { SaveSessionUseCase } from "../use-cases/save-session.use-case";

export class SaveSessionApp {
  private readonly saveSessionUseCase: SaveSessionUseCase;

  constructor(sessionsPort: SessionsPort) {
    this.saveSessionUseCase = new SaveSessionUseCase(sessionsPort);
  }

  async execute(
    session: Session
  ): Promise<
    Result<
      Session,
      SessionError.SESSION_NOT_FOUND | SessionError.INTERNAL_SERVER_ERROR
    >
  > {
    return this.saveSessionUseCase.execute(session);
  }
}
