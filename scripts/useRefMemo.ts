import { useRef, useMemo, MutableRefObject } from 'react';

/**
 * Memoized value in a ref.
 */
export function useRefMemo<T>(fn: () => T, deps?: any[]): MutableRefObject<T> {
  const resultRef = useRef<T>((null as unknown) as T);
  return useMemo(() => {
    resultRef.current = fn();
    return resultRef;
  }, deps);
}
