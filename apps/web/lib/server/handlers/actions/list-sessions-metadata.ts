"use server";

import { err, isErr, ok, type Result } from "@repo/result";
import type { SessionMetadataDTO } from "@/lib/types";
import { action } from "@/lib/utils/action";
import { SessionsAdapter } from "../../adapters/sessions.adapter";
import { ListSessionsMetadataApp } from "../../applications/list-sessions-metadata.app";
import { SessionMetadataMapper } from "../../domain/mappers/session-metadata.mapper";
import type { SessionError } from "../../ports/sessions.port";

export const listSessionsMetadata = action(
  async (): Promise<
    Result<SessionMetadataDTO[], SessionError.INTERNAL_SERVER_ERROR>
  > => {
    const listSessionsMetadataApp = new ListSessionsMetadataApp(
      new SessionsAdapter()
    );
    const result = await listSessionsMetadataApp.execute();
    if (isErr(result)) {
      return err(result.error);
    }
    return ok(result.value.map(SessionMetadataMapper.toDTO));
  }
);
