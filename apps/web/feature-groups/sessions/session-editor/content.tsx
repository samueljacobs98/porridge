"use client";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { EditorContent } from "@tiptap/react";
import { saveSession } from "@/lib/server/handlers/actions/save-session";
import { useSessionId } from "@/lib/state/providers/session-id-provider";
import { sessionsQueries } from "@/lib/state/queries";
import { useSessionEditor } from "./lib/state/hooks/use-session";
import { LoadingFallback } from "./loading-fallback";

export function Content() {
  const sessionId = useSessionId();
  const { data: session } = useSuspenseQuery(
    sessionsQueries.session(sessionId)
  );

  const saveMutation = useMutation({
    mutationFn: saveSession,
  });

  const editor = useSessionEditor(session, {
    onSave: async (sessionId, nextContent) => {
      await saveMutation.mutateAsync({
        id: sessionId,
        content: nextContent,
      });
    },
  });

  if (!editor) {
    return <LoadingFallback />;
  }

  return (
    <EditorContent
      editor={editor}
      className="[&_.tiptap]:outline-none [&_.tiptap_h1]:text-2xl [&_.tiptap_h1]:font-semibold [&_.tiptap_h1.is-empty-session-title]:before:pointer-events-none [&_.tiptap_h1.is-empty-session-title]:before:float-left [&_.tiptap_h1.is-empty-session-title]:before:h-0 [&_.tiptap_h1.is-empty-session-title]:before:text-muted-foreground [&_.tiptap_h1.is-empty-session-title]:before:content-[attr(data-placeholder)] [&_.tiptap_p.is-empty-session-content]:before:pointer-events-none [&_.tiptap_p.is-empty-session-content]:before:float-left [&_.tiptap_p.is-empty-session-content]:before:h-0 [&_.tiptap_p.is-empty-session-content]:before:text-muted-foreground [&_.tiptap_p.is-empty-session-content]:before:content-[attr(data-placeholder)]"
    />
  );
}
