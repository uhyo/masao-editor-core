import { useRef, useMemo } from 'react';

/**
 * Returns a new number every time given predicate returns true.
 */
export function useUpdateSignal<T extends ReadonlyArray<any>>(
  predicate: (prev: T, current: T) => boolean,
  deps: T,
): number {
  const numberRef = useRef(0);
  const prevDepsRef = useRef<T | null>(null);
  return useMemo(() => {
    if (prevDepsRef.current == null) {
      prevDepsRef.current = deps;
      return numberRef.current;
    }
    const update = predicate(prevDepsRef.current, deps);
    prevDepsRef.current = deps;
    if (update) {
      numberRef.current++;
      if (numberRef.current >= 2 ** 53) {
        numberRef.current = 0;
      }
    }
    return numberRef.current;
  }, deps);
}

/**
 * Checks whether any of elements of two arrays are inequal.
 */
export function compareArrayInequality<T extends any[]>(
  prev: T,
  current: T,
): boolean {
  return current.some((elm, i) => prev[i] !== elm);
}
