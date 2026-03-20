"use client";

import { useEffect, useMemo } from "react";
import { cn } from "@frontend/ui/lib/utils";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Document } from "./lib/document";
import { MentionsPlaceholder } from "./lib/extensions/mentions-placeholder";
import { MultiTriggerMention } from "./lib/extensions/multi-trigger-mention";
import { SingleLineBehavior } from "./lib/extensions/single-line-behavior";
import { Paragraph } from "./lib/nodes/paragraph";
import { useMentionsTextAreaValue } from "./lib/state/hooks/use-mentions-text-area-value";
import type { MentionsTextAreaProps, SuggestionController } from "./lib/types";
import { getEditorPlainText } from "./lib/utils/get-editor-plain-text";
import { getMentionsTextAreaContent } from "./lib/utils/get-mentions-text-area-content";
import { syncEditorHeight } from "./lib/utils/sync-editor-height";
import { validateMentionsMap } from "./lib/utils/validate-mentions-map";

export type {
  MentionInsertAction,
  MentionOption,
  MentionOptionsConfig,
  MentionsMap,
  MentionsTextAreaProps,
} from "./lib/types";

/**
 * A text input with multi-trigger mention support, built on Tiptap.
 *
 * Behaves like a textarea that wraps content and auto-resizes vertically (up to
 * `maxHeight`). Shift+Enter inserts a new line; Enter submits the parent form
 * when the suggestions menu is closed; when open, Enter selects the active suggestion
 * and ArrowUp/ArrowDown navigate. Escape closes the menu.
 *
 * **Mentions:** Pass a `mentions` map of trigger character → config (e.g. `"@"`, `"/"`, `"#"`).
 * Each trigger has its own options and `insertAction` (`replace` | `prepend` | `append` | `local`).
 * Option `value`s must be unique within a trigger.
 *
 * **Value:** Uses plain text via `value`, `defaultValue`, and `onChange`. Use `name` to
 * include the value in form submissions (a hidden input is rendered).
 *
 * @example
 * ```tsx
 * <MentionsTextArea
 *   placeholder="Type / for commands..."
 *   mentions={{
 *     "/": {
 *       insertAction: "replace",
 *       options: [{ label: "Write a study plan", value: "write-study-plan" }],
 *     },
 *   }}
 * />
 * ```
 */
export function MentionsTextArea({
  value: controlledValue,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  mentions = {},
  placeholder,
  minHeight,
  maxHeight,
  disabled = false,
  readOnly = false,
  name,
  required,
  id,
  className,
  editorClassName,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  onMentionSelect,
}: MentionsTextAreaProps) {
  const suggestionController = useMemo(
    () => ({ current: null as SuggestionController | null }),
    []
  );
  const { value, setValue } = useMentionsTextAreaValue({
    defaultValue,
    onChange,
    value: controlledValue,
  });

  validateMentionsMap(mentions);

  const editor = useEditor(
    {
      extensions: [
        Document,
        StarterKit.configure({
          blockquote: false,
          bulletList: false,
          codeBlock: false,
          document: false,
          heading: false,
          horizontalRule: false,
          listItem: false,
          orderedList: false,
          paragraph: false,
        }),
        Paragraph,
        MentionsPlaceholder.configure({ placeholder }),
        SingleLineBehavior,
        MultiTriggerMention.configure({
          controllerRef: suggestionController,
          mentions,
          onMentionSelect,
        }),
      ],
      content: getMentionsTextAreaContent(value),
      editable: !disabled && !readOnly,
      immediatelyRender: false,
      editorProps: {
        attributes: {
          "aria-multiline": "true",
          class: cn(
            "tiptap min-h-0 w-full resize-none overflow-y-hidden bg-transparent p-0 text-xs break-words whitespace-pre-wrap outline-none",
            editorClassName
          ),
          role: "textbox",
          ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
          ...(ariaLabelledby ? { "aria-labelledby": ariaLabelledby } : {}),
          ...(id ? { id } : {}),
        },
        handleKeyDown: (view, event) => {
          let handled = false;
          const suggestionOpen =
            view.dom.dataset.mentionsSuggestionOpen === "true";

          if (suggestionController.current) {
            handled = suggestionController.current.handleKeyDown(event);
          }

          if (event.defaultPrevented) {
            onKeyDown?.(event as never);
            return true;
          }

          if (!suggestionOpen && event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            view.dom.closest("form")?.requestSubmit();
            handled = true;
          }

          onKeyDown?.(event as never);

          return handled || event.defaultPrevented;
        },
        handleDOMEvents: {
          blur: (_view, event) => {
            onBlur?.(event as never);
            return false;
          },
          focus: (_view, event) => {
            onFocus?.(event as never);
            return false;
          },
        },
      },
      onCreate: ({ editor: nextEditor }) => {
        syncEditorHeight(nextEditor.view.dom as HTMLElement, {
          maxHeight,
          minHeight,
        });
      },
      onUpdate: ({ editor: nextEditor }) => {
        setValue(getEditorPlainText(nextEditor));
        syncEditorHeight(nextEditor.view.dom as HTMLElement, {
          maxHeight,
          minHeight,
        });
      },
    },
    [
      ariaLabel,
      ariaLabelledby,
      disabled,
      editorClassName,
      id,
      maxHeight,
      mentions,
      minHeight,
      onBlur,
      onFocus,
      onKeyDown,
      onMentionSelect,
      placeholder,
      readOnly,
    ]
  );

  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.setEditable(!disabled && !readOnly);
  }, [disabled, editor, readOnly]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const editorValue = getEditorPlainText(editor);

    if (editorValue === value) {
      syncEditorHeight(editor.view.dom as HTMLElement, {
        maxHeight,
        minHeight,
      });
      return;
    }

    editor.commands.setContent(getMentionsTextAreaContent(value), {
      emitUpdate: false,
    });
    syncEditorHeight(editor.view.dom as HTMLElement, { maxHeight, minHeight });
  }, [editor, maxHeight, minHeight, value]);

  return (
    <div
      className={cn(
        "relative w-full rounded-2xl border border-input p-4 shadow-xs focus-within:border-ring focus-within:ring-3 focus-within:ring-primary/30",
        !editor && "min-h-12.5",
        className
      )}
    >
      {name ? (
        <input name={name} required={required} type="hidden" value={value} />
      ) : null}
      <div data-mentions-text-area-anchor>
        <EditorContent
          editor={editor}
          className={cn(
            "bg-background text-sm transition-[color,box-shadow] outline-none aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_.tiptap_p.is-empty-mentions-text-area]:before:pointer-events-none [&_.tiptap_p.is-empty-mentions-text-area]:before:float-left [&_.tiptap_p.is-empty-mentions-text-area]:before:h-0 [&_.tiptap_p.is-empty-mentions-text-area]:before:text-muted-foreground [&_.tiptap_p.is-empty-mentions-text-area]:before:content-[attr(data-placeholder)]",
            disabled && "cursor-not-allowed opacity-50",
            readOnly && "bg-muted/40"
          )}
        />
      </div>
    </div>
  );
}
