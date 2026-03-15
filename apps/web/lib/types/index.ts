export type SessionMetadata = {
  id: string;
  name: string;
  lecturer: string;
  updatedAt: string;
  createdAt: string;
};

export type SessionHeadingNode = {
  type: "heading";
  attrs: { level: 1 };
  content: Array<{ type: "text"; text: string }>;
};

export type SessionCreatedAtDateNode = {
  type: "createdAtDate";
  attrs: { date: string | null };
};

export type SessionBlockNode =
  | { type: "paragraph"; content?: Array<{ type: "text"; text?: string }> }
  | {
      type: "bulletList";
      content?: Array<{ type: "listItem"; content?: SessionBlockNode[] }>;
    }
  | {
      type: "orderedList";
      content?: Array<{ type: "listItem"; content?: SessionBlockNode[] }>;
    }
  | { type: "blockquote"; content?: SessionBlockNode[] }
  | {
      type: "codeBlock";
      attrs?: { language?: string };
      content?: Array<{ type: "text"; text?: string }>;
    };

export type SessionContent = {
  type: "doc";
  content: [
    SessionHeadingNode,
    SessionCreatedAtDateNode,
    ...SessionBlockNode[],
  ];
};

export type Session = SessionMetadata & {
  content: SessionContent;
};
