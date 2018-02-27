// command
import editStore from '../stores/edit';
import * as editActions from '../actions/edit';
import * as editLogics from '../logics/edit';
import * as historyLogics from './history';
import {
    MasaoJSONFormat,
} from '../scripts/masao';

// 定義されたコマンド
export type Command =
    // mode change
    'mode:pen' | 'mode:eraser' | 'mode:hand' | 'mode:spuit' | 'mode:rect' | 'mode:fill' |
    // scroll command
    'scroll:up' | 'scroll:right' | 'scroll:down' | 'scroll:left' |
    // cursor command
    'cursor:up' | 'cursor:right' | 'cursor:down' | 'cursor:left' |
    'cursor:jump' | 'cursor:vanish' | 'cursor:button' |
    // history command
    'back' | 'forward';

export const commandNames: Record<Command, string> = {
    'mode:pen': 'ペンツール',
    'mode:eraser': 'イレイサーツール',
    'mode:hand': 'ハンドツール',
    'mode:spuit': 'スポイトツール',
    'mode:rect': '四角形ツール',
    'mode:fill': '塗りつぶしツール',

    'scroll:up': '上にスクロール',
    'scroll:right': '右にスクロール',
    'scroll:down': '下にスクロール',
    'scroll:left': '左にスクロール',

    'back': '戻る',
    'forward': 'やり直す',

    'cursor:up': 'カーソル上',
    'cursor:right': 'カーソル右',
    'cursor:down': 'カーソル下',
    'cursor:left': 'カーソル左',
    'cursor:jump': 'カーソルフォーカス移動',
    'cursor:vanish': 'カーソル消去',
    'cursor:button': 'カーソルボタン',
};

/**
 * エディタの外部で処理すべきイベント
 */
export type ExternalCommand =
    | ETestplayCommand
    | EEscapeCommand
;

/**
 * Command of test play.
 */
export interface ETestplayCommand {
    type: 'testplay';
    /**
     * Game to test play.
     */
    game: MasaoJSONFormat;
    /**
     * Start stage.
     */
    stage: number;
}

/**
 * Command of escape key.
 * XXX should this be handled inside the editor?
 */
export interface EEscapeCommand {
    type: 'escape';
}

/**
 * コマンドを実行
 * @returns 有効なコマンドが実行されたか
 */
export function run(command: Command, keydown: boolean): boolean{
    const {
        focus,
        cursor,
    } = editStore.state;
    if (focus == null && command !== 'cursor:jump'){
        return false;
    }
    if (focus != null && cursor == null){
        // カーソルを有効化
        editLogics.setCursor(focus);
    }
    if (keydown === true){
        switch(command){
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
    }else{
        switch(command){
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
