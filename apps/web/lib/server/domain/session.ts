import type { BodyNode } from "@/lib/types";
import { SessionMetadata } from "./session-metadata";

export class Session extends SessionMetadata {
  constructor(
    id: string,
    name: string,
    lecturer: string,
    updatedAt: Date,
    createdAt: Date,
    readonly transcript: string,
    readonly body: [BodyNode, ...BodyNode[]]
  ) {
    super(id, name, lecturer, updatedAt, createdAt);
  }
}
