type SyncEditorHeightOptions = {
  maxHeight?: number | string;
  minHeight?: number | string;
};

export function syncEditorHeight(
  element: HTMLElement,
  { maxHeight, minHeight }: SyncEditorHeightOptions
) {
  applyOptionalStyle(element, "maxHeight", maxHeight);
  applyOptionalStyle(element, "minHeight", minHeight);

  element.style.height = "0px";

  const computedStyles = window.getComputedStyle(element);
  const resolvedMinHeight = Number.parseFloat(computedStyles.minHeight) || 0;
  const resolvedMaxHeight =
    maxHeight === undefined
      ? Number.POSITIVE_INFINITY
      : Number.parseFloat(computedStyles.maxHeight) || Number.POSITIVE_INFINITY;

  const nextHeight = Math.max(
    resolvedMinHeight,
    Math.min(element.scrollHeight, resolvedMaxHeight)
  );

  element.style.height = `${nextHeight}px`;
  element.style.overflowY =
    element.scrollHeight > nextHeight ? "auto" : "hidden";
}

function applyOptionalStyle(
  element: HTMLElement,
  property: "maxHeight" | "minHeight",
  value?: number | string
) {
  if (value === undefined) {
    element.style.removeProperty(toCssPropertyName(property));
    return;
  }

  element.style[property] = typeof value === "number" ? `${value}px` : value;
}

function toCssPropertyName(value: string) {
  return value.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`);
}
