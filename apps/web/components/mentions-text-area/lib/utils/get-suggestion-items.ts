import { DEFAULT_SUGGESTION_LIMIT } from "../constants";
import type {
  MentionInsertAction,
  MentionOption,
  MentionSuggestionItem,
} from "../types";

type GetSuggestionItemsArgs = {
  insertAction?: MentionInsertAction;
  options: MentionOption[];
  query: string;
  trigger: string;
};

export function getSuggestionItems({
  insertAction = "append",
  options,
  query,
  trigger,
}: GetSuggestionItemsArgs) {
  const normalizedQuery = query.trim().toLowerCase();

  return options
    .filter((option) => {
      if (!normalizedQuery) {
        return true;
      }

      return (
        option.label.toLowerCase().includes(normalizedQuery) ||
        option.value.toLowerCase().includes(normalizedQuery)
      );
    })
    .slice(0, DEFAULT_SUGGESTION_LIMIT)
    .map<MentionSuggestionItem>((option) => ({
      trigger,
      option,
      insertAction,
    }));
}
