import { DateTime, parseDatetime } from "@repo/datetimes";
import type { SessionMetadataDTO } from "@/lib/types";

const DEFAULT_MAX_DAYS_IN_PAST = 10;

type EarlierGroup = {
  type: "earlier";
  sessions: SessionMetadataDTO[];
};

type InRangeGroup = {
  type: "in-range";
  date: DateTime;
  sessions: SessionMetadataDTO[];
};

export type GroupedSession = EarlierGroup | InRangeGroup;

function createEarlierGroup(sessions: SessionMetadataDTO[]): EarlierGroup {
  return {
    type: "earlier",
    sessions,
  };
}

function createInRangeGroup(
  date: DateTime,
  sessions: SessionMetadataDTO[]
): InRangeGroup {
  return {
    type: "in-range",
    date,
    sessions,
  };
}

export function useGroupedSessionsMetadata(
  sessions: SessionMetadataDTO[],
  options: Partial<{
    maxDaysInPast: number;
  }> = {}
): GroupedSession[] {
  const nowDate = DateTime.now().startOf("day");
  const earlierBoundary =
    nowDate
      ?.minus({ days: options.maxDaysInPast ?? DEFAULT_MAX_DAYS_IN_PAST })
      .startOf("day") ?? null;

  const byDate = sessions.reduce<Record<string, GroupedSession>>(
    (acc, session) => {
      const dt = parseDatetime(session.createdAt)?.startOf("day");
      if (!dt) return acc;

      const isEarlier =
        earlierBoundary !== null && dt.toMillis() < earlierBoundary.toMillis();
      const key = isEarlier ? "earlier" : dt.toISODate();

      if (!key) return acc;

      if (!acc[key]) {
        acc[key] = isEarlier
          ? createEarlierGroup([])
          : createInRangeGroup(dt, []);
      }

      acc[key].sessions.push(session);
      return acc;
    },
    {}
  );

  return Object.values(byDate).sort((a, b) => {
    if (a.type === "earlier" && b.type !== "earlier") return 1;
    if (a.type !== "earlier" && b.type === "earlier") return -1;
    if (a.type === "earlier" && b.type === "earlier") return 0;
    if (a.type !== "in-range" || b.type !== "in-range") return 0;
    return b.date.toMillis() - a.date.toMillis();
  });
}
