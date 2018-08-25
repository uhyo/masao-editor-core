import { NativeChip, Chip } from './interface';

/**
 * Convert NativeChip table to Chip table.
 */
export function fromNativeTable(
  table: Record<number, NativeChip>,
): Record<number, Chip> {
  const result: Record<string, Chip> = {};
  for (const key in table) {
    const nc: NativeChip = table[key];
    result[key] = {
      ...nc,
      nativeName: nc.name,
      nativeCode: Number(key),
    };
  }
  return result;
}
