"use server";

import { err, isErr, ok, type Result } from "@repo/result";
import type { SessionDTO } from "@/lib/types";
import { action } from "@/lib/utils/action";
import { SessionsAdapter } from "../../adapters/sessions.adapter";
import { GetSessionByIdApp } from "../../applications/get-session-by-id.app";
import { SessionMapper } from "../../domain/mappers/session.mapper";
import type { SessionError } from "../../ports/sessions.port";
import { getSessionSchema } from "../../schemas/get-session.schema";

export const getSessionById = action(
  getSessionSchema,
  async (
    sessionId
  ): Promise<
    Result<
      SessionDTO,
      SessionError.SESSION_NOT_FOUND | SessionError.INTERNAL_SERVER_ERROR
    >
  > => {
    const getSessionByIdApp = new GetSessionByIdApp(new SessionsAdapter());
    const result = await getSessionByIdApp.execute(sessionId);
    if (isErr(result)) {
      return err(result.error);
    }
    return ok(SessionMapper.toDTO(result.value));
  }
);
