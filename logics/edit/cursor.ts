import * as editActions from '../../actions/edit';
import editStore from '../../stores/edit';
import mapStore from '../../stores/map';
import customPartsStore from '../../stores/custom-parts';
import { scroll } from './scroll';
import { mouseMove, mouseDown, mouseUp } from './mouse';
import { chipNumber, chipList } from './chip';

// カーソルの移動
export function moveCursorBy({ x, y }: { x: number; y: number }): void {
  const edit = editStore.state;
  const {
    stage,
    cursor,
    scroll_x,
    scroll_y,
    view_width,
    view_height,
    chipselect_width,
    chipselect_scroll,
    tool,
  } = edit;

  const { size } = mapStore.state.data[stage - 1];

  if (cursor == null) {
    // カーソルがない場合は画面の左上に出現
    editActions.setCursor({
      cursor: {
        type: 'main',
        x: scroll_x,
        y: scroll_y,
      },
    });
  } else if (cursor.type === 'main') {
    // カーソルが移動
    const x2 = Math.max(0, Math.min(cursor.x + x, size.x - 1));
    const y2 = Math.max(0, Math.min(cursor.y + y, size.y - 1));

    editActions.setCursor({
      cursor: {
        type: 'main',
        x: x2,
        y: y2,
      },
    });
    // スクロールが必要ならスクロール
    const scroll_x2 = Math.min(x2, Math.max(scroll_x, x2 - view_width + 1));
    const scroll_y2 = Math.min(y2, Math.max(scroll_y, y2 - view_height + 1));

    if (scroll_x !== scroll_x2 || scroll_y !== scroll_y2) {
      scroll({
        x: scroll_x2,
        y: scroll_y2,
      });
    }
    // さらに移動
    mouseMove(x2 - scroll_x2, y2 - scroll_y2, tool);
  } else if (cursor.type === 'chipselect') {
    const { id } = cursor;

    const id2 = Math.max(
      0,
      Math.min(
        id + x + y * chipselect_width,
        chipNumber(
          mapStore.state.advanced,
          customPartsStore.state.customParts,
        ) - 1,
      ),
    );

    editActions.setCursor({
      cursor: {
        type: 'chipselect',
        id: id2,
      },
    });

    const idy = Math.floor(id2 / chipselect_width);

    // height of chip list.
    const chipselectHeight = Math.ceil(
      chipNumber(mapStore.state.advanced, customPartsStore.state.customParts) /
        chipselect_width,
    );

    const c_sc = Math.min(
      idy,
      Math.max(chipselect_scroll, idy - chipselectHeight + 1),
    );
    if (c_sc !== chipselect_scroll) {
      editActions.changeChipselectScroll({
        y: c_sc,
      });
    }
  }
}
export function cursorJump(): void {
  const { cursor } = editStore.state;

  if (cursor == null || cursor.type === 'chipselect') {
    setCursor('main');
  } else if (cursor.type === 'main') {
    setCursor('chipselect');
  }
}
/**
 * Set a cursor to specified area.
 */
export function setCursor(type: editActions.FocusPlace): void {
  const {
    scroll_x,
    scroll_y,
    chipselect_width,
    chipselect_scroll,
  } = editStore.state;
  if (type === 'main') {
    editActions.setCursor({
      cursor: {
        type,
        x: scroll_x,
        y: scroll_y,
      },
    });
  } else if (type === 'chipselect') {
    editActions.setCursor({
      cursor: {
        type,
        id: chipselect_width * chipselect_scroll,
      },
    });
  }
}
/**
 * Remove cursor.
 * @returns {boolean} whether cursor was previously shown.
 */
export function removeCursor(): boolean {
  const { cursor } = editStore.state;
  const ret = cursor != null;
  editActions.setCursor({
    cursor: null,
  });
  return ret;
}

export function cursorButton(keydown: boolean) {
  const { screen, mode, scroll_x, scroll_y, cursor } = editStore.state;

  if (cursor == null) {
    return;
  }

  if (cursor.type === 'main') {
    const { x, y } = cursor;

    if (keydown === true) {
      mouseDown(mode, x - scroll_x, y - scroll_y);
    } else {
      mouseUp();
    }
  } else if (cursor.type === 'chipselect') {
    const { id } = cursor;
    if (screen === 'layer') {
      editActions.changePenLayer({
        pen: id,
      });
    } else {
      editActions.changePen({
        pen: chipList(
          mapStore.state.advanced,
          customPartsStore.state.customParts,
        )[id],
      });
    }
  }
}
