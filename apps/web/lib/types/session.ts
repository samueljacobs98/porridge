import type { BodyNode, CreatedAtDateNode, HeadingNode } from "./nodes";

export type SessionMetadataDTO = {
  id: string;
  name: string;
  lecturer: string;
  updatedAt: string;
  createdAt: string;
};

export type SessionContentDTO = {
  type: "doc";
  content: [HeadingNode, CreatedAtDateNode, BodyNode, ...BodyNode[]];
};

export type SessionDTO = SessionMetadataDTO & {
  content: SessionContentDTO;
  enhancedContent: SessionContentDTO;
};
