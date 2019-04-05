import { MapFragmentJSONData } from './fragment';
import { ChipCode } from '../../scripts/chip';

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

/**
 * Convert given text to fragment.
 */
export function fragmentFromText(
  type: 'map' | 'layer',
  text: string,
): MapFragmentJSONData | null {
  text = text.replace(/^(?:\s*\n)*/, '').replace(/(?:\n\s*)*$/, '');
  const lines = text.split('\n');
  const rows: ChipCode[][] = [];
  let width = 0;
  for (const line of lines) {
    const row: ChipCode[] = [];
    let maxMeaningFul = 0;
    if (type === 'map') {
      for (let i = 0; i < line.length; i++) {
        let code = line.charCodeAt(i);
        if (code === 0x2e || code <= 0x20 || 0x7f < code) {
          // 空白
          code = 0;
        } else {
          maxMeaningFul = i + 1;
        }
        row.push(code);
      }
    } else {
      for (let i = 0; 2 * i < line.length; i++) {
        let code = parseInt(line.slice(2 * i, 2 * i + 2), 16);
        if (Number.isNaN(code) || code <= 0 || code > 0xff) {
          code = 0;
        } else {
          maxMeaningFul = i + 1;
        }
        row.push(code);
      }
    }
    if (width < maxMeaningFul) {
      width = maxMeaningFul;
    }
    rows.push(row);
  }
  const height = lines.length;
  if (width === 0 || height === 0) {
    return null;
  }
  return {
    type,
    size: { x: width, y: height },
    data: rows,
  };
}
