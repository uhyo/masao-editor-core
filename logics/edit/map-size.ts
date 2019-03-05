import editStore from '../../stores/edit';
import mapStore from '../../stores/map';
import updateStore from '../../stores/update';
import * as mapActions from '../../actions/map';
import * as historyActions from '../../actions/history';
import { scroll } from './scroll';
import { Rect } from '.';

export function scrollForCurrentMapSize(width: number, height: number): void {
  const { scroll_x, scroll_y, view_width, view_height } = editStore.state;
  const scroll_x2 = Math.max(0, Math.min(scroll_x, width - view_width));
  const scroll_y2 = Math.max(0, Math.min(scroll_y, height - view_height));

  scroll({
    x: scroll_x2,
    y: scroll_y2,
  });
}

/**
 * マップサイズを変更する（4方向の変化量で指定）
 */
export function resizeMapData(stage: number, resize: Rect): void {
  // 新しいマップサイズを計算
  const data = mapStore.state.data[stage - 1];
  const newwidth = data.size.x + resize.left + resize.right;
  const newheight = data.size.y + resize.top + resize.bottom;

  console.log(stage, data.size);
  console.log(newwidth, newheight, data.size.y, resize.top, resize.bottom);
  if (newwidth < 16 || newheight < 10) {
    // サポート外の数値にはできない
    return;
  }
  mapActions.resizeMap({
    stage,
    ...resize,
  });
  historyActions.addHistory({
    stage,
    stageData: mapStore.state.data[stage - 1],
  });
  updateStore.update();
  if (stage === editStore.state.stage) {
    scrollForCurrentMapSize(newwidth, newheight);
  }
}
