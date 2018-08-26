import { CustomPartsData } from '../defs/map';
/**
 * Get name of given custom chip.
 */
export function getCustomChipName(
  customParts: CustomPartsData,
  code: string,
): string | null {
  const obj = customParts[code];
  if (obj == null) {
    return null;
  }
  return obj.name;
}

/**
 * Return the list of custom parts codes.
 */
export function customPartsList(customParts: CustomPartsData): string[] {
  return Object.keys(customParts);
}
