import { ChipCode } from '../../scripts/chip';

/**
 * Map data stored in clipboard as JSON.
 */
export interface MapFragmentJSONData {
  /**
   * Type of layer.
   */
  type: 'map' | 'layer';
  /**
   * Size of this fragment.
   */
  size: {
    x: number;
    y: number;
  };
  /**
   * map data.
   */
  data: ChipCode[][];
}

/**
 * Check whether given object is a MapFragmentJSONData.
 */
export function checkFragmentJSONFormat(obj: any): obj is MapFragmentJSONData {
  if (obj == null) {
    return false;
  }
  if (obj.type !== 'map' && obj.type !== 'layer') {
    return false;
  }
  if (
    obj.size == null ||
    'number' !== typeof obj.size.x ||
    'number' !== typeof obj.size.y
  ) {
    return false;
  }
  if (!Array.isArray(obj.data) || obj.data.length !== obj.size.y) {
    return false;
  }
  if (
    obj.data.some(
      (row: any) => !Array.isArray(row) || row.length !== obj.size.x,
    )
  ) {
    return false;
  }
  return true;
}
