"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { EditorContent } from "@tiptap/react";
import { useSaveSessionMutation } from "@/lib/state/mutations";
import { useSessionId } from "@/lib/state/providers/session-id-provider";
import { sessionsQueries } from "@/lib/state/queries";
import { useSessionEditor } from "./lib/state/hooks/use-session";
import { LoadingFallback } from "./loading-fallback";

export function Content() {
  const sessionId = useSessionId();
  const { data: session } = useSuspenseQuery(
    sessionsQueries.session(sessionId)
  );

  const saveMutation = useSaveSessionMutation();

  const editor = useSessionEditor(session, {
    onSave: async (payload, session) => {
      await saveMutation.mutateAsync({
        ...session,
        name: payload.name,
        content: payload.content,
      });
    },
  });

  if (!editor) {
    return <LoadingFallback />;
  }

  return (
    <EditorContent
      editor={editor}
      className="[&_.tiptap]:outline-none [&_.tiptap_h1]:text-2xl [&_.tiptap_h1]:font-semibold [&_.tiptap_h1.is-empty-session-title]:before:pointer-events-none [&_.tiptap_h1.is-empty-session-title]:before:float-left [&_.tiptap_h1.is-empty-session-title]:before:h-0 [&_.tiptap_h1.is-empty-session-title]:before:text-muted-foreground [&_.tiptap_h1.is-empty-session-title]:before:content-[attr(data-placeholder)] [&_.tiptap_p.is-empty-session-content]:before:pointer-events-none [&_.tiptap_p.is-empty-session-content]:before:float-left [&_.tiptap_p.is-empty-session-content]:before:h-0 [&_.tiptap_p.is-empty-session-content]:before:text-muted-foreground [&_.tiptap_p.is-empty-session-content]:before:content-[attr(data-placeholder)] [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-6 [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-6 [&_.tiptap_li]:my-0.5"
    />
  );
}
