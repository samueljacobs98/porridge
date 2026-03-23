import type { Result } from "@repo/result";
import type { BodyNode } from "@/lib/types";
import type { Session } from "../domain/session";
import type { SessionMetadata } from "../domain/session-metadata";

export enum SessionError {
  SESSION_ALREADY_EXISTS = "SESSION_ALREADY_EXISTS",
  SESSION_NOT_FOUND = "SESSION_NOT_FOUND",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

export interface SessionsPort {
  listSessionsMetadata: () => Promise<
    Result<SessionMetadata[], SessionError.INTERNAL_SERVER_ERROR>
  >;
  getSessionById: (
    sessionId: string
  ) => Promise<
    Result<
      Session,
      SessionError.SESSION_NOT_FOUND | SessionError.INTERNAL_SERVER_ERROR
    >
  >;
  createSession: (
    session: Session
  ) => Promise<
    Result<
      Session,
      SessionError.SESSION_ALREADY_EXISTS | SessionError.INTERNAL_SERVER_ERROR
    >
  >;
  saveSession: (
    sessionId: string,
    name: string,
    body: [BodyNode, ...BodyNode[]]
  ) => Promise<
    Result<
      Session,
      SessionError.SESSION_NOT_FOUND | SessionError.INTERNAL_SERVER_ERROR
    >
  >;
}
