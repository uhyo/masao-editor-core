import { CustomPartsData } from '../defs/map';
import { CustomPartsPropertySet, customPartsProperties } from './masao';
import { ChipCode } from './chip';
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

/**
 * Recursively find native Code of given custom chip.
 */
export function getNativeCode(
  customParts: CustomPartsData,
  code: ChipCode,
): number | undefined {
  // flags to prevent infinite loops.
  const visitedFlag: Record<string, true> = {};
  while ('string' === typeof code) {
    if (visitedFlag[code]) {
      // infinite loop
      return undefined;
    }
    visitedFlag[code] = true;
    const cpo = customParts[code];
    if (cpo == null) {
      // invalid code.
      return undefined;
    }
    code = cpo.extends;
  }
  // found numeric code.
  return code;
}

/**
 * Return the list of custom properties of given parts.
 */
export function getCustomProperties(
  customParts: CustomPartsData,
  code: ChipCode,
): CustomPartsPropertySet {
  const nativeCode = getNativeCode(customParts, code);
  if (nativeCode == null) {
    return {};
  }
  const ps = customPartsProperties[nativeCode];
  return ps || {};
}
