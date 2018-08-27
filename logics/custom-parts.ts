import * as SparkMd5 from 'spark-md5';
import * as customPartsActions from '../actions/custom-parts';
import editStore from '../stores/edit';
import customPartsStore from '../stores/custom-parts';
import { inRange } from '../scripts/util/in-range';
import { customPartsList } from '../scripts/custom-parts';
import updateStore from '../stores/update';
import { OneCustomChip } from '../defs/map';

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
 * 新しいカスタムパーツIDを生成
 */
export function generateNewCustomPartsId(): string {
  const idLength = 10;
  return new Array(idLength)
    .fill(0)
    .map(() => String.fromCharCode(0x61 + Math.floor(Math.random() * 26)))
    .join('');
}

/**
 * カスタムパーツIDから色を生成
 */
export function generateColorFromId(id: string): string {
  // IDに対してMD5ハッシュを取る
  const hashed = SparkMd5.hash(id, true);
  // 最初の2バイトをHSLのHに変換（0〜360）
  const h = Math.floor(
    (((hashed.charCodeAt(0) << 8) | hashed.charCodeAt(1)) * 360) / 65536,
  );
  // 次の1バイトをSに変換（70〜100）
  const s = 70 + Math.floor((hashed.charCodeAt(2) * 30) / 256);
  // 次の1バイトをLに変換（30〜70）
  const l = 30 + Math.floor((hashed.charCodeAt(3) * 40) / 256);

  return `hsl(${h}, ${s}%, ${l}%)`;
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
 * カスタムパーツのベースをアップデート
 */
export function setCustomChipBase(
  arg: customPartsActions.SetCustomChipBaseAction,
): void {
  customPartsActions.setCustomChipBase(arg);
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

/**
 * カスタムパーツを消去
 */
export function deleteCustomParts(
  arg: customPartsActions.DeleteCustomPartsAction,
): void {
  customPartsActions.deleteCustomParts(arg);
  updateStore.update();
}

/**
 * 新しいカスタムパーツを登録
 */
export function generateNewCustomParts(
  cloneof: OneCustomChip,
  newName?: string,
): void {
  const newid = generateNewCustomPartsId();
  const color = generateColorFromId(newid);
  // 名前をちょっと変更
  const definition = {
    ...cloneof,
    name: newName != null ? newName : `${cloneof.name}（コピー）`,
    color,
  };
  customPartsActions.addNewCustomParts({
    chipCode: newid,
    definition,
  });
  updateStore.update();
  // indexに変換
  const chipIndex = customPartsList(customPartsStore.state.customParts).indexOf(
    newid,
  );
  if (chipIndex < 0) {
    // ???
    return;
  }
  customPartsActions.setCurrentChip({
    chipIndex,
  });
}
