import mapStore from '../../stores/map';
import editStore from '../../stores/edit';
import { Rect } from '.';

/**
 * 現在のEditStateから画面の有効領域（画面内かつステージ内）を計算
 */
export function availableArea(): Rect {
  const { scroll_x, scroll_y, view_width, view_height } = editStore.state;
  const stage = mapStore.state.data[editStore.state.stage - 1];

  const left = Math.max(0, scroll_x);
  const top = Math.max(0, scroll_y);
  const right = Math.min(stage.size.x, scroll_x + view_width);
  const bottom = Math.min(stage.size.y, scroll_y + view_height);

  return {
    left,
    top,
    right,
    bottom,
  };
}
/**
 * 点が領域内にあるか判定
 */
export function isInArea(x: number, y: number, rect: Rect): boolean {
  return rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom;
}

/**
 * 四隅を表す文字列
 */
export type EdgeType = 'top' | 'right' | 'bottom' | 'left';
export function isEdge(viewx: number, viewy: number): EdgeType | null {
  const { scroll_x, scroll_y } = editStore.state;
  const sx = viewx + scroll_x;
  const sy = viewy + scroll_y;
  const av = availableArea();

  // 四隅の判定
  if (sx <= av.left) {
    if (av.top <= sy && sy < av.bottom) {
      return 'left';
    } else {
      return null;
    }
  } else if (sx >= av.right - 1) {
    if (av.top <= sy && sy < av.bottom) {
      return 'right';
    } else {
      return null;
    }
  } else if (sy <= av.top) {
    if (av.left <= sx && sx < av.right) {
      return 'top';
    } else {
      return null;
    }
  } else if (sy >= av.bottom - 1) {
    if (av.left <= sx && sx < av.right) {
      return 'bottom';
    } else {
      return null;
    }
  }
  return null;
}
