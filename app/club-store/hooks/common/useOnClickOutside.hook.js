/**
 * @file
 * useOnClickOutside custom hook.
 *
 * useOnClickOutside contains next attributes:
 * @param ref
 * @param handler
 */

import { useEffect } from 'react';

const checkForIgnoreClassName = (element, ignoreClassName, steps = 4) => {
  let temp = element;
  for (let i = 0; i < steps; i++) {
    if (temp?.className?.toString()?.includes(ignoreClassName)) return true;
    temp = temp?.parentElement;
  }
  return false;
};

export function useOnClickOutside(ref, handler, ignoreConfig = {}) {
  useEffect(
    () => {
      const listener = (event) => {
        if (
          ignoreConfig &&
          checkForIgnoreClassName(event.target, ignoreConfig?.className, ignoreConfig?.steps || 4)
        )
          return;
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }

        handler(event);
      };

      document.addEventListener('click', listener);
      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);

      return () => {
        document.removeEventListener('click', listener);
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    // TODO: resolve this
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ref, handler],
  );
}
