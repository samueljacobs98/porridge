export const EMPTY_TITLE_PLACEHOLDER = "New Session";
export const EMPTY_CONTENT_PLACEHOLDER = "Write notes...";

export const DEFAULT_LOCAL_DEBOUNCE_MS = 1_500;
export const DEFAULT_REMOTE_THROTTLE_MS = 8_000;
export const DEFAULT_MAX_UNSAVED_AGE_MS = 20_000;
export const DEFAULT_BASE_RETRY_DELAY_MS = 1_000;
export const DEFAULT_MAX_RETRY_DELAY_MS = 8_000;

export const SCHEDULE_REMOTE_SAVE_REASONS = [
  "change",
  "blur",
  "lifecycle",
  "max-age",
  "retry",
] as const;

export const ScheduleRemoteSaveReasonEnum = {
  CHANGE: "change",
  BLUR: "blur",
  LIFECYCLE: "lifecycle",
  MAX_AGE: "max-age",
  RETRY: "retry",
} as const;
