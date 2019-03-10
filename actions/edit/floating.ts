import { ChipCode } from '../../scripts/chip';

/**
 * State of floating area.
 */
export interface FloatingState {
  /**
   * Width of floating data.
   */
  width: number;
  /**
   * Height of flating data.
   */
  height: number;
  /**
   * x-position of floating data.
   */
  x: number;
  /**
   * y-position of floating data.
   */
  y: number;
  /**
   * Data of chips.
   */
  data: Array<Array<ChipCode>>;
}
