import keyStore from '../stores/key';

import {
    run,
} from './command';

// KeyEvent#keyを文字列で表す
export interface KeyButton{
    key: string;
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
}
export function keyString({key, shift, ctrl, alt}: KeyButton): string{
    return (
        (alt ? 'Alt:' : '') +
        (ctrl ? 'Ctrl:' : '') +
        (shift ? 'Shift:' : '') +
        key.toLowerCase());
}

export function runByKey(key: KeyButton): boolean{
    const k = keyString(key);

    const com = keyStore.state.binding[k];
    if (com != null){
        run(com);
        return true;
    }else{
        return false;
    }
}
