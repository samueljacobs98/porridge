import { z } from "zod";

const textLeafSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
});

const optionalTextLeafSchema = z.object({
  type: z.literal("text"),
  text: z.string().optional(),
});

const headingNodeSchema = z.object({
  type: z.literal("heading"),
  attrs: z.object({
    level: z.literal(1),
  }),
  content: z.array(textLeafSchema).min(1),
});

const sessionTitleNodeSchema = z.object({
  type: z.literal("sessionTitle"),
  content: z.array(textLeafSchema).min(1),
});

const createdAtDateNodeSchema = z.object({
  type: z.literal("createdAtDate"),
  attrs: z.object({
    date: z.string(),
  }),
});

const paragraphNodeSchema = z.object({
  type: z.literal("paragraph"),
  content: z.array(optionalTextLeafSchema).optional(),
});

const codeBlockNodeSchema = z.object({
  type: z.literal("codeBlock"),
  attrs: z
    .object({
      language: z.string().optional(),
    })
    .optional(),
  content: z.array(optionalTextLeafSchema).optional(),
});

const listItemNodeSchema: z.ZodType<{
  type: "listItem";
  content?: z.infer<typeof sessionBodyNodeSchema>[];
}> = z.lazy(() =>
  z.object({
    type: z.literal("listItem"),
    content: z.array(sessionBodyNodeSchema).optional(),
  })
);

const bulletListNodeSchema = z.object({
  type: z.literal("bulletList"),
  content: z.array(listItemNodeSchema).optional(),
});

const orderedListNodeSchema = z.object({
  type: z.literal("orderedList"),
  content: z.array(listItemNodeSchema).optional(),
});

const blockquoteNodeSchema: z.ZodType<{
  type: "blockquote";
  content?: z.infer<typeof sessionBodyNodeSchema>[];
}> = z.lazy(() =>
  z.object({
    type: z.literal("blockquote"),
    content: z.array(sessionBodyNodeSchema).optional(),
  })
);

const sessionBodyNodeSchema = z.union([
  paragraphNodeSchema,
  bulletListNodeSchema,
  orderedListNodeSchema,
  blockquoteNodeSchema,
  codeBlockNodeSchema,
]);

export const sessionContentSchema = z.object({
  type: z.literal("doc"),
  content: z
    .tuple([headingNodeSchema, createdAtDateNodeSchema, sessionBodyNodeSchema])
    .rest(sessionBodyNodeSchema),
});

export const editorContentSchema = z.object({
  type: z.literal("doc"),
  content: z
    .tuple([
      sessionTitleNodeSchema,
      createdAtDateNodeSchema,
      sessionBodyNodeSchema,
    ])
    .rest(sessionBodyNodeSchema),
});
