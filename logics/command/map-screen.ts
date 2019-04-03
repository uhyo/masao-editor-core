import editStore from '../../stores/edit';
import * as editActions from '../../actions/edit';
import * as editLogics from '../edit';
import * as historyLogics from '../history';
import { Command } from './def';

/**
 * Run command for map screen.
 */
export function runMapCommand(command: Command, keydown: boolean): boolean {
  const { focus, cursor } = editStore.state;

  if (focus != null && cursor == null) {
    // カーソルを有効化
    editLogics.setCursor(focus);
  }
  if (keydown === true) {
    switch (command) {
      case 'mode:pen': {
        editActions.changeMode({
          mode: 'pen',
        });
        break;
      }
      case 'mode:eraser': {
        editActions.changeMode({
          mode: 'eraser',
        });
        break;
      }
      case 'mode:hand': {
        editActions.changeMode({
          mode: 'hand',
        });
        break;
      }
      case 'mode:spuit': {
        editActions.changeMode({
          mode: 'spuit',
        });
        break;
      }
      case 'mode:rect': {
        editActions.changeMode({
          mode: 'rect',
        });
        break;
      }
      case 'mode:fill': {
        editActions.changeMode({
          mode: 'fill',
        });
        break;
      }
      case 'mode:select': {
        editActions.changeMode({
          mode: 'select',
        });
        break;
      }
      case 'scroll:up': {
        editLogics.scrollBy({
          x: 0,
          y: -1,
        });
        break;
      }
      case 'scroll:right': {
        editLogics.scrollBy({
          x: 1,
          y: 0,
        });
        break;
      }
      case 'scroll:down': {
        editLogics.scrollBy({
          x: 0,
          y: 1,
        });
        break;
      }
      case 'scroll:left': {
        editLogics.scrollBy({
          x: -1,
          y: 0,
        });
        break;
      }
      case 'cursor:up': {
        editLogics.moveCursorBy({
          x: 0,
          y: -1,
        });
        break;
      }
      case 'cursor:right': {
        editLogics.moveCursorBy({
          x: 1,
          y: 0,
        });
        break;
      }
      case 'cursor:down': {
        editLogics.moveCursorBy({
          x: 0,
          y: 1,
        });
        break;
      }
      case 'cursor:left': {
        editLogics.moveCursorBy({
          x: -1,
          y: 0,
        });
        break;
      }
      case 'cursor:jump': {
        editLogics.cursorJump();
        break;
      }
      case 'cursor:vanish': {
        return editLogics.removeCursor();
      }
      case 'cursor:button': {
        editLogics.cursorButton(true);
        break;
      }
      case 'back': {
        historyLogics.back(editStore.state.stage);
        break;
      }
      case 'forward': {
        historyLogics.forward(editStore.state.stage);
        break;
      }
      default: {
        return false;
      }
    }
  } else {
    switch (command) {
      case 'cursor:button': {
        editLogics.cursorButton(false);
        break;
      }
      default: {
        return false;
      }
    }
  }
  return true;
}
