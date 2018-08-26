import * as customPartsActions from '../actions/custom-parts';
import editStore from '../stores/edit';
import customPartsStore from '../stores/custom-parts';
import { inRange } from '../scripts/util/in-range';
import { customPartsList } from '../scripts/custom-parts';
import updateStore from '../stores/update';

/**
 * カスタムパーツ選択のカーソルを移動させる
 */
export function moveCursorBy({ x, y }: { x: number; y: number }): void {
  const { chipselect_width } = editStore.state;
  const { customParts, cursorPosition } = customPartsStore.state;

  const customPartsNumber = Object.keys(customParts).length;

  if (customPartsNumber === 0) {
    // 空っぽだ
    if (cursorPosition != null) {
      customPartsActions.setCursor({ cursor: null });
    }
    return;
  }
  if (cursorPosition == null) {
    // cursor appears!
    customPartsActions.setCursor({ cursor: 0 });
    return;
  }
  // x, yをindexの移動距離に変換
  const indexDiff = x + y * chipselect_width;
  // 移動後の位置
  const newIndexRaw = cursorPosition + indexDiff;
  // 可能な範囲に収める
  const newIndex = inRange(newIndexRaw, 0, customPartsNumber - 1);

  customPartsActions.setCursor({ cursor: newIndex });
}

/**
 * カスタムパーツがボタンで選択された
 */
export function cursorButton(): void {
  const { customParts, cursorPosition } = customPartsStore.state;
  if (cursorPosition == null) {
    return;
  }
  const chipCode = customPartsList(customParts)[cursorPosition];
  if ('string' !== typeof chipCode) {
    // invalid selection.
    return;
  }
  customPartsActions.setCurrentChip({ chipIndex: cursorPosition });
}

/**
 * カスタムパーツの名前をアップデート
 */
export function setCustomChipName(
  arg: customPartsActions.SetCustomChipNameAction,
): void {
  customPartsActions.setCustomChipName(arg);
  updateStore.update();
}

/**
 * カスタムパーツのプロパティをアップデート
 */
export function setCustomPropertyValue(
  arg: customPartsActions.SetCustomPropertyValueAction,
): void {
  customPartsActions.setCustomPropertyValue(arg);
  updateStore.update();
}
