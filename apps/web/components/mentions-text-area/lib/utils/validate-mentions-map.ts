import type { MentionsMap } from "../types";

export function validateMentionsMap(mentions?: MentionsMap) {
  if (!mentions) {
    return;
  }

  for (const [trigger, config] of Object.entries(mentions)) {
    if (trigger.length !== 1) {
      throw new Error(
        `MentionsTextArea trigger "${trigger}" must be a single character.`
      );
    }

    const values = new Set<string>();

    for (const option of config.options) {
      if (values.has(option.value)) {
        throw new Error(
          `MentionsTextArea trigger "${trigger}" contains duplicate option value "${option.value}".`
        );
      }

      values.add(option.value);
    }
  }
}
