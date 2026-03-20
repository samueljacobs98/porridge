import type { SCHEDULE_REMOTE_SAVE_REASONS } from "./constants";

export type ScheduleRemoteSaveReason =
  (typeof SCHEDULE_REMOTE_SAVE_REASONS)[number];
