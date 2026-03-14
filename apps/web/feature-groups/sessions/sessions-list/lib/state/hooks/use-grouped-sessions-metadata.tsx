import { SessionMetadata } from "@/lib/types";

// TODO: Once date package is introduced, use it to group dates directly
// TODO: We want a maxDaysInPast option - anything older than that should be
// in a "earlier" group
export function useGroupedSessionsMetadata(sessions: SessionMetadata[]) {
  return sessions.reduce<Record<string, SessionMetadata[]>>((acc, session) => {
    const day = session.createdAt.split("-")[2];
    if (!acc[day as keyof typeof acc]) {
      acc[day as keyof typeof acc] = [];
    }
    acc[day as keyof typeof acc]!.push(session);
    return acc;
  }, {});
}
