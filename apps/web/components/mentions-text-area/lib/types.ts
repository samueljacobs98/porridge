import type { FocusEventHandler, KeyboardEventHandler } from "react";

/**
 * - `replace`: replace all content in the text editor
 * - `prepend`: insert the mention at the beginning of the text editor
 * - `append`: insert the mention at the end of the text editor
 * - `local`: insert the mention at the current cursor position
 */
export type MentionInsertAction = "replace" | "prepend" | "append" | "local";

export type MentionOption = {
  label: string;
  value: string;
};

export type MentionOptionsConfig = {
  insertAction?: MentionInsertAction;
  options: MentionOption[];
};

export type MentionsMap = Record<string, MentionOptionsConfig>;

export type MentionsTextAreaProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onFocus?: FocusEventHandler<HTMLElement>;
  onBlur?: FocusEventHandler<HTMLElement>;
  onKeyDown?: KeyboardEventHandler<HTMLElement>;
  mentions?: MentionsMap;
  placeholder?: string;
  minHeight?: number | string;
  maxHeight?: number | string;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  required?: boolean;
  id?: string;
  className?: string;
  editorClassName?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  onMentionSelect?: (trigger: string, option: MentionOption) => void;
};

export type MentionSuggestionItem = {
  trigger: string;
  option: MentionOption;
  insertAction: MentionInsertAction;
};

export type SuggestionController = {
  handleKeyDown: (event: {
    defaultPrevented?: boolean;
    key: string;
    preventDefault: () => void;
  }) => boolean;
};
