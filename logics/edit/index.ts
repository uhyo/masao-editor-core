// logic

export { scroll, scrollBy } from './scroll';
export {
  mouseMove,
  mouseDown,
  mouseUp,
  click,
  isMouseMoveEnabled,
} from './mouse';
export { isEdge, EdgeType } from './area';
export { resizeMapData, scrollForCurrentMapSize } from './map-size';
export { changeView } from './view';
export { focus, blur } from './focus';
export {
  setCursor,
  cursorJump,
  moveCursorBy,
  removeCursor,
  cursorButton,
} from './cursor';
export { chipList, chipNumber } from './chip';
export { deleteLogic } from './command';

/**
 * Rectangle defined by two points (inclusive).
 */
export interface Rect {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
