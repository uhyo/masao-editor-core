import editStore from '../../stores/edit';
import mapStore from '../../stores/map';
import * as editActions from '../../actions/edit';

/**
 * マップを指定した位置にスクロールさせる
 * @package
 */
export function scroll({ x, y }: { x: number; y: number }): void {
  const {
    stage,
    view_width,
    view_height,
    scroll_x,
    scroll_y,
    scroll_stick_right,
    scroll_stick_bottom,
    cursor,
  } = editStore.state;
  const { size } = mapStore.state.data[stage - 1];

  let stickRight = false;
  let stickBottom = false;

  if (x >= size.x - view_width) {
    x = size.x - view_width;
    stickRight = true;
  }
  if (y >= size.y - view_height) {
    y = size.y - view_height;
    stickBottom = true;
  }
  if (x <= 0) {
    x = 0;
    stickRight = false;
  }
  if (y <= 0) {
    y = 0;
    stickBottom = false;
  }

  if (
    scroll_x !== x ||
    scroll_y !== y ||
    scroll_stick_right !== stickRight ||
    scroll_stick_bottom !== stickBottom
  ) {
    editActions.scroll({
      x,
      y,
      stickRight,
      stickBottom,
    });
  }

  if (cursor && cursor.type === 'main') {
    // カーソルが出ていたら考慮
    const nx = Math.max(x, Math.min(x + view_width - 1, cursor.x));
    const ny = Math.max(y, Math.min(y + view_height - 1, cursor.y));

    if (cursor.x !== nx || cursor.y !== ny) {
      editActions.setCursor({
        cursor: {
          type: 'main',
          x: nx,
          y: ny,
        },
      });
    }
  }
}

/**
 * スクロール先を相対的に指定する
 * @package
 */
export function scrollBy({ x, y }: { x: number; y: number }): void {
  scroll({
    x: editStore.state.scroll_x + x,
    y: editStore.state.scroll_y + y,
  });
}
