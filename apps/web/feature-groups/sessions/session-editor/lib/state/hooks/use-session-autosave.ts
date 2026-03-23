import { useCallback, useEffect, useRef, useState } from "react";
import type { SaveSessionBodyDTO } from "@/lib/types";
import {
  DEFAULT_BASE_RETRY_DELAY_MS,
  DEFAULT_LOCAL_DEBOUNCE_MS,
  DEFAULT_MAX_RETRY_DELAY_MS,
  DEFAULT_MAX_UNSAVED_AGE_MS,
  DEFAULT_REMOTE_THROTTLE_MS,
  ScheduleRemoteSaveReasonEnum,
} from "../../constants";
import { saveDraftLocally } from "../../local-draft-storage";
import {
  safeBuildSavePayloadFromEditor,
  safeParseEditorContent,
  type SaveResult,
} from "../../save-pipeline";
import type { ScheduleRemoteSaveReason } from "../../types";

type AutosaveParams = {
  sessionId: string;
  getLatestRawContent: () => unknown | null;
  remoteSave: (payload: SaveSessionBodyDTO) => Promise<void>;
};

type AutosaveOptions = {
  localDebounceMs: number;
  remoteThrottleMs: number;
  maxUnsavedAgeMs: number;
  baseRetryDelayMs: number;
  maxRetryDelayMs: number;
};

export function useSessionAutosave(
  { sessionId, getLatestRawContent, remoteSave }: AutosaveParams,
  {
    localDebounceMs = DEFAULT_LOCAL_DEBOUNCE_MS,
    remoteThrottleMs = DEFAULT_REMOTE_THROTTLE_MS,
    maxUnsavedAgeMs = DEFAULT_MAX_UNSAVED_AGE_MS,
    baseRetryDelayMs = DEFAULT_BASE_RETRY_DELAY_MS,
    maxRetryDelayMs = DEFAULT_MAX_RETRY_DELAY_MS,
  }: Partial<AutosaveOptions> = {}
) {
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [lastError, setLastError] = useState<unknown | null>(null);

  const inFlightRef = useRef(false);
  const pendingRemoteRef = useRef(false);
  const retryCountRef = useRef(0);
  const dirtySinceRef = useRef<number | null>(null);
  const lastRemoteAttemptAtRef = useRef<number | null>(null);
  const lastSuccessfulRemoteSaveAtRef = useRef<number | null>(null);
  const localDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const remoteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastGoodRawContentRef = useRef<unknown | null>(null);

  const saveLocalNow = useCallback(async () => {
    const rawContent = getLatestRawContent();
    if (!rawContent) return;

    const parsedEditorContent = safeParseEditorContent(rawContent);
    if (!parsedEditorContent) {
      setLastError(
        new Error("Could not parse editor content for local autosave.")
      );
      const lastGoodRawContent = lastGoodRawContentRef.current;
      if (!lastGoodRawContent) return;
      const lastGoodParsed = safeParseEditorContent(lastGoodRawContent);
      if (!lastGoodParsed) return;
      await saveDraftLocally(sessionId, lastGoodParsed);
      return;
    }

    lastGoodRawContentRef.current = rawContent;
    await saveDraftLocally(sessionId, parsedEditorContent);
  }, [getLatestRawContent, sessionId]);

  const runRemoteSave = useCallback(async (): Promise<SaveResult> => {
    const rawContent = getLatestRawContent();
    if (!rawContent) {
      return { didSave: false, savedAt: null, error: null };
    }
    if (!isDirty && !dirtySinceRef.current) {
      return { didSave: false, savedAt: null, error: null };
    }
    if (inFlightRef.current) {
      pendingRemoteRef.current = true;
      return { didSave: false, savedAt: null, error: null };
    }

    inFlightRef.current = true;
    setIsSaving(true);
    lastRemoteAttemptAtRef.current = Date.now();

    try {
      const submittedPayload = safeBuildSavePayloadFromEditor(rawContent);
      if (!submittedPayload) {
        setIsDirty(true);
        const parseError = new Error(
          "Could not parse editor content for remote autosave."
        );
        setLastError(parseError);
        retryCountRef.current += 1;
        return { didSave: false, savedAt: null, error: parseError };
      }
      lastGoodRawContentRef.current = rawContent;

      await remoteSave(submittedPayload);
      const savedAt = Date.now();
      lastSuccessfulRemoteSaveAtRef.current = savedAt;
      setLastSavedAt(savedAt);
      setIsDirty(false);
      dirtySinceRef.current = null;
      retryCountRef.current = 0;
      setLastError(null);
      return { didSave: true, savedAt, error: null };
    } catch (error) {
      setIsDirty(true);
      setLastError(error);
      retryCountRef.current += 1;
      return { didSave: false, savedAt: null, error };
    } finally {
      inFlightRef.current = false;
      setIsSaving(false);
      if (pendingRemoteRef.current) {
        pendingRemoteRef.current = false;
        queueMicrotask(() => {
          void runRemoteSave();
        });
      }
    }
  }, [getLatestRawContent, isDirty, remoteSave]);

  const scheduleRemoteSave = useCallback(
    (reason: ScheduleRemoteSaveReason) => {
      if (
        !isDirty &&
        reason !== ScheduleRemoteSaveReasonEnum.LIFECYCLE &&
        reason !== ScheduleRemoteSaveReasonEnum.BLUR
      )
        return;
      if (remoteTimerRef.current) {
        clearTimeout(remoteTimerRef.current);
      }

      const now = Date.now();
      const lastAttempt = lastRemoteAttemptAtRef.current ?? 0;
      const elapsedSinceAttempt = now - lastAttempt;
      const throttleDelay = Math.max(0, remoteThrottleMs - elapsedSinceAttempt);
      const dirtySince = dirtySinceRef.current ?? now;
      const unsavedAge = now - dirtySince;
      const maxAgeDelay = Math.max(0, maxUnsavedAgeMs - unsavedAge);
      const retryDelay = Math.min(
        maxRetryDelayMs,
        baseRetryDelayMs * 2 ** Math.max(0, retryCountRef.current - 1)
      );

      let delay = throttleDelay;
      if (
        reason === ScheduleRemoteSaveReasonEnum.LIFECYCLE ||
        reason === ScheduleRemoteSaveReasonEnum.BLUR ||
        reason === ScheduleRemoteSaveReasonEnum.MAX_AGE
      ) {
        delay = 0;
      } else if (reason === ScheduleRemoteSaveReasonEnum.RETRY) {
        delay = Math.min(throttleDelay, retryDelay);
      } else {
        delay = Math.min(throttleDelay, maxAgeDelay);
      }

      remoteTimerRef.current = setTimeout(async () => {
        const result = await runRemoteSave();
        if (!result.didSave && isDirty) {
          scheduleRemoteSave(ScheduleRemoteSaveReasonEnum.RETRY);
        }
      }, delay);
    },
    [
      isDirty,
      runRemoteSave,
      remoteThrottleMs,
      maxUnsavedAgeMs,
      baseRetryDelayMs,
      maxRetryDelayMs,
    ]
  );

  const onEdit = useCallback(() => {
    setIsDirty(true);
    if (!dirtySinceRef.current) {
      dirtySinceRef.current = Date.now();
    }

    if (localDebounceTimerRef.current) {
      clearTimeout(localDebounceTimerRef.current);
    }
    localDebounceTimerRef.current = setTimeout(() => {
      void saveLocalNow();
    }, localDebounceMs);

    scheduleRemoteSave(ScheduleRemoteSaveReasonEnum.CHANGE);
  }, [saveLocalNow, scheduleRemoteSave, localDebounceMs]);

  const flushLifecycleSave = useCallback(() => {
    void saveLocalNow();
    if (isDirty) {
      scheduleRemoteSave(ScheduleRemoteSaveReasonEnum.LIFECYCLE);
    }
  }, [isDirty, saveLocalNow, scheduleRemoteSave]);

  const onBlur = useCallback(() => {
    if (isDirty) {
      scheduleRemoteSave(ScheduleRemoteSaveReasonEnum.BLUR);
    }
  }, [isDirty, scheduleRemoteSave]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushLifecycleSave();
      }
    };
    const handlePageHide = () => {
      flushLifecycleSave();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [flushLifecycleSave]);

  useEffect(() => {
    return () => {
      if (localDebounceTimerRef.current) {
        clearTimeout(localDebounceTimerRef.current);
      }
      if (remoteTimerRef.current) {
        clearTimeout(remoteTimerRef.current);
      }
    };
  }, []);

  return {
    isDirty,
    isSaving,
    lastSavedAt,
    lastError,
    onEdit,
    onBlur,
    flushLifecycleSave,
    scheduleRemoteSave,
  };
}
