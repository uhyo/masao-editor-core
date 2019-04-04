import { MapFragmentJSONData } from './defs';

/**
 * Convert given fragment of data into its text form.
 * Advanced chips are removed.
 */
export function fragmentToText(fragment: MapFragmentJSONData): string {
  let result = '';
  if (fragment.type === 'map') {
    for (const row of fragment.data) {
      for (const chip of row) {
        if ('string' === typeof chip || chip <= 0 || 255 < chip) {
          result += '.';
        } else {
          result += String.fromCharCode(chip);
        }
      }
      result += '\n';
    }
  } else {
    for (const row of fragment.data) {
      for (const chip of row) {
        if ('string' === typeof chip || chip <= 0 || 255 < chip) {
          result += '..';
        } else if (chip < 16) {
          result += '0' + chip.toString(16);
        } else {
          result += chip.toString(16);
        }
      }
      result += '\n';
    }
  }
  return result;
}
