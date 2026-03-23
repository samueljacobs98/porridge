import { getSessionById } from "@/lib/server/handlers/actions/get-session-by-id";
import { listSessionsMetadata } from "@/lib/server/handlers/actions/list-sessions-metadata";

export const sessionsQueries = {
  all: () => ["sessions"],
  metadata: () => ({
    queryKey: [...sessionsQueries.all(), "metadata"],
    queryFn: () => listSessionsMetadata(),
  }),
  session: (sessionId: string) => ({
    queryKey: [...sessionsQueries.all(), sessionId],
    queryFn: () => getSessionById(sessionId),
  }),
  metadataById: (sessionId: string) => ({
    queryKey: [...sessionsQueries.metadata().queryKey, sessionId],
    queryFn: () => getSessionById(sessionId),
  }),
} as const;
