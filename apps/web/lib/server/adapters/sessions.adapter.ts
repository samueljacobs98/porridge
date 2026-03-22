import type { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import path from "node:path";
import type { ZodError } from "zod";
import { DateTime } from "@repo/datetimes";
import { err, isErr, isOk, ok, type Result } from "@repo/result";
import type { BodyNode, SessionDTO } from "@/lib/types";
import { SessionMetadataMapper } from "../domain/mappers/session-metadata.mapper";
import { SessionMapper } from "../domain/mappers/session.mapper";
import type { Session } from "../domain/session";
import type { SessionMetadata } from "../domain/session-metadata";
import { SessionError, type SessionsPort } from "../ports/sessions.port";

type SessionsDB = {
  sessions: Record<string, SessionDTO>;
};

const DEFAULT_DB: SessionsDB = {
  sessions: {},
};
const DB_PATH = path.resolve(process.cwd(), "../../.db/sessions.json");

async function getDb(): Promise<
  Result<Low<SessionsDB>, SessionError.INTERNAL_SERVER_ERROR>
> {
  try {
    return ok(await JSONFilePreset<SessionsDB>(DB_PATH, DEFAULT_DB));
  } catch (error) {
    console.error("get db error", JSON.stringify(error, null, 2));
    return err(SessionError.INTERNAL_SERVER_ERROR);
  }
}

export class SessionsAdapter implements SessionsPort {
  async listSessionsMetadata(): Promise<
    Result<SessionMetadata[], SessionError.INTERNAL_SERVER_ERROR>
  > {
    try {
      const getDbResult = await getDb();
      if (isErr(getDbResult)) {
        console.error(
          "get db error",
          JSON.stringify(getDbResult.error, null, 2)
        );
        return err(SessionError.INTERNAL_SERVER_ERROR);
      }
      const db = getDbResult.value;
      const [sessionsMetadata, errors] = Object.values(db.data.sessions).reduce<
        [sessionMetadata: SessionMetadata[], errors: ZodError[]]
      >(
        ([sessionsMetadata, errors], session) => {
          const sessionMetadata = SessionMetadataMapper.fromRawDTO(session);
          if (isOk(sessionMetadata)) {
            sessionsMetadata.push(sessionMetadata.value);
          } else {
            errors.push(sessionMetadata.error);
          }
          return [sessionsMetadata, errors];
        },
        [[], []]
      );

      if (errors.length > 0) {
        console.warn(
          "sessions metadata errors",
          JSON.stringify(errors, null, 2)
        );
      }
      return ok(sessionsMetadata);
    } catch (error) {
      console.error(
        "get sessions metadata error",
        JSON.stringify(error, null, 2)
      );
      return err(SessionError.INTERNAL_SERVER_ERROR);
    }
  }

  async getSessionById(
    sessionId: string
  ): Promise<
    Result<
      Session,
      SessionError.SESSION_NOT_FOUND | SessionError.INTERNAL_SERVER_ERROR
    >
  > {
    try {
      const getDbResult = await getDb();
      if (isErr(getDbResult)) {
        console.error(
          "get db error",
          JSON.stringify(getDbResult.error, null, 2)
        );
        return err(SessionError.INTERNAL_SERVER_ERROR);
      }
      const db = getDbResult.value;
      const sessionDTO = db.data.sessions[sessionId];
      if (!sessionDTO) {
        console.error(`session ${sessionId} not found`, { sessionId });
        return err(SessionError.SESSION_NOT_FOUND);
      }
      const parseSessionResult = SessionMapper.fromRawDTO(sessionDTO);
      if (isErr(parseSessionResult)) {
        console.error(
          "parse session error",
          JSON.stringify(parseSessionResult.error, null, 2)
        );
        return err(SessionError.INTERNAL_SERVER_ERROR);
      }
      return ok(parseSessionResult.value);
    } catch (error) {
      console.error("get session error", JSON.stringify(error, null, 2));
      return err(SessionError.INTERNAL_SERVER_ERROR);
    }
  }

  async createSession(
    session: Session
  ): Promise<
    Result<
      Session,
      SessionError.SESSION_ALREADY_EXISTS | SessionError.INTERNAL_SERVER_ERROR
    >
  > {
    try {
      const preexistingSession = await this.getSessionById(session.id);
      if (isOk(preexistingSession)) {
        console.error(
          "session already exists",
          JSON.stringify({ sessionId: session.id }, null, 2)
        );
        return err(SessionError.SESSION_ALREADY_EXISTS);
      }
      if (
        isErr(preexistingSession) &&
        preexistingSession.error !== SessionError.SESSION_NOT_FOUND
      ) {
        console.error(
          "get session by id error",
          JSON.stringify(preexistingSession.error, null, 2)
        );
        return err(SessionError.INTERNAL_SERVER_ERROR);
      }
      const getDbResult = await getDb();
      if (isErr(getDbResult)) {
        console.error(
          "get db error",
          JSON.stringify(getDbResult.error, null, 2)
        );
        return err(SessionError.INTERNAL_SERVER_ERROR);
      }
      const db = getDbResult.value;
      db.data.sessions[session.id] = SessionMapper.toDTO(session);
      await db.write();
      return ok(session);
    } catch (error) {
      console.error("create session error", JSON.stringify(error, null, 2));
      return err(SessionError.INTERNAL_SERVER_ERROR);
    }
  }

  async saveSession(
    sessionId: string,
    name: string,
    body: [BodyNode, ...BodyNode[]]
  ): Promise<
    Result<
      Session,
      SessionError.SESSION_NOT_FOUND | SessionError.INTERNAL_SERVER_ERROR
    >
  > {
    try {
      const preexistingSession = await this.getSessionById(sessionId);
      if (isErr(preexistingSession)) {
        return err(preexistingSession.error);
      }
      const session = preexistingSession.value;
      const getDbResult = await getDb();
      if (isErr(getDbResult)) {
        console.error(
          "get db error",
          JSON.stringify(getDbResult.error, null, 2)
        );
        return err(SessionError.INTERNAL_SERVER_ERROR);
      }
      const db = getDbResult.value;

      const now = DateTime.now();
      const written: SessionDTO = {
        id: sessionId,
        name,
        lecturer: session.lecturer,
        transcript: session.transcript,
        updatedAt: now.toISO(),
        createdAt: session.createdAt.toISO(),
        content: {
          type: "doc",
          content: body,
        },
      };
      db.data.sessions[sessionId] = written;

      await db.write();

      const parseResult = SessionMapper.fromRawDTO(written);
      if (isErr(parseResult)) {
        console.error(
          "parse session after save",
          JSON.stringify(parseResult.error, null, 2)
        );
        return err(SessionError.INTERNAL_SERVER_ERROR);
      }
      return ok(parseResult.value);
    } catch (error) {
      console.error("create session error", JSON.stringify(error, null, 2));
      return err(SessionError.INTERNAL_SERVER_ERROR);
    }
  }
}
