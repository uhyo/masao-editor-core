// key-command binding
import { Store } from '../scripts/reflux-util';
import { Command } from '../logics/command';

const defaultBinding: Record<string, Command> = {
  // モード変更
  q: 'mode:pen',
  w: 'mode:eraser',
  e: 'mode:hand',
  r: 'mode:spuit',
  t: 'mode:rect',
  y: 'mode:fill',

  // スクロール
  'Alt:arrowup': 'scroll:up',
  'Alt:arrowright': 'scroll:right',
  'Alt:arrowdown': 'scroll:down',
  'Alt:arrowleft': 'scroll:left',
  'Alt:k': 'scroll:up',
  'Alt:l': 'scroll:right',
  'Alt:j': 'scroll:down',
  'Alt:h': 'scroll:left',

  // 進む-戻る
  'Ctrl:z': 'back',
  'Ctrl:Shift:z': 'forward',
  'Ctrl:r': 'forward',

  // カーソル
  arrowup: 'cursor:up',
  arrowright: 'cursor:right',
  arrowdown: 'cursor:down',
  arrowleft: 'cursor:left',
  k: 'cursor:up',
  l: 'cursor:right',
  j: 'cursor:down',
  h: 'cursor:left',
  // 'tab': 'cursor:jump',
  escape: 'cursor:vanish',
  z: 'cursor:button',
};

export interface KeyState {
  binding: Record<string, Command>;
}

export class KeyStore extends Store<KeyState> {
  constructor() {
    super();
    this.listenables = [];

    this.state = {
      binding: defaultBinding,
    };
  }
}

export default new KeyStore();
