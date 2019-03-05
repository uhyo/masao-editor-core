import * as editActions from '../../actions/edit';
import editStore from '../../stores/edit';
import { scroll } from './scroll';

export interface ChangeViewArg {
  width: number;
  height: number;
  widthRemainder: number;
  heightRemainder: number;
}
/**
 * 画面の大きさを変更
 */

export function changeView({
  width,
  height,
  widthRemainder,
  heightRemainder,
}: ChangeViewArg): void {
  if (
    width !== editStore.state.view_width ||
    height !== editStore.state.view_height ||
    widthRemainder !== editStore.state.view_width_remainder ||
    heightRemainder !== editStore.state.view_height_remainder
  ) {
    editActions.changeView({
      width,
      height,
      widthRemainder,
      heightRemainder,
    });
    scroll({
      x: editStore.state.scroll_x,
      y: editStore.state.scroll_y,
    });
  }
}
