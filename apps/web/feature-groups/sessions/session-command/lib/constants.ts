import type { MentionsMap } from "@/components/mentions-text-area";

export const MENTIONS_PLACEHOLDER = "Ask anything";

export const SESSION_COMMAND_MENTIONS = {
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
} satisfies MentionsMap;
