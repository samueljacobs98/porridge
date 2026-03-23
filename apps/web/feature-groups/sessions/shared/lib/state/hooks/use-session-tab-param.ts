import { parseAsStringLiteral, useQueryState } from "nuqs";

export function useSessionTabParam() {
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsStringLiteral(["raw", "enhanced"]).withDefault("raw").withOptions({
      clearOnDefault: true,
    })
  );
  return { tab, setTab };
}
