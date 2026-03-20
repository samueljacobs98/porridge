export type HeadingNode = {
  type: "heading";
  attrs: { level: 1 };
  content: Array<{ type: "text"; text: string }>;
};

export type CreatedAtDateNode = {
  type: "createdAtDate";
  attrs: { date: string };
};

export type BodyNode =
  | {
      type: "blockquote";
      content?: BodyNode[];
    }
  | {
      type: "paragraph";
      content?:
        | {
            type: "text";
            text?: string | undefined;
          }[]
        | undefined;
    }
  | {
      type: "bulletList";
      content?:
        | {
            type: "listItem";
            content?: BodyNode[];
          }[]
        | undefined;
    }
  | {
      type: "orderedList";
      content?:
        | {
            type: "listItem";
            content?: BodyNode[];
          }[]
        | undefined;
    }
  | {
      type: "codeBlock";
      attrs?:
        | {
            language?: string | undefined;
          }
        | undefined;
      content?:
        | {
            type: "text";
            text?: string | undefined;
          }[]
        | undefined;
    };
