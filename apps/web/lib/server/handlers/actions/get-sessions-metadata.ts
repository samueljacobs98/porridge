import { ok, type Result } from "@repo/result";
import type { SessionMetadata } from "@/lib/types";
import { action } from "@/lib/utils/action";

export const getSessionsMetadata = action(
  async (): Promise<Result<SessionMetadata[], void>> => {
    return ok([
      {
        id: "1",
        name: "AI in the Age of Reason",
        lecturer: "Steven Pinker",
        updatedAt: "2026-03-14T14:47:32Z",
        createdAt: "2026-03-14T09:23:11Z",
      },
      {
        id: "2",
        name: "Godel Machines, Meta-Learning, and LSTMs",
        lecturer: "Juergen Schmidhuber",
        updatedAt: "2026-03-14T15:33:08Z",
        createdAt: "2026-03-14T10:15:42Z",
      },
      {
        id: "3",
        name: "Revolutionary Ideas in Science, Math, and Society",
        lecturer: "Eric Weinstein",
        updatedAt: "2026-03-11T16:21:55Z",
        createdAt: "2026-03-11T08:42:19Z",
      },
      {
        id: "4",
        name: "The Future of AI",
        lecturer: "Sam Altman",
        updatedAt: "2026-03-08T17:55:41Z",
        createdAt: "2026-03-08T11:07:03Z",
      },
      {
        id: "5",
        name: "The Future of AI",
        lecturer: "Sam Altman",
        updatedAt: "2026-03-05T19:02:27Z",
        createdAt: "2026-03-05T14:18:36Z",
      },
      {
        id: "6",
        name: "The Future of AI",
        lecturer: "Sam Altman",
        updatedAt: "2026-03-02T13:44:52Z",
        createdAt: "2026-03-02T09:31:14Z",
      },
      {
        id: "7",
        name: "The Future of AI",
        lecturer: "Sam Altman",
        updatedAt: "2026-03-29T12:28:19Z",
        createdAt: "2026-03-29T08:05:47Z",
      },
      {
        id: "8",
        name: "The Future of AI",
        lecturer: "Sam Altman",
        updatedAt: "2026-03-29T18:37:03Z",
        createdAt: "2026-03-29T10:52:31Z",
      },
      {
        id: "9",
        name: "The Future of AI",
        lecturer: "Sam Altman",
        updatedAt: "2026-03-26T16:09:48Z",
        createdAt: "2026-03-26T07:19:22Z",
      },
      {
        id: "10",
        name: "The Future of AI",
        lecturer: "Sam Altman",
        updatedAt: "2026-03-26T20:41:15Z",
        createdAt: "2026-03-26T14:23:56Z",
      },
      {
        id: "11",
        name: "The Future of AI",
        lecturer: "Sam Altman",
        updatedAt: "2026-03-22T15:14:29Z",
        createdAt: "2026-03-22T11:36:07Z",
      },
      {
        id: "12",
        name: "The Future of AI",
        lecturer: "Sam Altman",
        updatedAt: "2026-03-20T17:52:44Z",
        createdAt: "2026-03-20T09:48:18Z",
      },
    ]);
  }
);
