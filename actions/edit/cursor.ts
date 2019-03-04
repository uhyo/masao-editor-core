/**
 * Cursor on the map.
 */
export interface MainCursor {
  type: 'main';
  x: number;
  y: number;
}
/**
 * Cursor on the chip select panel.
 */
export interface ChipselectCursor {
  type: 'chipselect';
  id: number;
}
export type CursorState = MainCursor | ChipselectCursor;
