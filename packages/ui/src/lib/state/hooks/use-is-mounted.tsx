import { useEffect, useState } from "react";

export function useIsMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  return mounted;
}
