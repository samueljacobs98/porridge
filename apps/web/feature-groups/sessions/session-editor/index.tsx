"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useSessionId } from "@/lib/state/providers/session-provider";
import { CreatedAtDate } from "./lib/extensions/created-at-date";
import { CustomDocument } from "./lib/extensions/custom-document";
import { ScopedSelectAll } from "./lib/extensions/scoped-select-all";
import { buildInitialContent } from "./lib/utils/build-initial-content";
import { LoadingFallback } from "./loading-fallback";

export function SessionEditor() {
  const session = useSessionId();

  const editor = useEditor({
    extensions: [
      CustomDocument,
      StarterKit.configure({ document: false }),
      CreatedAtDate,
      ScopedSelectAll,
    ],
    content: buildInitialContent(session),
    immediatelyRender: false,
  });

  if (!editor) {
    return <LoadingFallback />;
  }

  return (
    <EditorContent
      editor={editor}
      className="[&_.tiptap]:outline-none [&_.tiptap_h1]:text-2xl [&_.tiptap_h1]:font-semibold"
    />
  );
}
