import { useRef, useEffect } from 'react';

/**
 * Memoizes result of given function.
 * Objects are compared for shallow equality.
 */
export function useShallowMemo<T extends {}>(fn: () => T, deps: any[]): T {
  const current = useRef<T>(null as any);
  useEffect(() => {
    const res = fn();
    const prev = current.current;
    if (prev == null) {
      // initialization
      current.current = res;
      return;
    }
    // compare with previous one
    const changed = Object.keys(res).some(
      key => (prev as any)[key] !== (res as any)[key],
    );
    if (changed) {
      current.current = res;
    }
  }, deps);
  return current.current;
}
