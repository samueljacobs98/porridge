"use server";

import { err, isErr, ok, type Result } from "@repo/result";
import type { SessionDTO } from "@/lib/types";
import { action } from "@/lib/utils/action";
import { SessionsAdapter } from "../../adapters/sessions.adapter";
import { SaveSessionApp } from "../../applications/save-session.app";
import { SessionMapper } from "../../domain/mappers/session.mapper";
import type { SessionError } from "../../ports/sessions.port";
import { saveSessionSchema } from "../../schemas/save-session.schema";

export const saveSession = action(
  saveSessionSchema,
  async (
    data
  ): Promise<
    Result<
      SessionDTO,
      SessionError.SESSION_NOT_FOUND | SessionError.INTERNAL_SERVER_ERROR
    >
  > => {
    const saveSessionApp = new SaveSessionApp(new SessionsAdapter());
    const result = await saveSessionApp.execute(data);
    if (isErr(result)) {
      return err(result.error);
    }
    return ok(SessionMapper.toDTO(result.value));
  }
);
