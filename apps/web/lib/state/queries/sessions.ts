import { getSession } from "@/lib/server/handlers/actions/get-session";
import { getSessionsMetadata } from "@/lib/server/handlers/actions/get-sessions-metadata";

export const sessionsQueries = {
  all: () => ["sessions"],
  metadata: () => ({
    queryKey: [...sessionsQueries.all(), "metadata"],
    queryFn: () => getSessionsMetadata(),
  }),
  session: (sessionId: string) => ({
    queryKey: [...sessionsQueries.all(), sessionId],
    queryFn: () => getSession(sessionId),
  }),
  metadataById: (sessionId: string) => ({
    queryKey: [...sessionsQueries.metadata().queryKey, sessionId],
    queryFn: () => getSession(sessionId),
  }),
} as const;
