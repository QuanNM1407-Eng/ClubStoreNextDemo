/**
 * @file
 * useDebounce custom hook.
 *
 * useDebounce contains next attributes:
 * @param value
 * @param delay
 */

import { useEffect, useState } from 'react';

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler =
      typeof value !== 'undefined'
        ? setTimeout(() => {
            setDebouncedValue(value);
          }, delay)
        : setTimeout(() => {
            setDebouncedValue(value);
          });

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line
  }, [value]);

  return debouncedValue;
}
