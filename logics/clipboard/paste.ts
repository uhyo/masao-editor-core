import { MapFragmentJSONData } from './fragment';
import editStore from '../../stores/edit';
import { mergeFloatingIntoMap } from '../edit/floating';
import { setFloating } from '../../actions/edit';

/**
 * Make floating from fragment.
 * @returns whether putting was successful.
 */
export function putFragmentAsFloating(fragment: MapFragmentJSONData): boolean {
  const {
    floating: currentFloating,
    scroll_x,
    scroll_y,
    screen,
  } = editStore.state;
  if (fragment.type !== screen) {
    // 違うスクリーンには貼り付けない
    return false;
  }
  // 今のやつは固定する
  if (currentFloating != null) {
    mergeFloatingIntoMap(currentFloating);
  }
  const floating = {
    x: scroll_x,
    y: scroll_y,
    width: fragment.size.x,
    height: fragment.size.y,
    data: fragment.data,
  };
  setFloating({ floating });
  return true;
}
