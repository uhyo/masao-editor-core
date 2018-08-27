/**
 * Return given value forced in range.
 * If max < min, behavior is undefined.
 */
export function inRange(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(value, min));
}
