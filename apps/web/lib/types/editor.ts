import type z from "zod";
import type { editorContentSchema } from "../schemas";

export type EditorContent = z.infer<typeof editorContentSchema>;
