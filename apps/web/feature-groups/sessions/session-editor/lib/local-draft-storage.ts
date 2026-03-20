import type { EditorContent } from "@/lib/types";

const DB_NAME = "porridge-session-editor";
const DB_VERSION = 1;
const STORE_NAME = "drafts";
const SCHEMA_VERSION = 1;

type StoredDraft = {
  schemaVersion: number;
  sessionId: string;
  savedAt: number;
  content: EditorContent;
};

const memoryDrafts = new Map<string, StoredDraft>();

function getStorageKey(sessionId: string) {
  return `session-draft:${sessionId}`;
}

function parseStoredDraft(value: string | null): StoredDraft | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as StoredDraft;
  } catch {
    return null;
  }
}

function createStoredDraft(
  sessionId: string,
  content: EditorContent
): StoredDraft {
  return {
    schemaVersion: SCHEMA_VERSION,
    sessionId,
    savedAt: Date.now(),
    content,
  };
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("IndexedDB unavailable"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () =>
      reject(request.error ?? new Error("Failed to open IndexedDB"));
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "sessionId" });
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
}

async function saveToIndexedDb(draft: StoredDraft): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () =>
      reject(tx.error ?? new Error("IndexedDB transaction failed"));
    tx.objectStore(STORE_NAME).put(draft);
  });
  db.close();
}

async function loadFromIndexedDb(
  sessionId: string
): Promise<StoredDraft | null> {
  const db = await openDb();
  const draft = await new Promise<StoredDraft | null>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    tx.onerror = () =>
      reject(tx.error ?? new Error("IndexedDB transaction failed"));
    const req = tx.objectStore(STORE_NAME).get(sessionId);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB read failed"));
    req.onsuccess = () =>
      resolve((req.result as StoredDraft | undefined) ?? null);
  });
  db.close();
  return draft;
}

function saveToLocalStorage(draft: StoredDraft) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    getStorageKey(draft.sessionId),
    JSON.stringify(draft)
  );
}

function loadFromLocalStorage(sessionId: string): StoredDraft | null {
  if (typeof window === "undefined") return null;
  return parseStoredDraft(
    window.localStorage.getItem(getStorageKey(sessionId))
  );
}

export async function saveDraftLocally(
  sessionId: string,
  content: EditorContent
) {
  const draft = createStoredDraft(sessionId, content);
  memoryDrafts.set(sessionId, draft);

  try {
    await saveToIndexedDb(draft);
    return;
  } catch (error) {
    console.error(
      "IndexedDB save failed, falling back to localStorage/memory",
      error
    );
  }

  try {
    saveToLocalStorage(draft);
  } catch (error) {
    console.error(
      "localStorage save failed, keeping in-memory draft only",
      error
    );
  }
}

export async function loadDraftLocally(
  sessionId: string
): Promise<StoredDraft | null> {
  try {
    const indexedDbDraft = await loadFromIndexedDb(sessionId);
    if (indexedDbDraft) {
      memoryDrafts.set(sessionId, indexedDbDraft);
      return indexedDbDraft;
    }
  } catch {
    // Continue with fallback chain.
  }

  try {
    const localStorageDraft = loadFromLocalStorage(sessionId);
    if (localStorageDraft) {
      memoryDrafts.set(sessionId, localStorageDraft);
      return localStorageDraft;
    }
  } catch {
    // Continue with memory fallback.
  }

  return memoryDrafts.get(sessionId) ?? null;
}
