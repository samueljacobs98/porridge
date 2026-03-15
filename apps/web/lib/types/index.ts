export type SessionMetadata = {
  id: string;
  name: string;
  lecturer: string;
  updatedAt: string;
  createdAt: string;
};

export type SessionContent = {
  type: "doc";
  content: Record<string, unknown>[];
};

export type Session = SessionMetadata & {
  content: SessionContent;
};
