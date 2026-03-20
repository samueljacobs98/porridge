import {
  DateTime,
  DatetimeFormat,
  formatDatetime,
  Settings,
} from "@repo/datetimes";
import { type SessionMetadataDTO } from "@/lib/types";
import { useGroupedSessionsMetadata } from "./use-grouped-sessions-metadata";

describe("useGroupedSessionsMetadata", () => {
  const realNow = Settings.now;

  beforeEach(() => {
    Settings.now = () => new Date("2021-01-12T12:00:00Z").valueOf();
  });

  afterEach(() => {
    Settings.now = realNow;
  });

  it("returns grouped sessions with DateTime dates", () => {
    const sessions: SessionMetadataDTO[] = [
      {
        id: "1",
        name: "Session A",
        lecturer: "Lecturer A",
        updatedAt: "2021-01-12T00:00:00Z",
        createdAt: "2021-01-12T00:00:00Z",
      },
      {
        id: "2",
        name: "Session B",
        lecturer: "Lecturer B",
        updatedAt: "2021-01-12T05:00:00Z",
        createdAt: "2021-01-12T05:00:00Z",
      },
    ];

    const grouped = useGroupedSessionsMetadata(sessions);

    expect(grouped).toHaveLength(1);
    expect(grouped[0]!.type).toBe("in-range");
    if (grouped[0]!.type === "in-range") {
      expect(DateTime.isDateTime(grouped[0]!.date)).toBe(true);
    }
    expect(grouped[0]!.sessions).toHaveLength(2);
  });

  it("groups sessions older than 10 days into an Earlier bucket by default", () => {
    const sessions: SessionMetadataDTO[] = [
      {
        id: "1",
        name: "Recent",
        lecturer: "Lecturer A",
        updatedAt: "2021-01-12T00:00:00Z",
        createdAt: "2021-01-12T00:00:00Z",
      },
      {
        id: "2",
        name: "Boundary",
        lecturer: "Lecturer B",
        updatedAt: "2021-01-02T00:00:00Z",
        createdAt: "2021-01-02T00:00:00Z",
      },
      {
        id: "3",
        name: "Older",
        lecturer: "Lecturer C",
        updatedAt: "2021-01-01T00:00:00Z",
        createdAt: "2021-01-01T00:00:00Z",
      },
    ];

    const grouped = useGroupedSessionsMetadata(sessions);

    const labels = grouped.map((group) =>
      group.type === "earlier"
        ? "Earlier"
        : formatDatetime(group.date, DatetimeFormat.Date)
    );
    expect(labels).toEqual(["12 Jan 2021", "02 Jan 2021", "Earlier"]);
    expect(grouped[2]!.type).toBe("earlier");
    expect(grouped[2]!.sessions.map((session) => session.id)).toEqual(["3"]);
  });

  it("supports a custom maxDaysInPast", () => {
    const sessions: SessionMetadataDTO[] = [
      {
        id: "1",
        name: "Recent",
        lecturer: "Lecturer A",
        updatedAt: "2021-01-12T00:00:00Z",
        createdAt: "2021-01-12T00:00:00Z",
      },
      {
        id: "2",
        name: "One Day Old",
        lecturer: "Lecturer B",
        updatedAt: "2021-01-11T00:00:00Z",
        createdAt: "2021-01-11T00:00:00Z",
      },
      {
        id: "3",
        name: "Two Days Old",
        lecturer: "Lecturer C",
        updatedAt: "2021-01-10T00:00:00Z",
        createdAt: "2021-01-10T00:00:00Z",
      },
    ];

    const grouped = useGroupedSessionsMetadata(sessions, {
      maxDaysInPast: 1,
    });

    const labels = grouped.map((group) =>
      group.type === "earlier"
        ? "Earlier"
        : formatDatetime(group.date, DatetimeFormat.Date)
    );
    expect(labels).toEqual(["12 Jan 2021", "11 Jan 2021", "Earlier"]);
    expect(grouped[2]!.sessions.map((session) => session.id)).toEqual(["3"]);
  });

  it("skips invalid datetimes", () => {
    const sessions: SessionMetadataDTO[] = [
      {
        id: "1",
        name: "Valid",
        lecturer: "Lecturer A",
        updatedAt: "2021-01-12T00:00:00Z",
        createdAt: "2021-01-12T00:00:00Z",
      },
      {
        id: "2",
        name: "Invalid",
        lecturer: "Lecturer B",
        updatedAt: "invalid",
        createdAt: "invalid",
      },
    ];

    const grouped = useGroupedSessionsMetadata(sessions);

    expect(grouped).toHaveLength(1);
    expect(grouped[0]!.sessions.map((session) => session.id)).toEqual(["1"]);
  });
});
