export function getInitials(
  name: string,
  options: Partial<{ limit: number }> = {}
) {
  const { limit = 2 } = options;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  return initials.slice(0, limit);
}
