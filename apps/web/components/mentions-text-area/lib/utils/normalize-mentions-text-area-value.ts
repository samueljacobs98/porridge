export function normalizeMentionsTextAreaValue(value?: string) {
  return (value ?? "").replace(/\r\n/g, "\n");
}
