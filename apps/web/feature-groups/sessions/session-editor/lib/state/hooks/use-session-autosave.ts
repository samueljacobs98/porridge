import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SessionContent } from "@/lib/schemas/editor-content-schema";
import { saveDraftLocally } from "../../local-draft-storage";
import {
  safeBuildSubmittedContent,
  safeParseEditorContent,
  type SaveResult,
} from "../../save-pipeline";

const LOCAL_DEBOUNCE_MS = 1500;
const REMOTE_THROTTLE_MS = 8000;
const MAX_UNSAVED_AGE_MS = 20000;
const BASE_RETRY_DELAY_MS = 1000;
const MAX_RETRY_DELAY_MS = 8000;

type AutosaveOptions = {
  sessionId: string;
  getLatestRawContent: () => unknown | null;
  remoteSave: (content: SessionContent) => Promise<void>;
};

export function useSessionAutosave({
  sessionId,
  getLatestRawContent,
  remoteSave,
}: AutosaveOptions) {
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
      const submittedContent = safeBuildSubmittedContent(rawContent);
      if (!submittedContent) {
        setIsDirty(true);
        const parseError = new Error(
          "Could not parse editor content for remote autosave."
        );
        setLastError(parseError);
        retryCountRef.current += 1;
        return { didSave: false, savedAt: null, error: parseError };
      }
      lastGoodRawContentRef.current = rawContent;

      await remoteSave(submittedContent);
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
    (reason: "change" | "blur" | "lifecycle" | "max-age" | "retry") => {
      if (!isDirty && reason !== "lifecycle" && reason !== "blur") return;
      if (remoteTimerRef.current) {
        clearTimeout(remoteTimerRef.current);
      }

      const now = Date.now();
      const lastAttempt = lastRemoteAttemptAtRef.current ?? 0;
      const elapsedSinceAttempt = now - lastAttempt;
      const throttleDelay = Math.max(
        0,
        REMOTE_THROTTLE_MS - elapsedSinceAttempt
      );
      const dirtySince = dirtySinceRef.current ?? now;
      const unsavedAge = now - dirtySince;
      const maxAgeDelay = Math.max(0, MAX_UNSAVED_AGE_MS - unsavedAge);
      const retryDelay = Math.min(
        MAX_RETRY_DELAY_MS,
        BASE_RETRY_DELAY_MS * 2 ** Math.max(0, retryCountRef.current - 1)
      );

      let delay = throttleDelay;
      if (reason === "lifecycle" || reason === "blur" || reason === "max-age") {
        delay = 0;
      } else if (reason === "retry") {
        delay = Math.min(throttleDelay, retryDelay);
      } else {
        delay = Math.min(throttleDelay, maxAgeDelay);
      }

      remoteTimerRef.current = setTimeout(async () => {
        const result = await runRemoteSave();
        if (!result.didSave && isDirty) {
          scheduleRemoteSave("retry");
        }
      }, delay);
    },
    [isDirty, runRemoteSave]
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
    }, LOCAL_DEBOUNCE_MS);

    scheduleRemoteSave("change");
  }, [saveLocalNow, scheduleRemoteSave]);

  const flushLifecycleSave = useCallback(() => {
    void saveLocalNow();
    if (isDirty) {
      scheduleRemoteSave("lifecycle");
    }
  }, [isDirty, saveLocalNow, scheduleRemoteSave]);

  const onBlur = useCallback(() => {
    if (isDirty) {
      scheduleRemoteSave("blur");
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

  const status = useMemo(() => {
    if (isSaving) return "Saving...";
    if (isDirty && lastError) return "Retrying...";
    if (lastSavedAt) return "Saved";
    return "Idle";
  }, [isDirty, isSaving, lastError, lastSavedAt]);

  return {
    isDirty,
    isSaving,
    lastSavedAt,
    lastError,
    status,
    onEdit,
    onBlur,
    flushLifecycleSave,
    scheduleRemoteSave,
  };
}
