export type CreatedAtDateNode = {
  type: "createdAtDate";
  attrs: { date: string };
};

/** TipTap text marks (bold, italic, link, …) stored on JSON text nodes. */
export type TextMark = {
  type: string;
  attrs?: Record<string, unknown>;
};

export type InlineNode =
  | {
      type: "text";
      text?: string;
      marks?: TextMark[];
    }
  | {
      type: "hardBreak";
    };

export type BodyNode =
  | {
      type: "blockquote";
      content?: BodyNode[];
    }
  | {
      type: "paragraph";
      content?: InlineNode[] | undefined;
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
            marks?: TextMark[];
          }[]
        | undefined;
    };
