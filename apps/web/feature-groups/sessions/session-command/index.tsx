import { MentionsTextArea } from "@/components/mentions-text-area";
import { MENTIONS_PLACEHOLDER } from "./lib/constants";

export function SessionCommand() {
  return (
    <form>
      <MentionsTextArea
        maxHeight="100px"
        placeholder={MENTIONS_PLACEHOLDER}
        mentions={{
          "/": {
            insertAction: "replace",
            options: [
              {
                label: "Write a study plan",
                value: "write-study-plan",
              },
              {
                label: "Quiz me",
                value: "quiz-me",
              },
            ],
          },
        }}
      />
    </form>
  );
}
