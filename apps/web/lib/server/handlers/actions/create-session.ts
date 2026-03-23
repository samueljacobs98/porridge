"use server";
import { err, isErr, ok } from "@repo/result";
import { action } from "@/lib/utils/action";
import { SessionsAdapter } from "../../adapters/sessions.adapter";
import { CreateSessionApp } from "../../applications/create-session.app";
import { SessionMapper } from "../../domain/mappers/session.mapper";
import { SessionError } from "../../ports/sessions.port";
import { createSessionSchema } from "../../schemas/create-session.schema";

export const createSession = action(createSessionSchema, async (data) => {
  const createSessionApp = new CreateSessionApp(new SessionsAdapter());
  const result = await createSessionApp.execute(data);
  if (isErr(result)) {
    switch (result.error) {
      case SessionError.SESSION_ALREADY_EXISTS:
      case SessionError.INTERNAL_SERVER_ERROR:
        return err(SessionError.INTERNAL_SERVER_ERROR);
    }
  }
  return ok(SessionMapper.toDTO(result.value));
});
