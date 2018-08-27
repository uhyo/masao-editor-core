import { Command } from './def';
import * as customPartsLogics from '../custom-parts';
import customPartsStore from '../../stores/custom-parts';

/**
 * カスタムパーツ画面のコマンドを実行
 */
export function runCustomPartsCommand(
  command: Command,
  keydown: boolean,
): boolean {
  if (!keydown) {
    return false;
  }
  const { focus } = customPartsStore.state;
  // カーソル系はフォーカスがあるときのみ
  if (focus !== 'chipselect') {
    return false;
  }
  switch (command) {
    case 'cursor:up': {
      customPartsLogics.moveCursorBy({
        x: 0,
        y: -1,
      });
      break;
    }
    case 'cursor:right': {
      customPartsLogics.moveCursorBy({
        x: 1,
        y: 0,
      });
      break;
    }
    case 'cursor:down': {
      customPartsLogics.moveCursorBy({
        x: 0,
        y: 1,
      });
      break;
    }
    case 'cursor:left': {
      customPartsLogics.moveCursorBy({
        x: -1,
        y: 0,
      });
      break;
    }
    case 'cursor:button': {
      customPartsLogics.cursorButton();
      break;
    }
    default: {
      return false;
    }
  }
  return true;
}
