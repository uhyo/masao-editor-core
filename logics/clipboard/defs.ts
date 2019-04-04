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
