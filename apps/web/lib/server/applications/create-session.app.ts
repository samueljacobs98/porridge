import type { Result } from "@repo/result";
import type { Session } from "../domain/session";
import type { SessionError, SessionsPort } from "../ports/sessions.port";
import { CreateSessionUseCase } from "../use-cases/create-session.use-case";

export class CreateSessionApp {
  private readonly createSessionUseCase: CreateSessionUseCase;

  constructor(sessionsPort: SessionsPort) {
    this.createSessionUseCase = new CreateSessionUseCase(sessionsPort);
  }

  async execute(
    session: Session
  ): Promise<
    Result<
      Session,
      SessionError.SESSION_ALREADY_EXISTS | SessionError.INTERNAL_SERVER_ERROR
    >
  > {
    return this.createSessionUseCase.execute(session);
  }
}
