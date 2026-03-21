# Editor Content Schema

This project uses shared Zod schemas for the session editor and persisted session body:

- `editorContentSchema` validates raw editor JSON (`sessionTitle`, `createdAtDate`, then one-or-more body blocks).
- `sessionBodyDocSchema` validates the **persisted** session document: body blocks only. Session **title** (`name`) and **createdAt** live on the session record (metadata), not inside `content`.

Both are defined in `apps/web/lib/schemas/editor-content-schema.ts`.

## Why editor shape differs from storage

The editor shows a `sessionTitle` node (editable) and a `createdAtDate` node (display, attrs filled from `session.createdAt` when opening the doc). On save, the client sends:

- `name` — derived from the `sessionTitle` text, and
- `content` — a body-only doc validated by `sessionBodyDocSchema`.

The server stores `name` / `createdAt` on the session object and persists only the body under `content`.

- **Editor runtime shape**: `sessionTitle`, `createdAtDate`, then one-or-more body blocks.
- **Persisted shape**: `doc` whose `content` is only body blocks (same body union as in the editor).

## Schema decomposition

The schema is broken into reusable pieces:

- text leaf schemas (`text` nodes)
- `sessionTitle` node schema (editor only)
- `heading` node schema (legacy persisted prefix only)
- `createdAtDate` node schema (`attrs.date` is required string in editor/legacy)
- body node union (`paragraph`, `bulletList`, `orderedList`, `blockquote`, `codeBlock`)
- top-level doc schemas with ordered tuple-like constraints

## Required customization guarantees

**Editor** validation enforces:

- top-level node 0 is `sessionTitle`
- top-level node 1 is `createdAtDate`
- at least one body block after those nodes

**Persisted body** validation enforces:

- top-level `content` is one-or-more body blocks (no title or date nodes).

## Save flow usage

1. Read editor JSON and validate with `editorContentSchema`.
2. Build `{ name, content }`: `name` from `sessionTitle`; `content` = `{ type: "doc", content: body[] }` (see `buildSavePayloadFromEditor` in the session editor save pipeline).
3. Call the `saveSession` action with `{ id, name, content }` validated by `saveSessionSchema` (uses `sessionBodyDocSchema` for `content`).

## Valid persisted body example

```json
{
  "type": "doc",
  "content": [{ "type": "paragraph" }]
}
```

## Invalid persisted examples

- No body blocks.
- A `sessionTitle` or other non-body node inside persisted `content`.
