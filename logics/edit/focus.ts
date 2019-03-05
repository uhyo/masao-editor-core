import * as editActions from '../../actions/edit';
import editStore from '../../stores/edit';
import { setCursor } from './cursor';

type FocusPlace = editActions.FocusPlace;

/**
 * ある領域にフォーカスした
 */
export function focus(place: FocusPlace): void {
  const { focus, cursorEnabled } = editStore.state;
  if (focus !== place) {
    editActions.setFocus({
      focus: place,
    });
    if (cursorEnabled) {
      setCursor(place);
    }
  }
}
/**
 * フォーカスが離れた
 */
export function blur(place: FocusPlace): void {
  const { cursor, focus } = editStore.state;
  if (focus === place) {
    editActions.setFocus({
      focus: null,
    });
  }
  if (cursor != null && cursor.type === place) {
    editActions.setCursor({
      cursor: null,
    });
  }
}
