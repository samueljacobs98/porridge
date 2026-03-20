# Editor Content Schema

This project uses a shared Zod schema for submitted session editor content:

- `editorContentSchema` validates raw editor JSON (`sessionTitle`, `createdAtDate`, body blocks).
- `sessionContentSchema` validates persisted/submit payload JSON (`heading`, `createdAtDate`, body blocks).

Both are defined in `apps/web/lib/schemas/editor-content-schema.ts`.

## Why there are two schemas

The editor uses a custom first node called `sessionTitle`, while submitted session content stores this as a `heading` node (`level: 1`). Both flows must enforce the required `createdAtDate` node.

- **Editor runtime shape**: `sessionTitle`, `createdAtDate`, then one-or-more body blocks.
- **Submitted/persisted shape**: `heading`, `createdAtDate`, then one-or-more body blocks.

## Schema decomposition

The schema is broken into reusable pieces:

- text leaf schemas (`text` nodes)
- `sessionTitle` node schema
- `heading` node schema (H1-only)
- `createdAtDate` node schema (`attrs.date` is required string)
- body node union (`paragraph`, `bulletList`, `orderedList`, `blockquote`, `codeBlock`)
- top-level doc schemas with ordered tuple-like constraints

## Required customization guarantees

Validation enforces:

- top-level node 0 is title (`sessionTitle` in editor or `heading` in submitted content)
- top-level node 1 is `createdAtDate`
- there is at least one body block after those required nodes

This mirrors the editor customization and protects submit-time validation.

## Save flow usage

1. Read editor JSON and validate with `editorContentSchema`.
2. Convert first node from `sessionTitle` to `heading`.
3. Pass transformed payload into action wrapped with `sessionContentSchema`.
4. Action logs validated data (no persistence wiring yet).

## Valid submitted example

```json
{
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": { "level": 1 },
      "content": [{ "type": "text", "text": "Session 1" }]
    },
    {
      "type": "createdAtDate",
      "attrs": { "date": "2026-03-20T09:00:00.000Z" }
    },
    { "type": "paragraph" }
  ]
}
```

## Invalid submitted examples

- Missing `createdAtDate` as second node.
- `heading.attrs.level` not equal to `1`.
- No body blocks after `heading` and `createdAtDate`.
- `createdAtDate.attrs.date` missing or not a string.
