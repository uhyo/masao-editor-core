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

/**
 * Run a command by key.
 */
export function runByKey(
  key: KeyButton,
  keydown: boolean,
  appDisabled: boolean,
): boolean {
  const k = keyString(key);
  if (keydown && process.env.NODE_ENV !== 'production') {
    console.log(k);
  }

  const com = keyStore.state.binding[k];
  // XXX Escapeキーに対する特殊処理
  if (k === 'escape') {
    if (!appDisabled && com != null) {
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
  if (!appDisabled && com != null) {
    return run(com, keydown);
  } else {
    return false;
  }
}
