/**
 * Count specific elements in given array.
 */
export function countElements1<T>(arr: T[], value: T): number {
  return arr.filter(v => v === value).length;
}

/**
 * Count specific elements in given 2-dim array.
 */
export function countElements2<T>(arr: T[][], value: T): number {
  return arr.map(a => countElements1(a, value)).reduce((a, b) => a + b, 0);
}
