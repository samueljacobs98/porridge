import { SessionMetadata } from "@/lib/types";

const sessions: SessionMetadata[] = [
  {
    id: "1",
    name: "AI in the Age of Reason",
    lecturer: "Steven Pinker",
    updatedAt: "2021-01-01",
    createdAt: "2021-01-01",
  },
  {
    id: "2",
    name: "Godel Machines, Meta-Learning, and LSTMs",
    lecturer: "Juergen Schmidhuber",
    updatedAt: "2021-01-01",
    createdAt: "2021-01-01",
  },
  {
    id: "3",
    name: "Revolutionary Ideas in Science, Math, and Society",
    lecturer: "Eric Weinstein",
    updatedAt: "2021-01-03",
    createdAt: "2021-01-03",
  },
  {
    id: "4",
    name: "The Future of AI",
    lecturer: "Sam Altman",
    updatedAt: "2021-01-04",
    createdAt: "2021-01-04",
  },
  {
    id: "5",
    name: "The Future of AI",
    lecturer: "Sam Altman",
    updatedAt: "2021-01-05",
    createdAt: "2021-01-05",
  },
  {
    id: "6",
    name: "The Future of AI",
    lecturer: "Sam Altman",
    updatedAt: "2021-01-06",
    createdAt: "2021-01-06",
  },
  {
    id: "7",
    name: "The Future of AI",
    lecturer: "Sam Altman",
    updatedAt: "2021-01-07",
    createdAt: "2021-01-07",
  },
  {
    id: "8",
    name: "The Future of AI",
    lecturer: "Sam Altman",
    updatedAt: "2021-01-08",
    createdAt: "2021-01-08",
  },
  {
    id: "9",
    name: "The Future of AI",
    lecturer: "Sam Altman",
    updatedAt: "2021-01-09",
    createdAt: "2021-01-09",
  },
  {
    id: "10",
    name: "The Future of AI",
    lecturer: "Sam Altman",
    updatedAt: "2021-01-10",
    createdAt: "2021-01-10",
  },
  {
    id: "11",
    name: "The Future of AI",
    lecturer: "Sam Altman",
    updatedAt: "2021-01-11",
    createdAt: "2021-01-11",
  },
  {
    id: "12",
    name: "The Future of AI",
    lecturer: "Sam Altman",
    updatedAt: "2021-01-12",
    createdAt: "2021-01-12",
  },
];

// TODO: Replace with actual API call
export function useSessionsMetadata() {
  return { data: sessions };
}
