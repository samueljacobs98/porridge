import type { BodyNode } from "./nodes";

export type SessionMetadataDTO = {
  id: string;
  name: string;
  lecturer: string;
  updatedAt: string;
  createdAt: string;
};

export type SessionContentDTO = {
  type: "doc";
  content: [BodyNode, ...BodyNode[]];
};

/** Name + body document (from editor) before attaching session id. */
export type SaveSessionBodyDTO = {
  name: string;
  content: SessionContentDTO;
};

/** Full payload for the saveSession server action. */
export type SaveSessionPayloadDTO = SaveSessionBodyDTO & {
  id: string;
};

export type SessionDTO = SessionMetadataDTO & {
  transcript: string;
  content: SessionContentDTO;
};
