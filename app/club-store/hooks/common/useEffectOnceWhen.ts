import { useEffect, useRef } from 'react';

export function useEffectOnceWhen(callback: () => void, when = true): void {
  const hasRunOnceRef = useRef(false);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  useEffect(() => {
    if (when && !hasRunOnceRef.current) {
      callbackRef.current();
      hasRunOnceRef.current = true;
    }
  }, [when]);
}
