import { useCallback, useState } from "react";
import { normalizeMentionsTextAreaValue } from "../../utils/normalize-mentions-text-area-value";

type UseMentionsTextAreaValueArgs = {
  defaultValue?: string;
  onChange?: (value: string) => void;
  value?: string;
};

export function useMentionsTextAreaValue({
  defaultValue,
  onChange,
  value,
}: UseMentionsTextAreaValueArgs) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    normalizeMentionsTextAreaValue(defaultValue)
  );

  const currentValue = isControlled
    ? normalizeMentionsTextAreaValue(value)
    : uncontrolledValue;

  const setValue = useCallback(
    (nextValue: string) => {
      const normalizedValue = normalizeMentionsTextAreaValue(nextValue);

      if (!isControlled) {
        setUncontrolledValue(normalizedValue);
      }

      onChange?.(normalizedValue);
    },
    [isControlled, onChange]
  );

  return { value: currentValue, setValue };
}
