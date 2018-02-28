import keyStore from '../stores/key';
import commandStore from '../stores/command';

import { run } from './command';

// KeyEvent#keyを文字列で表す
export interface KeyButton {
  key: string;
  shift: boolean;
  ctrl: boolean;
  alt: boolean;
}
export function keyString({ key, shift, ctrl, alt }: KeyButton): string {
  return (
    (alt ? 'Alt:' : '') +
    (ctrl ? 'Ctrl:' : '') +
    (shift ? 'Shift:' : '') +
    key.toLowerCase()
  );
}

export function runByKey(key: KeyButton, keydown: boolean): boolean {
  const k = keyString(key);
  if (keydown) {
    console.log(k);
  }

  const com = keyStore.state.binding[k];
  // XXX Escapeキーに対する特殊処理
  if (k === 'escape') {
    if (com != null) {
      const ret = run(com, keydown);
      if (ret) {
        return true;
      }
    }
    // escapeキーで特に処理が行われなかったのでデフォルト処理（外部委託）発生
    commandStore.invokeCommand({
      type: 'escape',
    });
    return true;
  }
  if (com != null) {
    return run(com, keydown);
  } else {
    return false;
  }
}
