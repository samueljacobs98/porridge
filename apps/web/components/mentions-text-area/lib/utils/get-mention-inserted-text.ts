import type { MentionInsertAction } from "../types";

type GetMentionInsertedTextArgs = {
  insertAction: MentionInsertAction;
  label: string;
  textAfterSelection: string;
  textBeforeSelection: string;
};

export function getMentionInsertedText({
  insertAction,
  label,
  textAfterSelection,
  textBeforeSelection,
}: GetMentionInsertedTextArgs) {
  const mentionText = label;
  const remainingText = mergeText(textBeforeSelection, textAfterSelection);

  if (insertAction === "replace") {
    return mentionText;
  }

  if (insertAction === "prepend") {
    return mergeText(mentionText, remainingText);
  }

  if (insertAction === "append") {
    return mergeText(remainingText, mentionText);
  }

  return mergeText(
    mergeText(textBeforeSelection, mentionText),
    textAfterSelection
  );
}

function mergeText(left: string, right: string) {
  if (!left || !right) {
    return `${left}${right}`;
  }

  if (/\s$/.test(left) && /^\s/.test(right)) {
    return `${left.replace(/\s+$/, " ")}${right.replace(/^\s+/, "")}`;
  }

  if (/\s$/.test(left) || /^\s/.test(right)) {
    return `${left}${right}`;
  }

  if (/[\p{L}\p{N}]$/u.test(left) && /^[\p{L}\p{N}]/u.test(right)) {
    return `${left} ${right}`;
  }

  return `${left}${right}`;
}
