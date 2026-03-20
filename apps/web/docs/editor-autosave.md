# Editor Autosave

The session editor now uses autosave-only behavior with `@tanstack/form` as the state layer.

## Goals

- Prevent data loss with fast local persistence and regular remote persistence.
- Avoid excessive network requests.
- Handle tab/background/mobile lifecycle reliably.
- Recover cleanly from local or remote failures.

## Timing policy

- Local debounce save: **1500ms** after last edit.
- Remote throttle save: **at most once every 8000ms** while dirty.
- Max unsaved age: **20000ms** (force remote save attempt).
- Lifecycle flush: immediate on `visibilitychange` (hidden) and `pagehide`.

## Dirty state model

- `isDirty` is set to `true` on every edit.
- Local saves never clear `isDirty`.
- Successful remote save clears `isDirty` and records `lastSavedAt`.
- Failed remote save keeps `isDirty=true` and retries on next cycle.

## Local persistence strategy

Storage order:

1. IndexedDB (primary)
2. localStorage (fallback)
3. In-memory map (final fallback)

If IndexedDB/localStorage fail, errors are logged and editor state remains in memory.

## Remote save strategy

- Remote writes use throttled scheduling while dirty.
- Overlapping requests are prevented; at most one in-flight request exists.
- If changes occur during an in-flight save, a trailing save is queued.
- Retry delay uses bounded exponential backoff, but max-unsaved-age and lifecycle triggers can force immediate attempts.

## Trigger sources

- Edit events (`onUpdate`) for normal autosave cadence.
- Editor blur for immediate remote save attempt when dirty.
- Lifecycle events (`visibilitychange`, `pagehide`) for forced flush.

## Performance model (parse-at-boundary)

- TipTap keeps the live document state during typing.
- `onUpdate` only updates dirty state and a raw in-memory snapshot reference.
- Zod parsing no longer runs on every keystroke.
- Parsing happens only when a save boundary runs:
  - local debounce flush
  - remote throttle/max-age save
  - blur/lifecycle forced flush

This keeps typing responsive for large documents while preserving validation at durability boundaries.

## Validation contract

Before remote save:

- Editor JSON is transformed (`sessionTitle` -> `heading`).
- Submitted payload is validated by shared Zod schema via `action.ts`.
- Current remote action still logs validated payload (no backend persistence wiring yet).
- If boundary parsing fails, autosave keeps dirty state, retains the last good snapshot, and retries on the next cycle.
